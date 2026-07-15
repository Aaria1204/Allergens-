from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Restaurant, TagSuggestion
from app.schemas import TagSuggestionCreate, TagUpdate

router = APIRouter(prefix="/restaurants", tags=["tags"])


@router.post("/{restaurant_id}/tag-suggestion", status_code=201)
def create_tag_suggestion(
    restaurant_id: int, body: TagSuggestionCreate, db: Session = Depends(get_db)
):
    restaurant = db.get(Restaurant, restaurant_id)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="restaurant not found")

    suggestion = TagSuggestion(
        restaurant_id=restaurant_id,
        suggested_text=body.suggested_text,
        status="pending",
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)

    return {
        "id": suggestion.id,
        "restaurant_id": suggestion.restaurant_id,
        "suggested_text": suggestion.suggested_text,
        "status": suggestion.status,
        "submitted_at": suggestion.submitted_at,
    }


@router.patch("/{restaurant_id}/tag")
def update_tag(restaurant_id: int, body: TagUpdate, db: Session = Depends(get_db)):
    restaurant = db.get(Restaurant, restaurant_id)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="restaurant not found")

    restaurant.vibe_tag = body.vibe_tag
    restaurant.vibe_tag_source = "user"
    db.commit()

    return {
        "id": restaurant.id,
        "vibe_tag": restaurant.vibe_tag,
        "vibe_tag_source": restaurant.vibe_tag_source,
    }
