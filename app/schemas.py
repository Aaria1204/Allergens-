from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class AllergenDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    allergen: str
    status: str
    confidence: Optional[str] = None
    reason: Optional[str] = None


class DishDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_section: Optional[str] = None
    dish_name: str
    description: Optional[str] = None
    source_text: Optional[str] = None
    verification_status: Optional[str] = None
    allergens: List[AllergenDetail] = []


class RestaurantSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: Optional[str] = None
    google_rating: Optional[float] = None
    vibe_tag: Optional[str] = None
    vibe_tag_confidence: Optional[str] = None
    allergen_percentile: Optional[float] = None


class RestaurantDetail(RestaurantSummary):
    dishes: List[DishDetail] = []


class TagSuggestionCreate(BaseModel):
    suggested_text: str


class TagUpdate(BaseModel):
    vibe_tag: str
