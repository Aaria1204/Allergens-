"""Classify each restaurant's vibe tag via the Anthropic API, from its reviews."""
import json
import os
import re
import time

import anthropic
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "menu_analyzer.db")
RESTAURANTS_JSON = os.path.join(BASE_DIR, "restaurants.json")

MODEL = "claude-haiku-4-5-20251001"
VIBE_TAGS = {"Fine Dining", "Cafe/Bistro", "Fast Casual"}
CONFIDENCE_LEVELS = {"high", "medium", "low"}
CALL_DELAY_SECONDS = 0.5
MAX_RETRIES = 2

PROMPT_TEMPLATE = """Based on these three customer reviews of a restaurant, classify its dining vibe.

Reviews:
{reviews}

Classify the restaurant as exactly one of: "Fine Dining", "Cafe/Bistro", "Fast Casual".
Give a confidence level: "high", "medium", or "low".

Return ONLY strict JSON in this exact shape, with no other text:
{{"vibe_tag": "<one of the three categories>", "confidence": "<high|medium|low>"}}
"""


def normalize_restaurant_name(name):
    if name == "Thursday Kitchen | Korean":
        return "Thursday Kitchen"
    return name


def load_reviews_by_name():
    restaurants = json.load(open(RESTAURANTS_JSON))
    reviews_by_name = {}
    for r in restaurants:
        name = normalize_restaurant_name(r["name"])
        reviews_by_name[name] = r.get("reviews", [])
    return reviews_by_name


def extract_json(raw_text):
    raw_text = raw_text.strip()
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if not match:
        raise ValueError(f"no JSON object found in response: {raw_text!r}")
    return json.loads(match.group(0))


def classify_restaurant(client, name, reviews):
    reviews_text = "\n\n".join(
        f"Review {i + 1}: {r.get('text', '')}" for i, r in enumerate(reviews)
    )
    prompt = PROMPT_TEMPLATE.format(reviews=reviews_text)

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=100,
                messages=[{"role": "user", "content": prompt}],
            )
            raw_text = response.content[0].text
            parsed = extract_json(raw_text)

            vibe_tag = parsed.get("vibe_tag")
            confidence = parsed.get("confidence")
            if vibe_tag not in VIBE_TAGS:
                raise ValueError(f"unexpected vibe_tag: {vibe_tag!r}")
            if confidence not in CONFIDENCE_LEVELS:
                raise ValueError(f"unexpected confidence: {confidence!r}")

            return vibe_tag, confidence
        except Exception as exc:
            last_error = exc
            if attempt < MAX_RETRIES:
                time.sleep(CALL_DELAY_SECONDS * (attempt + 1))
                continue

    print(f"  SKIPPED {name}: {last_error}")
    return None, None


def main():
    load_dotenv()
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set (check .env)")

    client = anthropic.Anthropic(api_key=api_key)

    engine = create_engine(f"sqlite:///{DB_PATH}")
    with engine.begin() as conn:
        existing_cols = {row[1] for row in conn.execute(text("PRAGMA table_info(restaurants)"))}
        if "vibe_tag" not in existing_cols:
            conn.execute(text("ALTER TABLE restaurants ADD COLUMN vibe_tag TEXT"))
        if "vibe_tag_source" not in existing_cols:
            conn.execute(text("ALTER TABLE restaurants ADD COLUMN vibe_tag_source TEXT"))
        if "vibe_tag_confidence" not in existing_cols:
            conn.execute(text("ALTER TABLE restaurants ADD COLUMN vibe_tag_confidence TEXT"))

    reviews_by_name = load_reviews_by_name()

    with engine.connect() as conn:
        restaurants = conn.execute(text("SELECT id, name FROM restaurants")).all()

    tag_counts = {tag: 0 for tag in VIBE_TAGS}
    skipped = []

    for restaurant_id, name in restaurants:
        reviews = reviews_by_name.get(normalize_restaurant_name(name))
        if not reviews:
            print(f"  SKIPPED {name}: no reviews found in restaurants.json")
            skipped.append(name)
            continue

        vibe_tag, confidence = classify_restaurant(client, name, reviews)
        time.sleep(CALL_DELAY_SECONDS)

        if vibe_tag is None:
            skipped.append(name)
            continue

        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    UPDATE restaurants
                    SET vibe_tag = :vibe_tag,
                        vibe_tag_source = 'ai',
                        vibe_tag_confidence = :confidence
                    WHERE id = :rid
                    """
                ),
                {"vibe_tag": vibe_tag, "confidence": confidence, "rid": restaurant_id},
            )
        tag_counts[vibe_tag] += 1
        print(f"  {name}: {vibe_tag} ({confidence})")

    print()
    print("Vibe tag counts:")
    for tag, count in tag_counts.items():
        print(f"  {tag}: {count}")
    print(f"Skipped/failed: {len(skipped)}")
    for name in skipped:
        print(f"  - {name}")


if __name__ == "__main__":
    main()
