from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    google_rating = Column(Float)
    review_count = Column(Integer)
    vibe_tag = Column(String)
    vibe_tag_source = Column(String)
    vibe_tag_confidence = Column(String)

    dishes = relationship("Dish", back_populates="restaurant")
    allergen_scores = relationship("AllergenScore", back_populates="restaurant")
    tag_suggestions = relationship("TagSuggestion", back_populates="restaurant")


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
    allergen = Column(String, nullable=False)
    status = Column(String, nullable=False)
    confidence = Column(String)
    reason = Column(Text)

    dish = relationship("Dish", back_populates="allergens")


class AllergenScore(Base):
    __tablename__ = "allergen_scores"

    id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    allergen = Column(String, nullable=False)
    safe_pct = Column(Float, nullable=False)
    percentile = Column(Float, nullable=False)

    restaurant = relationship("Restaurant", back_populates="allergen_scores")


class TagSuggestion(Base):
    __tablename__ = "tag_suggestions"

    id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    suggested_text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, server_default=func.now())
    status = Column(String, nullable=False, server_default="pending")

    restaurant = relationship("Restaurant", back_populates="tag_suggestions")
