---
name: sourcing-menus
description: Source, extract, and normalize restaurant menus for St. Marks Place, then conservatively classify declared and likely gluten, peanut, and tree-nut allergens. Use when processing one or more MenuAnalyzer restaurants, including restaurants with menu artifacts already saved locally.
compatibility: Created for Zo Computer
metadata:
  author: aaria.zo.computer
---

# Sourcing menus

Process restaurant menus for the St. Marks Place MenuAnalyzer project. Never present inferred allergen information as medical certainty or interpret missing information as allergen-free.

## Inputs

Accept a restaurant name, a list of restaurants, or the project's current restaurant inventory. Match each restaurant by name and St. Marks Place address whenever sourcing or validating a menu.

Project paths:

- Restaurant inventory: `/home/workspace/Projects/MenuAnalyzer/restaurants.json`
- Existing source links: `/home/workspace/Projects/MenuAnalyzer/menu_sources.json`
- Status: `/home/workspace/Projects/MenuAnalyzer/MENU_STATUS.md`
- Raw artifacts: `/home/workspace/Projects/MenuAnalyzer/raw/<restaurant-slug>/`

## Workflow

### 1. Check local inventory first

Inspect the restaurant's raw directory and metadata before searching the web.

A usable local artifact can be a menu PDF, image, raw HTML, rendered HTML, or visible-text capture. If it is readable, sufficiently complete, and for the correct restaurant/location, skip sourcing and continue to extraction.

A saved source URL or metadata without menu content is not a usable artifact. Source or download the menu when the local artifact is missing, unreadable, incomplete, for the wrong location, or clearly outdated. Do not overwrite raw source material; preserve it and add a new artifact when refreshing.

### 2. Source only when needed

Use this order:

1. The restaurant's official website or official menu file.
2. A restaurant-controlled or delivery/ordering page, including DoorDash, Uber Eats, Square, Toast, or a comparable service.
3. Yelp or the Google Maps menu option as a last resort.

Verify the restaurant name and address. Prefer the most complete and current source. Save the raw page, PDF, or image exactly as obtained. For a dynamic page, also save rendered HTML or visible text. Record the source URL, source tier, access timestamp, restaurant identity, location, file type, and any limitations in `metadata.json`.

Do not use search snippets as menu evidence. If no usable menu is available, mark the restaurant for manual review and move on.

### 3. Extract menu text

Convert the usable artifact into text:

- Extract text directly from HTML or text-based PDFs.
- Render JavaScript pages before extraction.
- Use OCR for scanned PDFs and menu images.
- Preserve the menu section, dish name, description, price, modifiers, and every allergen label stated by the restaurant.
- Keep the exact source wording for auditability.
- Do not invent missing ingredients or descriptions.

### 4. Normalize dishes

Create one record per dish. Keep peanuts and tree nuts separate in stored data, even if a later interface combines them as “nuts.” Assess only:

- gluten
- peanut
- tree nut

For each allergen, distinguish:

- `declared`: explicitly stated by the restaurant or source menu
- `likely`: inferred from the dish name, description, or commonly required ingredients
- `unknown`: insufficient evidence

Never translate `unknown` into “safe,” “free from,” or “does not contain.” Do not infer cross-contact. Cross-contact is `unknown` unless the restaurant explicitly provides relevant preparation or facility information.

Use confidence only for inferred findings:

- `high`: the named dish or disclosed ingredient ordinarily requires the allergen, but the menu does not explicitly label it
- `medium`: a common preparation often contains the allergen, but alternatives are plausible
- `low`: weak clue; retain as unknown rather than flagging unless the reason is useful for manual review

Attach a short, concrete reason to every likely allergen. Examples include “breaded preparation commonly uses wheat,” “soy sauce commonly contains wheat,” or “pesto commonly contains tree nuts.” Restaurant-provided claims always remain separate from inference.

## Output schema

Write normalized output as JSON using this structure:

```json
{
  "restaurant_name": "Example Restaurant",
  "address": "00 St Marks Pl, New York, NY 10003",
  "menu_source": {
    "url": "https://example.com/menu",
    "tier": "official",
    "accessed_at": "2026-07-14T15:00:00Z",
    "local_artifact": "raw/example-restaurant/menu.html"
  },
  "menu_section": "Noodles",
  "dish_name": "Spicy Peanut Noodles",
  "description": "Noodles with spicy peanut sauce",
  "price": "$14",
  "declared_allergens": ["peanut"],
  "likely_allergens": [
    {
      "allergen": "gluten",
      "confidence": "medium",
      "reason": "Noodles and soy sauce commonly contain wheat"
    }
  ],
  "cross_contact": "unknown",
  "source_text": "Spicy Peanut Noodles — noodles with spicy peanut sauce — $14",
  "verification_status": "unverified"
}
```

Use `official`, `ordering`, `yelp`, or `google_maps` for `menu_source.tier`. Use UTC ISO 8601 timestamps. Preserve Unicode restaurant and dish names.

## Quality checks

Before marking a restaurant complete:

1. Confirm the source belongs to the correct St. Marks location.
2. Confirm every extracted dish links back to exact source text.
3. Confirm declared and inferred allergens are not mixed.
4. Confirm no allergens other than gluten, peanut, and tree nut were assessed.
5. Confirm no unknown dish is represented as allergen-safe.
6. Confirm raw artifacts and metadata remain available for review.

End with counts for dishes extracted, declared flags, likely flags by confidence, unknown assessments, and items needing manual review.
