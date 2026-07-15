"""Build data/menu_analyzer.db from restaurants.json + normalized/*.json."""
import glob
import json
import os
import re
import unicodedata

from sqlalchemy import Column, ForeignKey, Integer, String, Text, Float, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "menu_analyzer.db")
RESTAURANTS_JSON = os.path.join(BASE_DIR, "restaurants.json")
NORMALIZED_DIR = os.path.join(BASE_DIR, "normalized")

Base = declarative_base()


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    google_rating = Column(Float)
    review_count = Column(Integer)

    dishes = relationship("Dish", back_populates="restaurant")


class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    menu_section = Column(String)
    dish_name = Column(String, nullable=False)
    description = Column(Text)
    source_text = Column(Text)
    verification_status = Column(String)

    restaurant = relationship("Restaurant", back_populates="dishes")
    allergens = relationship("DishAllergen", back_populates="dish")


class DishAllergen(Base):
    __tablename__ = "dish_allergens"

    id = Column(Integer, primary_key=True)
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=False)
    allergen = Column(String, nullable=False)  # gluten / peanut / tree_nut
    status = Column(String, nullable=False)  # declared / likely
    confidence = Column(String)  # nullable
    reason = Column(Text)  # nullable

    dish = relationship("Dish", back_populates="allergens")


ALLERGEN_MAP = {
    "gluten": "gluten",
    "peanut": "peanut",
    "tree nut": "tree_nut",
}


def slugify(name):
    s = unicodedata.normalize("NFKD", name)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = s.lower()
    s = re.sub(r"[']", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def normalize_restaurant_name(name):
    if name == "Thursday Kitchen | Korean":
        return "Thursday Kitchen"
    return name


def load_normalized_index():
    index = {}
    for path in glob.glob(os.path.join(NORMALIZED_DIR, "*.json")):
        slug = os.path.splitext(os.path.basename(path))[0]
        index[slug] = path
    return index


def main():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    engine = create_engine(f"sqlite:///{DB_PATH}")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    restaurants = json.load(open(RESTAURANTS_JSON))
    normalized_index = load_normalized_index()

    loaded = []
    skipped = []

    allergen_counts = {}  # (allergen, status) -> count
    total_dishes = 0

    for r in restaurants:
        display_name = r["name"]
        match_name = normalize_restaurant_name(display_name)
        slug = slugify(match_name)

        normalized_path = normalized_index.get(slug)
        if normalized_path is None:
            skipped.append((display_name, "no matching normalized file"))
            continue

        dishes_data = json.load(open(normalized_path))
        if not dishes_data:
            skipped.append((display_name, "empty normalized file"))
            continue

        restaurant = Restaurant(
            name=display_name,
            address=r.get("address"),
            lat=r.get("lat"),
            lng=r.get("lng"),
            google_rating=r.get("rating"),
            review_count=r.get("review_count"),
        )
        session.add(restaurant)
        session.flush()  # assign restaurant.id

        for d in dishes_data:
            dish = Dish(
                restaurant_id=restaurant.id,
                menu_section=d.get("menu_section"),
                dish_name=d.get("dish_name"),
                description=d.get("description"),
                source_text=d.get("source_text"),
                verification_status=d.get("verification_status"),
            )
            session.add(dish)
            session.flush()  # assign dish.id
            total_dishes += 1

            for declared in d.get("declared_allergens", []):
                allergen = ALLERGEN_MAP[declared]
                session.add(
                    DishAllergen(
                        dish_id=dish.id,
                        allergen=allergen,
                        status="declared",
                        confidence=None,
                        reason=None,
                    )
                )
                allergen_counts[(allergen, "declared")] = (
                    allergen_counts.get((allergen, "declared"), 0) + 1
                )

            for likely in d.get("likely_allergens", []):
                allergen = ALLERGEN_MAP[likely["allergen"]]
                session.add(
                    DishAllergen(
                        dish_id=dish.id,
                        allergen=allergen,
                        status="likely",
                        confidence=likely.get("confidence"),
                        reason=likely.get("reason"),
                    )
                )
                allergen_counts[(allergen, "likely")] = (
                    allergen_counts.get((allergen, "likely"), 0) + 1
                )

        loaded.append(display_name)

    session.commit()
    session.close()

    print(f"Restaurants loaded: {len(loaded)}")
    print(f"Restaurants skipped: {len(skipped)}")
    for name, reason in skipped:
        print(f"  - {name} ({reason})")
    print(f"Total dishes: {total_dishes}")
    print("Allergen rows by type/status:")
    for (allergen, status), count in sorted(allergen_counts.items()):
        print(f"  {allergen} / {status}: {count}")
    total_allergen_rows = sum(allergen_counts.values())
    print(f"Total allergen rows: {total_allergen_rows}")


if __name__ == "__main__":
    main()
