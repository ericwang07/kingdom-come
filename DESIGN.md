# Kingdom Come — Design & Content Spec

Decisions from the Sept 2026 planning session. Winter 2026 retreat.
Direction: **Lantern** (see the type proofs artifact for the visual).

---

## 1. Pages

| Path | Page | Purpose |
|---|---|---|
| `/` | Home | What this is, when it is, how to sign up, FAQ |
| `/about.html` | About | Why Kingdom Come, Vision, Mission, Doctrinal Values, hosting churches |
| `/event.html` | Event Info | Theme, details, schedule, packing, guidelines, counselor block |
| `/apply/` | Counselor Application | Existing form + pastoral reference. Untouched logic, restyled later. |
| → JotForm | Registration | External. Student registration stays on JotForm (it collects payment). |

Scope is **Winter 2026 only**. Past photos are used as atmosphere, never labeled by year.

### Home
1. Hero — rotating dimmed photo carousel; crown, description, Matthew 6:33, `Dec 28–30, 2026 · Camp Wightman, CT`, `Register →`
2. FAQ scene — an opaque FAQ panel resting on a floor of scattered photographic
   prints, warm-toned with grain and a light falloff over the whole surface
3. Footer

### About
1. Splash ~55vh, single still photo, Matthew 6:10 set large, no button
2. Why Kingdom Come? — text only, no images
3. Vision — text left / image right
4. Mission — image left / text right
5. Doctrinal Values — 7 items, 2-column card grid, 1 column on mobile
6. Hosting Churches — three logos + links
7. Footer

Background/History section is deferred; a slot is held for it above Vision.

### Event Info
Opens **plain** — no photo splash. Big type on white, date and venue underneath.
1. Page header — "Winter 2026 Retreat" + date/venue
2. **Theme** — the headline of the page. Centered, bordered, largest type on the site once it lands.
3. Details — 2-column list: Dates, Location, Who, Cost, Deadline, Speaker
4. Register band — night navy, one button
5. Schedule · 6. What to Pack · 7. Guidelines — all TBA for now
8. Counselor application block — photo + `Apply →`
9. "Still have questions? See the FAQ →"

No sub-nav. FAQ lives on Home only and is not repeated here.

---

## 2. Known content

- **Dates** December 28–30, 2026
- **Venue** Camp Wightman, 207 Coal Pit Hill Rd, Griswold, CT 06351 — link https://www.campwightman.org/
- **Who** Middle and high school students
- **Verses** Two, doing different jobs. **Matthew 6:33** on Home is the invitation
  (&ldquo;seek first&rdquo;). **Matthew 6:10** on the About splash is the identity &mdash; it is the
  verse the conference name is taken from, and it sets up the &ldquo;Why Kingdom Come?&rdquo;
  section directly below it. Both quoted in ESV; don't mix translations.
- **Hosting churches** Church of the Ascent · Covenant Chapel · New England Grace Presbyterian
- **Email** kingdomcomeyouthconference@gmail.com *(placeholder — real account not created yet)*
- **Instagram** @kingdomcomeyouthconference *(placeholder — account not created yet)*
- **Domain** kingdomcomeyouthconference.org *(to be purchased)*. Formal name in copy is
  **Kingdom Come Youth Conference** — "conference", not "retreat", everywhere. The old
  `kingdomcomeyouthretreat.org` should keep renewing and redirect: printed materials from
  2023–2025 point at it and it is what Google has indexed. Site is built against the new
  domain; switching is a one-line `CNAME` change.

### TBA — shown as fields with a "To be announced" chip, never hidden
Theme · Cost · Registration deadline · Speaker · Schedule · Packing list · Participant guidelines

Filling any of these in is a text swap. The layout does not move.

---

## 3. Color

```css
--paper:       #FDFCFA;  /* page ground */
--ink:         #12212E;  /* deep navy — all body text and headings */
--ink-muted:   #566A78;  /* labels, captions, dt */
--rule:        #DCE3E8;  /* hairlines, card borders */
--accent:      #E6C67C;  /* lantern wheat */
--accent-deep: #8A6A1F;  /* wheat as text, meets AA on paper */
--band:        #16283A;  /* night navy — full-width bands */
--band-fg:     #F3F6F8;
--scene:       #E7E3DB;  /* warm stone — the ground under the FAQ prints only */
```

Ink is navy, not black. That is the direction's whole point; don't drift to `#000`.

### Accent discipline
Wheat is the one loud thing on the site. It gets used for:
- the primary CTA fill (navy text on wheat)
- the active-nav underline
- TBA chips
- small rule marks between sections

Wheat never touches: body text, headings, links in running text, or any fill larger than
roughly 15% of the viewport. **One wheat CTA per screen.** Night navy bands: at most two
per page (register band + footer).

---

## 4. Type

- **Display / wordmark** — Fraunces (variable). Weight 400–600. `SOFT` ~30 and `WONK` 1 at display sizes only; both off below 24px.
- **Body** — Public Sans, 400/600.

