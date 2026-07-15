# MenuAnalyzer — Sourcing Status

Last updated: 2026-07-14

Restaurant inventory: `restaurants.json` (54 restaurants total). Processed in list order, 5 at a time per run.

## Batch 1 of 11 (restaurants 1–5) — DONE

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 1 | Alison | 110 St Marks Pl | ordering (DoorDash) | Partial — only Lunch-Appetizers section recovered; DoorDash listing showed as inactive at access time. Manual review recommended. |
| 2 | JOJU - East Village | 33 St Marks Pl | official | Complete |
| 3 | KENKA | 25 St Marks Pl | yelp (last resort) | Complete, but sourced from Yelp after official site (kenkanewyork.com) proved to be a low-quality/inaccurate auto-generated page and an unofficial mirror site had no menu. Yelp itself warns the listing "may not be up to date." Manual review recommended. |
| 4 | Cafe Mogador | 101 St Marks Pl | official (PDF) | Complete |
| 5 | Pizza Studio Tamaki | 123 St Marks Pl | official | Complete |

## Batch 2 of 11 (restaurants 6–10) — DONE (sourced via 5 parallel subagents)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 6 | Crispiano | 130 St Marks Pl | official | Complete |
| 7 | Nan Xiang Soup Dumplings - East Village | 15 St Marks Pl | ordering | Complete. Multi-location chain (Flushing, Koreatown, East Village) — verified against corporate site to confirm correct location. |
| 8 | Loong Noodles | 28 St Marks Pl | official | Complete. Official menu already carried explicit "wheat"/"peanut" labels in dish text, reducing reliance on inference. A decoy plural domain (loongnoodles.com) was checked and rejected. |
| 9 | Soothr | 204 E 13th St | official | Complete |
| 10 | Spot Dessert Bar East Village | 13 St Marks Pl | ordering | Complete. 5-location chain — official site's combined menu isn't location-specific, so cross-referenced against the St Marks Toast ordering page to confirm which items are actually sold there; excluded items only seen on the combined site. |

## Batch 3 of 11 (restaurants 11–15) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 11 | Café Maud | 132 2nd Ave | official | Complete, manual review recommended — Drinks tab (cocktails/wine/beer/coffee) didn't render within the time box, so beverages are entirely absent from this dataset. Also: official site lists zip 10002 vs. inventory's 10003 for the same East Village address; treated as the same location. |
| 12 | CHELI MANHATTAN 浙里 | 19 St Marks Pl | official | Complete — sourced cleanly on first attempt, well within time box. |
| 13 | Empellon Al Pastor | 132 St Marks Pl | official (PDF) | Complete, manual review recommended — the site's current (2026) menu PDF was image-based/non-extractable; fell back to an older (Nov 2021) official PDF, so dishes/prices may be stale. |
| 14 | Mokyo | 109 St Marks Pl | official (PDF) | Complete — sourced cleanly, no allergen icons on menu so all classifications are inferred. |
| 15 | The Rhymers' Club | 37 1/2 St Marks Pl | official | Complete, manual review recommended — Brunch, "TRC Before Dark," and Events tabs weren't captured within the time box (deprioritized as secondary to the main menu); only the main Cocktails/Shareables/Plates/Salads/Pizza/Dessert/Wine tabs were captured. |

No restaurants were skipped this batch — all 5 landed a usable menu within the 5-minute sourcing budget, though 3 of the 5 have partial-coverage caveats noted above (tracked as manual review, not full skips).

