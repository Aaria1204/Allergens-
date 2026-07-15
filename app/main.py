from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import restaurants, tags

# Base.metadata.create_all only creates tables that don't already exist
# (e.g. tag_suggestions), leaving the existing restaurants/dishes/
# dish_allergens/allergen_scores tables untouched.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MenuAnalyzer API")

# Allow all origins for now since this is local dev only.
# Restrict this to specific origins before any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(restaurants.router)
app.include_router(tags.router)