| Role | Size |
|---|---|
| Hero verse | `clamp(28px, 5vw, 46px)` |
| Page h1 | `clamp(30px, 4.5vw, 44px)` |
| h2 | `clamp(24px, 3vw, 32px)` |
| h3 | 20px |
| Body | 17px / 1.7 |
| Small | 14px |
| Eyebrow | 12px, `.14em` tracking, uppercase, Public Sans 600 |

Running text stays near 65ch. Headings get `text-wrap: balance`.

---

## 5. Logo

`assets/crown.svg` — traced from `icon.tiff` with potrace (0.20% mean ink error,
alphamax 0.7 to keep the thorn spikes sharp). Single path, tight viewBox,
`fill: currentColor`.

The lockup is **crown SVG + live HTML text**, composed in CSS — not a frozen image.
Changing the wordmark font is a one-line change.

- Wordmark: Fraunces 600, uppercase, `letter-spacing: .08em`
- Full thorn detail everywhere **except** the 16px favicon, which gets a simplified
  variant — 16 pixels physically cannot hold the thorn band, and it degrades to a smudge.
- `assets/logo.svg` and `logo.png` are retired once the CSS lockup ships.

---

## 6. Navigation

Fixed, opaque **white**, 64px desktop / 56px mobile, 1px hairline bottom border — not a
shadow. Always visible. Logo (crown + wordmark) left; About / Event Info right;
`Register →` as a wheat pill with an external-link cue.

Active page: a 2px wheat underline that wipes in from the left over 180ms, ease-out,
`transform: scaleX()` only. Hover gets the same wipe at 60% opacity. Disabled under
`prefers-reduced-motion`.

Mobile: hamburger opens a **full-screen overlay** with large centered links.

---

## 7. Tech stack

Plain HTML, CSS, and vanilla JS. **No framework, no build step.**

```
index.html · about.html · event.html
css/site.css      tokens → base → components, one file, sectioned
js/site.js        mobile menu, hero carousel, nav underline
assets/           crown.svg, favicon, photos/
apply/            existing form, untouched logic
```

Three pages with near-zero state don't justify a framework, and Tailwind-via-CDN would
cost a 100KB+ runtime while moving the design system into class strings — wrong trade
when the whole point is tokenized CSS custom properties.

**Known cost:** with no build step the header and footer are duplicated across three HTML
files. That's ~20 lines each. Injecting them with JS would break no-JS and SEO; a static
site generator would add a toolchain to a three-page site. Hand-duplication is the right
call at this size — revisit if the site passes ~6 pages.

Accordions use `<details>`, with answers animating open via `interpolate-size:
allow-keywords` and `::details-content` — progressive enhancement, so browsers without it
open instantly as before. Opening an answer still pushes the footer down by the height of
that answer; that is document flow, not a bug. Carousel is CSS transforms with a JS timer, pausing on hover
and under `prefers-reduced-motion`.

---

## 8. Photos

Needed: 8–12 landscape hero-quality shots plus candids, as **originals**, in
`assets/photos/`. The FigJam thumbnails are ~293px wide and unusable; only two images in
that export were full resolution.

Home hero carousel wants wide group shots. About's Vision/Mission rows want
portrait-tolerant crops. Event Info's counselor block wants one photo of counselors.

### The FAQ scene
30 photographs (`collage-1` … `collage-30`) lie behind the FAQ panel, used across 48
placements — the cycle repeats about five rows apart, which is more than a screen's worth,
so a repeat is never visible alongside itself. Each `<figure class="snap">`
carries its own `--x` / `--y` / `--r` / `--w` / `--ar`, so positions are explicit rather
than random-at-runtime.

Placement is a **jittered grid**, not true randomness — true randomness clumps and leaves
holes. 48 placements, three columns down each side at `1.5 / 12 / 22.5rem` out from the
panel, eight rows each on a `26rem` pitch, alternating columns offset half a row so nothing
lines up, ±1rem of jitter on the cross-axis. Prints are `11.5–16rem` wide, so neighbours
touch and overlap at their corners without stacking on top of each other — the pile should
read as spread out on a floor, not heaped.

Two rules keep it correct, and both were bugs before they were rules:

1. **Horizontal position is measured outward from the panel, not as a page percentage.**
   Each print carries `--side` (-1 or 1) and `--off`, and resolves to
   `calc(50% + var(--side) * (var(--panel-half) + var(--off)))`. `--off` already includes
   half of that print's *rotated* bounding box, so the clearance to the panel is identical
   on both sides at every viewport width. Mirrored pairs share an `--off`; their `--y`,
   rotation, width and photo all differ, so it never reads as a reflection.
2. **Vertical position is in `rem`, never a percentage.** Opening the accordion grows the
   section by about 50% of its height; anything positioned in `%` slides down the page as
   the reader interacts with it. The scatter layer is a fixed `212rem` tall and gets
   clipped by `.faq-scene` — tall enough to cover the fully-expanded section.

