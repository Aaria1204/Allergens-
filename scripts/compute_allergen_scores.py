"""Compute per-restaurant allergen safety scores into allergen_scores."""
import os
import statistics

from scipy.stats import percentileofscore
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "menu_analyzer.db")

ALLERGENS = ["gluten", "tree_nut"]


def main():
    engine = create_engine(f"sqlite:///{DB_PATH}")

    with engine.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS allergen_scores"))
        conn.execute(
            text(
                """
                CREATE TABLE allergen_scores (
                    id INTEGER PRIMARY KEY,
                    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
                    allergen TEXT NOT NULL,
                    safe_pct REAL NOT NULL,
                    percentile REAL NOT NULL
                )
                """
            )
        )

    Session = sessionmaker(bind=engine)
    session = Session()

    restaurant_ids = [row[0] for row in session.execute(text("SELECT id FROM restaurants")).all()]

    for allergen in ALLERGENS:
        safe_pcts = {}  # restaurant_id -> safe_pct

        for restaurant_id in restaurant_ids:
            dish_count = session.execute(
                text("SELECT COUNT(*) FROM dishes WHERE restaurant_id = :rid"),
                {"rid": restaurant_id},
            ).scalar()

            unsafe_count = session.execute(
                text(
                    """
                    SELECT COUNT(DISTINCT d.id)
                    FROM dishes d
                    JOIN dish_allergens da ON da.dish_id = d.id
                    WHERE d.restaurant_id = :rid AND da.allergen = :allergen
                    """
                ),
                {"rid": restaurant_id, "allergen": allergen},
            ).scalar()

            safe_count = dish_count - unsafe_count
            safe_pcts[restaurant_id] = safe_count / dish_count

        # Percentile rank (0-100) of each restaurant's safe_pct relative to the
        # other 38 (all 39 values including itself form the reference distribution).
        # scipy.stats.percentileofscore(kind='rank') is used: for a tied score,
        # the percentile is the average of all ranks that score would occupy
        # (i.e. ties share the same percentile rather than being broken by order).
        all_values = list(safe_pcts.values())
        for restaurant_id, safe_pct in safe_pcts.items():
            percentile = percentileofscore(all_values, safe_pct, kind="rank")
            session.execute(
                text(
                    """
                    INSERT INTO allergen_scores (restaurant_id, allergen, safe_pct, percentile)
                    VALUES (:rid, :allergen, :safe_pct, :percentile)
                    """
                ),
                {
                    "rid": restaurant_id,
                    "allergen": allergen,
                    "safe_pct": safe_pct,
                    "percentile": percentile,
                },
            )

        session.commit()

        values = list(safe_pcts.values())
        zero_count = sum(1 for v in values if v == 0.0)
        hundred_count = sum(1 for v in values if v == 1.0)
        print(f"{allergen}:")
        print(f"  min safe_pct:    {min(values):.4f}")
        print(f"  max safe_pct:    {max(values):.4f}")
        print(f"  median safe_pct: {statistics.median(values):.4f}")
        print(f"  restaurants at 0%:   {zero_count}")
        print(f"  restaurants at 100%: {hundred_count}")

    session.close()


if __name__ == "__main__":
    main()
