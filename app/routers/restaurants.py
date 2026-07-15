from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AllergenScore, Dish, Restaurant
from app.schemas import DishDetail, RestaurantDetail, RestaurantSummary

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

VALID_ALLERGENS = {"gluten", "tree_nut"}


@router.get("", response_model=List[RestaurantSummary])
def list_restaurants(allergen: str = "gluten", db: Session = Depends(get_db)):
    if allergen not in VALID_ALLERGENS:
        raise HTTPException(
            status_code=400,
            detail=f"allergen must be one of {sorted(VALID_ALLERGENS)}, got {allergen!r}",
        )

    rows = (
        db.query(Restaurant, AllergenScore.percentile)
        .outerjoin(
            AllergenScore,
            (AllergenScore.restaurant_id == Restaurant.id)
            & (AllergenScore.allergen == allergen),
        )
        .all()
    )

    return [
        RestaurantSummary(
            id=restaurant.id,
            name=restaurant.name,
            address=restaurant.address,
            google_rating=restaurant.google_rating,
            vibe_tag=restaurant.vibe_tag,
            vibe_tag_confidence=restaurant.vibe_tag_confidence,
            allergen_percentile=percentile,
        )
        for restaurant, percentile in rows
    ]


@router.get("/{restaurant_id}/menu", response_model=RestaurantDetail)
def get_restaurant_menu(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.get(Restaurant, restaurant_id)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="restaurant not found")

    dishes = db.query(Dish).filter(Dish.restaurant_id == restaurant_id).all()

    return RestaurantDetail(
        id=restaurant.id,
        name=restaurant.name,
        address=restaurant.address,
        google_rating=restaurant.google_rating,
        vibe_tag=restaurant.vibe_tag,
        vibe_tag_confidence=restaurant.vibe_tag_confidence,
        allergen_percentile=None,
        dishes=[DishDetail.model_validate(dish) for dish in dishes],
    )