`.snap` must also keep `margin: 0`. It is a `<figure>`, and the UA stylesheet gives figures
`margin: 1em 40px` — that 40px silently shifts every print rightward, which reads as "the
left column is closer to the middle than the right one."

Minimum clearance from the panel is `1.5rem`, so the prints sit near the pane without
touching it.

**Rotation is dealt from an evenly-spaced pool spanning ±20°, then shuffled** — not sampled
at random. Uniform random rotation clusters near the middle, so most prints come out nearly
upright and the pile looks like a tidied stack. Dealing from a spread pool guarantees the
whole range is actually used, including the prints lying well off-square.

To add photos: append figures, re-space the `--y` values across 0–100%, and re-deal the
angle pool across the new count so the spread still covers ±20°. Candids beat posed group
shots; keep faces near the centre of the frame since the same image gets cropped to 3:4,
4:3 and square.

The retro look is CSS, not baked into the files: `sepia(.22) saturate(.86) contrast(1.04)`
on each image, plus grain and a radial falloff applied once across the whole floor so it
reads as one photographed surface rather than 24 separately filtered images.

The bottom edge gets its own falloff into the floor colour, pinned to the scene's bottom.
The scene grows when FAQ answers open, so that edge sweeps across the prints; a gradient
riding the edge dissolves them continuously. Hiding prints past an overhang threshold was
tried and rejected &mdash; any threshold makes prints blink in and out as the edge passes.

## Photo assignments

Real photos are cropped into the slot file names below, so swapping one later means
overwriting the same file. Sources are the full-resolution originals in `~/Downloads`;
everything here is centre-cropped to the slot's shape, JPEG quality 60-80.

| Slot file | Source photo |
| --- | --- |
| `hero-1.jpg` | group-photo-24 |
| `about-splash.jpg` | event-shot-25 |
| `vision.jpg` | fireplace |
| `mission.jpg` | girl-group-24 |
| `counselors.jpg` | counselors-funny |
| `collage-1.jpg` | speaker-focus-25 |
| `collage-2.jpg` | prayer-standing |
| `collage-3.jpg` | girl-prayer-25 |
| `collage-4.jpg` | attentive-listening |
| `collage-5.jpg` | counselors-all-25 |
| `collage-6.jpg` | prayer-25 |
| `collage-7.jpg` | boys-brushing-teeth-25 |
| `collage-8.jpg` | selfie-24 |
| `collage-9.jpg` | boys-24-goofy |
| `collage-10.jpg` | speaker-24 |
| `collage-11.jpg` | boys-table-24 |
| `collage-12.jpg` | marshmallows-1-24 |
| `collage-13.jpg` | attentive-listening-25 |
| `collage-14.jpg` | intensive-boy-prayer |
| `collage-15.jpg` | girl-group-25 |
| `collage-16.jpg` | boys-24 |

**The hero is one photograph, not a carousel.** `hero-2/3/4.jpg` are gone and the slideshow
markup with them; `site.js` already no-ops when there is a single slide, so adding slides
back is only a matter of adding the `.hero-slide` divs again.

**Collage numbering is by position**: `collage-1` is the highest print on the page and
`collage-48` the lowest, one file per figure (earlier, 48 figures shared 30 files, so the
bottom 18 prints repeated the top 18). Photos fill from the top down, in random order within
the filled range; placeholders start at 17. The shuffle is constrained by *true* orientation: tall
photos fill the 3:4 slots, wide ones the 4:3 slots, leftovers go square. Near-duplicate shots (the two attentive-listening frames) are kept on
opposite sides of the panel.

To add photos: fill the next placeholder number (currently 17), matching its shape (3:4, 4:3 or 1:1 cycling
from `collage-1`).

Placeholders are generated to the slot's true shape (see the script kept with the session
scratchpad). The older set was one step out of phase with the `--ar` cycle, so a 4:3
placeholder sat in a 3:4 slot and the label got cropped; regenerating fixed that.

**Host church logos** are one centred lockup, not three equal columns. The three marks
are a square badge and two wordmarks at wildly different ratios (Ascent is roughly 17:1), so
equal-width centred cells strand each one in its own field of white. They share a fixed-height
box instead, which is what keeps the three labels on a single line together.

Ascent's file is white-on-transparent, drawn for a dark background; it is recoloured to ink
for the pale section. Grace's came as black on a white box, so the white is knocked out to
alpha. Both live in `assets/photos/church-*.png`.


**Crop from the EXIF-rotated image, always.** Phone photos are often stored sideways with an
orientation flag. `sips` crops the raw pixels and keeps the flag, so a portrait photo
"cropped" to 1600&times;900 comes out as a 900&times;1600 image the browser rotates and then
re-crops &mdash; soft and wrongly framed. That happened to `about-splash`, `vision` and
`mission` and to the collage orientation sort. Use PIL with `ImageOps.exif_transpose` before
cropping, and save without the orientation tag.