## Batch 4 of 11 (restaurants 16–20) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 16 | Hanoi House | 119 St Marks Pl | official | Complete |
| 17 | 886 | 26 St Marks Pl | official (PDF) | Complete, manual review recommended — menu PDF's allergen icon legend ("Contains Peanuts"/"Contains Shellfish") didn't survive text extraction attached to specific dishes, so some peanut exposure beyond the 2 explicitly-named cases may be uncaptured. |
| 18 | Baohaus | 97 St Marks Pl | official | Complete, manual review recommended — restaurant reopened at this address in early 2026 after a 2020 closure; menu is entirely new with minimal per-dish ingredient text beyond one blanket peanut disclosure ("all baos contain peanuts, can be served without by request"), so most calls are culinary inference. |
| 19 | Little Kirin | 81 St Marks Pl | official | Complete |
| 20 | Kimura | 31 St Marks Pl | — | **SKIPPED — needs revisit.** Identity confirmed, but official site's menu is a photo-gallery only (no extractable text), Seamless returned an empty JS shell, and Grubhub only rendered a 5-item "Best Sellers" list — its 14 full category tabs didn't expand within the time box. |

## Batch 5 of 11 (restaurants 21–25) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 21 | Dumpling N' Dips | 5 St Marks Pl | official | Complete — official site had explicit per-dish "Contains:" allergen statements, an unusually clean source. |
| 22 | Udon St Marks | 11 St Marks Pl | ordering (Grubhub) | Complete, manual review recommended — official site menu is photo-only (no text); Grubhub's Set Menu and Drink categories didn't finish rendering within the time box and are missing from this dataset. |
| 23 | Thursday Kitchen | 424 E 9th St | official (PDF) | Complete |
| 24 | Anytime Street | 34 St Marks Pl | — | **SKIPPED — needs revisit.** Official site (res-menu.com template) rendered empty; Grubhub only exposed a "Best Sellers" tab (3 combos, 2 undescribed) and the Cupbop/Side Menu/Soda category tabs wouldn't expand in time. |
| 25 | Crif Dogs | 113 St Marks Pl | official | Complete — cleanly scoped to the hot dog menu only, no PDT (hidden speakeasy) crossover. |

## Needs Revisit

