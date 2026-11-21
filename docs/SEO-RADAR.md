# SEO Radar — nimania.net

Date opened: 2026-11-21.

## Purpose
Track verified Google Search Console query-level data for the *existing* site and use search-intent clusters to improve editorial restaurant reviews. Do not fabricate search volumes, daily traffic or click performance.

## Baseline from authenticated Search Console
7-day report visible in the connected browser, November 13–19, 2026:
- Whole-site: 15 clicks, 100 impressions, 15% CTR, average position 5.
- The visible query table contained 15 entries; their totals do **not** represent all site-wide queries.
- One screenshot of the last 24 hours supplied 7 visible queries totaling 9 impressions and zero clicks.
- Store capture time and reporting period separately. Google data may be delayed or anonymized.

Native editorial tracking sheet (includes dated source rows):
https://docs.google.com/spreadsheets/d/1SyME0sGdO9pzMKcg4nojMoBP71vI87jqrYV2kfZn0DM/edit

## Search-intent families
1. Venue/brand: Persian and Latin name, city, neighborhood.
2. Review: review, reviews, نقد, تجربه.
3. Menu and price: menu, منو, قیمت, date-stamped.
4. Media: photos, pictures, عکس, تصاویر.
5. People/history: founder, manager, history; corroborate with primary source.
6. Local comparisons: relevant alternatives where editorially justified.
7. Typos: normalize only when naturally useful. Avoid stuffing alternate spellings.

## Site SEO rules
- Preserve every published URL, index status, canonical and sitemap entry (see docs/URL-STABILITY.md).
- Keep the independent review intact; do not assert a first-hand tasting where none occurred.
- Never invent menus, prices, ratings, opening hours or founder identities.
- Use one authoritative page per real venue, not duplicate one-page-per-query doorways.
- Only add accurate names as alternateName; do not assert that every related entity is a local business.
- Title and description changes may be evaluated in Search Console after indexing.
- Dates, price references and observations must have context and known sources.

## Ongoing pipeline
1. Query Search Console property `https://nimania.net/` by authorized API connection. Source must be explicitly user-authorized.
2. Fetch a recent weekly range; save click, impressions, CTR, position **by query plus page** where available, and by day for trend. Avoid counting a partially refreshed same-day result as final.
3. Deduplicate on (date range, query, page, search type, country/device filters).
4. Compare new and previous intervals, mark first-seen queries, near-page-one terms, high impressions/low CTR, indexation gaps and meaningful decay.
5. Map each action to a stable existing URL; supply suggested headline/content only when grounded. Track status: new, proposed, reviewed, published, verified.
6. Append a dated, sourced snapshot to Google Sheets; preserve earlier snapshots.
7. Report top three *real* opportunities in Persian. When API access is absent, say "Search Console not connected"; do not present old rows as newly refreshed.

## Implementation status
- Initial SEO improvements prepared in this feature branch for Offside, Barok, Ciabbata Cucina, Gav Burger and Tehran Fried Chicken.
- Continuous authenticated Search Console extraction requires user-approved OAuth/plugin connection; a visible browser tab is not a persistent API authorization.
- The site’s existing indexable routes must remain stable.