| Restaurant | Address | What was tried | Suggested next step |
|---|---|---|---|
| Kimura | 31 St Marks Pl, New York, NY 10003 | Official site (photo-gallery menu, no text), Seamless (empty JS shell), Grubhub (Chrome-rendered, only "Best Sellers" module expanded — 14 category tabs didn't lazy-load in time) | Retry Grubhub with slower scroll/click-through per category tab, or OCR the official site's menu photos, or check kimuranyc.com's separate Lunch/Drinks sub-pages |
| Anytime Street | 34 St Marks Pl, New York, NY 10003 | Official site (dead res-menu.com template, empty render), Grubhub (Chrome-rendered, only "Best Sellers" tab expanded — Cupbop/Side Menu/Soda tabs wouldn't expand) | Retry Grubhub with more patient per-tab scroll/click, or check DoorDash/Uber Eats/Seamless for the same address, or call for a menu |

## Batch 6 of 11 (restaurants 26–30) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 26 | Yakitori Taisho | 9 St Marks Pl | google_maps (aggregator) | Complete, manual review recommended — Yelp shows "Yakitori Taisho" as closed at a *different* address (5 St Marks Pl), while the active business at 9 St Marks Pl appears to be renamed "Oh Taisho"/"Oh! Taisho." Address match is exact and content is detailed, but business-name currency should be human-verified. |
| 27 | Mountain House East Village | 23 St Marks Pl | ordering (Chowbus) | Complete — official Wix site had no inline menu text, so used the restaurant's own Chowbus ordering page instead. A Drink Menu tab exists but wasn't expanded in time; no beverage records were fabricated to compensate. |
| 28 | Mamoun's Falafel | 30 St Marks Pl | official | Complete, manual review recommended — sourced from Mamoun's chain-wide national menu (location page confirmed the address, but item availability/pricing wasn't separately confirmed for this specific location; some items are marked "select locations only" on the source). |
| 29 | Cello's Pizzeria | 36 St Marks Pl | official (PDF) | Complete, manual review recommended — PDF text extraction flattened the visual pricing table, so whole-pie vs. slice prices were reconstructed by positional order-matching rather than confirmed cell-by-cell. |
| 30 | Butter Smashburgers | 17 St Marks Pl | official | Complete, manual review recommended — no prices published anywhere on the site, and 11 of 12 monthly specials had no description (only the current month's bare name captured as Unknown). |

No restaurants were skipped this batch — all 5 landed a usable menu within the time box, though 4 of the 5 carry manual-review caveats (identity/rename uncertainty, chain-wide vs. location-specific menu, PDF layout reconstruction, missing prices/descriptions).

## Batch 7 of 11 (restaurants 31–35) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 31 | Birria LES | 34 St Marks Pl #12 | ordering | Complete, manual review recommended — unit #12 couldn't be independently confirmed on the ordering page (same street number as batch-5's Anytime Street, a shared building); Drinks tab didn't render; dish descriptions were names-only. |
| 32 | The Bao | 13 St Marks Pl | ordering | **Partial — needs revisit.** Confirmed as a real, distinct business from Spot Dessert Bar at the same address (different tenant). Official site is image-only; Grubhub only exposed a "Best Sellers" tab (12 items) before a tab-state conflict (likely from a concurrently-running sibling agent's browser session) interrupted further category clicks. 8 more categories (Small Dishes, Dim Sum, Rice/Noodles, Soup, Hot Dishes, Vegetable, Lunch Specials, Soda) are missing. |
| 33 | Kyuubi Sushi Omakase | 102 St Marks Pl | ordering | Complete, manual review recommended — only 6 dishes recovered; omakase tiers have no itemized course list (chef's-choice pricing only), and DoorDash's Nigiri/Today Special categories didn't expand in time. No genuine official website exists (only decoy SEO aggregators, rejected). |
| 34 | Klong | 7 St Marks Pl | official (PDF) | Complete, manual review recommended — PDF text extraction had jumbled column ordering in places, reconstructed by adjacency; recommend a visual spot-check. |
| 35 | Veselka | 144 2nd Ave | ordering | Complete, manual review recommended — official site's "menu" pages are blog templates with no real dish content, so sourced from the DoorDash storefront instead; several items lack descriptions (marked Unknown), and no beer/alcohol items were available on this ordering-platform source. **Data-quality note:** this agent's raw output used "tree_nut" instead of "tree nut" for 3 declared-allergen entries — caught during verification and corrected before aggregating. |

No restaurants were fully skipped this batch, though The Bao is a genuine partial (12 of an estimated 9-category menu captured) rather than a clean complete — logged separately below since some real data exists, unlike Kimura/Anytime Street which have zero.

## Partial Coverage (some data captured, but known incomplete — distinct from full skips)

| Restaurant | Address | What's missing | Suggested next step |
|---|---|---|---|
| The Bao | 13 St Marks Pl, New York, NY 10003 | 8 of ~9 menu categories (Small Dishes, Dim Sum, Rice/Noodles, Soup, Hot Dishes, Vegetable, Lunch Specials, Soda) — only "Best Sellers" (12 items) captured | Retry Grubhub in a dedicated single-agent session (no concurrent sibling agents sharing browser state), or OCR the official site's menu images |

## Batch 8 of 11 (restaurants 36–40) — DONE (5 parallel subagents, 5-minute sourcing time box)

| # | Restaurant | Address | Source tier | Status |
|---|---|---|---|---|
| 36 | Bungalow | 24 1st Ave | official | Complete, manual review recommended — official menu has its own bracketed allergen tags (used as declared); Drinks tab wasn't reachable in time (no beverage records); "Low-Gluten" Farmers Sattu Roti conservatively treated as declared gluten (not gluten-free); coconut dishes flagged tree nut per FDA convention (may read as overly cautious to some reviewers). |
| 37 | The Smith | 55 3rd Ave | official | Complete — confirmed correct East Village location among 6+ chain locations. |
| 38 | La Palapa | 77 St Marks Pl | official | Complete — restaurant's own facility-wide allergen disclosure ("cooks with peanuts, tree nuts, shellfish and legumes... kitchen contains items with gluten") applied to every dish's cross_contact field. |
| 39 | Nudibranch | 125 1st Ave | official | Complete — menu is Canva-hosted, needed Chrome rendering to read. |
| 40 | MáLà Project | 122 1st Ave | ordering (Toast) | Complete — restaurant's own allergen tags (nuts/sesame/gluten-free/soy) used where present. Note: one dish, "Herbal Jelly," lists hazelnut milk as an ingredient while simultaneously being tagged "nut-free" by the restaurant — classified as declared tree nut from the named ingredient, with the contradiction preserved in the record for reviewer awareness. |

No restaurants were skipped this batch — all 5 landed a usable, well-sourced menu within the time box, and only Bungalow needed a manual-review flag.

Restaurants 41–54 not yet started — awaiting go-ahead.

## Guidance tier (customer-facing, derived field)

Added a `guidance_tier` field to every normalized dish record and to `dish_allergen_summary.csv`, on top of (not instead of) the skill's core `declared_allergens` / `likely_allergens` / confidence fields, which remain the audit trail:

- **Flagged** — restaurant explicitly names the allergen, or a high-confidence inference (e.g. "wheat skin" stated, or a breaded/fried preparation).
- **Could modify** — medium/low-confidence inference only (e.g. a soy-sauce-based sauce that commonly but not always contains wheat); worth asking staff about.
- **No allergens flagged** — dish has a real description/ingredient list and nothing pointed to gluten, peanut, or tree nut.
- **Unknown** — too little information to assess at all (bare name, no description, e.g. a plain drink name with no listed ingredients).

Note: "No allergens flagged" is deliberately not labeled "Safe." It means nothing in the sourced menu text points to these three allergens — it is not a guarantee of absence (cross-contact, unlisted prep steps, and recipe changes aren't captured). This distinction matters for anyone using this for actual allergy decisions.

## Summary counts — running total (restaurants 1–40, 37 fully sourced + 1 partial + 2 skipped)

- **Total dishes extracted:** 1,769
  - Alison: 4 | JOJU - East Village: 22 | KENKA: 149 | Cafe Mogador: 46 | Pizza Studio Tamaki: 27
  - Crispiano: 47 | Nan Xiang Soup Dumplings - East Village: 92 | Loong Noodles: 30 | Soothr: 54 | Spot Dessert Bar East Village: 37
  - Café Maud: 48 | CHELI MANHATTAN 浙里: 91 | Empellon Al Pastor: 17 | Mokyo: 23 | The Rhymers' Club: 55
  - Hanoi House: 32 | 886: 31 | Baohaus: 53 | Little Kirin: 21 | Kimura: 0 (skipped)
  - Dumpling N' Dips: 42 | Udon St Marks: 59 | Thursday Kitchen: 23 | Anytime Street: 0 (skipped) | Crif Dogs: 30
  - Yakitori Taisho: 116 | Mountain House East Village: 79 | Mamoun's Falafel: 39 | Cello's Pizzeria: 17 | Butter Smashburgers: 19
  - Birria LES: 25 | The Bao: 12 (partial) | Kyuubi Sushi Omakase: 6 | Klong: 64 | Veselka: 107
  - Bungalow: 33 | The Smith: 78 | La Palapa: 71 | Nudibranch: 21 | MáLà Project: 49
- **Guidance tier totals:** Flagged 695, Could modify 328, No allergens flagged 623, Unknown 123
- **Items flagged for manual review:** 18 restaurants — Alison, KENKA, Café Maud, Empellon Al Pastor, The Rhymers' Club, 886, Baohaus, Udon St Marks, Yakitori Taisho, Mamoun's Falafel, Cello's Pizzeria, Butter Smashburgers, Birria LES, The Bao, Kyuubi Sushi Omakase, Klong, Veselka, Bungalow
- **Restaurants fully skipped (needs revisit):** 2 — Kimura, Anytime Street
- **Restaurants partially covered (some real data, known incomplete):** 1 — The Bao (see Partial Coverage table above)

No dish across any batch is represented as allergen-free; unknown always means "insufficient evidence," never "safe."
