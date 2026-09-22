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
1. Hero — rotating dimmed photo carousel; description, Matthew 6:33, `Dec 28–30, 2026 · Camp Wightman, CT`, `Register →`

**The hero keeps its two translucent panels**, `rgba(24,20,16,.62)`, and `.hero::after`
is deliberately weak behind them: two short corner washes at `.20` over a `.05–.09`
overall tone.

They were cut once, on the argument that they covered the best photograph on the site,
and putting them back was right. Measured across all five slides — worst backdrop under
either text block, and the brightness of the photograph where nothing covers it:

| treatment | contrast | uncovered photo |
|---|---|---|
| **panels .62 + wash .05–.09** | **8.59:1** | **0.096** |
| panels .52 + wash .08–.13 | 7.29:1 | 0.088 |
| no panels + wash .10–.16 | 5.09:1 | 0.049 |
| no panels + wash .24–.34 | 6.50:1 | 0.032 |

**A global wash dims the whole frame to protect two small text areas; panels darken only
those two.** The rest of the picture keeps its colour — twice as bright, at better
contrast. Without panels the wash had to be heavy enough that the students' navy jackets
read as black. Don't re-cut them without re-running these numbers.

**`.hero-inner` is literally `.wrap`'s box**: `max-width: 68rem` *including*
`padding-inline: var(--gutter)`, with `.hero` itself carrying no horizontal padding. Each
panel then hangs outward by its own `--pad-x`, so the **type** lands on the column line
while the panel edge sits one padding outside it, the way hanging punctuation does. The
verse's opening quote and the wordmark above it agree; the hero's Register button ends
where the header's does.

Three earlier attempts at that alignment failed, each differently:

1. `margin-left: calc(-1 * var(--gutter))` on the panel bled it to the viewport edge by
   moving the whole element, so the type went too — positioned off the viewport while the
   rest of the page was positioned off the column, 381px apart at 1920px. It agreed only
   at ≤1088px, so it showed on wide screens alone.
2. Bleeding just the fill (`::before` at `-100vw`) put the type right but grew each panel
   into a slab running from the viewport edge to the text. A bleed that reaches the
   viewport cannot also start its type at the column — the fill between the two *is* the
   slab.
3. Taking `max-width: 68rem` while leaving the gutter on `.hero` left the type a full
   gutter outside the wordmark: the right idea measured against the wrong box.

**Screenshots are available.** Helium (`/Applications/Helium.app/Contents/MacOS/Helium`)
is Chromium and runs headless:

```
Helium --headless --disable-gpu --screenshot=out.png --window-size=1440,900 \
  --hide-scrollbars http://localhost:8777/index.html
```

Contrast can be checked the same way — render with `.hero-lede > *, .hero-facts > *
{ visibility: hidden }` to get the bare backdrop, then take the 95th-percentile relative
luminance of the region the type occupies. Pin a carousel slide with
`.hero-slide { opacity: 0 !important }` plus an `:nth-child(n)` override.

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
Opens **plain** — no photo splash. Big type on white, date and venue on a hairline
underneath. Grounds alternate paper / sunk down the whole page, the way About's do.

1. Page header — h1 + a tracked caps meta strip (date · venue · town) closed by a
   hairline. The **Theme** plaque belongs here, directly under the strip, once there
   is a theme; until then the head is the h1 and the strip alone.
2. Details — *sunk*. A fact grid, same construction as About's `.values` (1px gaps
   showing `--rule` through, paper cells): Dates, Location, Who — and Cost, Deadline
   and Speaker as they land
3. I. Schedule — `.media-row`, text left / photo right
4. II. Packing — *sunk*. Four labelled clusters (Sleep · Clothing · Wash · Bring
   along), hairlines between items rather than bullets
5. Register band — night navy, one button
6. Counselor application block — photo + `Apply →`
7. Close — *sunk*. Centered: FAQ link + email, mirroring About's closing lockup

No sub-nav. FAQ lives on Home only and is not repeated here.

**The theme leads.** It was tried below the facts, on the reasoning that a large empty
frame at the top of the page announces there is no news — but the theme is what the
page is for, and burying it costs more than the empty frame does. While TBA the plaque
holds the slot at reduced padding; restore the padding when the theme arrives.

**Grounds alternate paper / sunk down the whole page**, the way About's do, so the
order above also fixes the background rhythm. Anything that sits *on* a ground —
the `.fact` cells — has to take its fill from whichever ground it is not on, or it
disappears when a section moves. (`.rules-panel` was the case that proved it, before
guidelines left for the FAQ.)

**The roman numerals are gone.** They were borrowed from About (I. Vision, II. Mission,
III. Core Doctrinal Values) and worked while there were three practical sections; with
guidelines moved to the FAQ there are two, and two items are not a sequence. Eyebrow
names the section, `h2` says something — that part of About's pattern stays.

**Keep those `h2`s plain.** "What to bring", "What to expect". Headline-ifying a
supporting fact was tried twice and cut both times: "Connecticut in late December is
cold" over a lede of "plan on warm layers" (neither survived — the section goes eyebrow
→ `h2` → list), and "How the days run", which promised an hour-by-hour shape the page
does not have.

**The conference section must not restate the Home hero.** Its copy opened "Three days
of the Word, prayer, and Christ-centered friendship" — the Home hero's line, word for
word for ten words. It now says what Home does not: that students are on site for all
three days, in counselor-led small groups, which the counselor block further down
already supports.

**The register band goes after the practical sections**, not between Details and the
rest: asking for the commitment before the reader knows what to bring or what the rules
are is the wrong order. That still leaves two navy bands — this one and the footer.

**Participant guidelines live in the Home FAQ, not here.** They were a boxed panel of
prohibitions plus a phone paragraph; as prose they are two questions — "What should I
leave at home?" next to "What should I pack?", and the existing "What's the phone
policy?" — which is where someone actually looks for them. `.rules`, `.rules-panel` and
`.rules-list` were deleted with the section. The old "What are the behavior
expectations?" entry pointed at this section and was removed; the two answers cover it.

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

### Unknowns are cut, not chipped
**This reverses the earlier rule.** Anything not yet decided comes off the page entirely
rather than appearing as a "To be announced" chip: a page that says it does not know six
times reads as unfinished, and the chips were loudest exactly where the news was thinnest.

Currently cut: **theme · cost · registration deadline · speaker · day-by-day schedule**.
Each comes back as a markup addition when it is known — `.theme-block`, `.theme-name`,
`.tba` and `.tba-note` are still in `site.css`, marked dormant, so restoring the theme
plaque is a paste rather than a rebuild. The Details grid is a plain grid of cells, so
cost, deadline and speaker are three `<div class="fact">` blocks whenever they land.

Known and shown: dates · venue · who · packing list.

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

### Corners
The site is square corners and hairlines: the fact and value grids, the theme plaque, the
intro pane, the FAQ panel, the scattered prints, every section divider. There are exactly
three radii in `site.css` and they are all small — 2px on the focus ring, 3px on the
`.tba` chip, 3px on `.btn`.

Buttons were a 999px pill, the one round shape in the whole system, on the most prominent
element on the page. The wheat fill already makes the CTA the loudest thing on screen;
the pill gave it a second, borrowed kind of distinctiveness and pulled it out of the
system everything else belongs to. Square (0) was tried too and reads severe against
Fraunces' warmth.

**The rule: radius marks interactivity. Surfaces are square.** Buttons and the focus ring
get 2&ndash;3px; everything you cannot click stays at 0 &mdash; the hero panels, the About
intro pane, the FAQ panel, the fact and value cells, the theme plaque, the scattered
prints. The hero panels were rendered at 0, 3px, 10px and 18px: 3px is invisible at
670&times;240 and only blurs the rule, while 10px and up turn an ink block into an app
card and walk the page into the SaaS-card vocabulary the whole direction avoids. Nothing
on this site needs more than 3px.

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
portrait-tolerant crops. Event Info's counselor block wants one photo of counselors, and
its Schedule row one shot of a day between sessions.

**Still missing: a photograph of Camp Wightman itself.** The Location fact and the head
of the page both have nowhere to put one, so the venue is currently a name and an
address. A wide exterior or grounds shot is the single most useful photo to add next.

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

**All four edges need one.** The top had no falloff for a long time, so the first row was
sliced flat against the dark section above it with a bare strip of floor over it, while
the other three dissolved. Its ramp is 6rem, not the bottom's 10rem: the top row's centres
sit only ~5&ndash;7rem below the scene's top, so a longer ramp washes those photographs out
instead of softening where they meet the edge. 5rem left a visible straight edge and 8rem
was too much &mdash; both were rendered and compared.

## Photo assignments

Real photos are cropped into the slot file names below, so swapping one later means
overwriting the same file. Sources are the full-resolution originals in `~/Downloads`;
everything here is centre-cropped to the slot's shape, JPEG quality 60-80.

| Slot file | Source photo |
| --- | --- |
| `hero-1.jpg` | group-photo-24 |
| `about-splash.jpg` | worship-23 (in `assets/photos/`) |
| `vision.jpg` | fireplace |
| `mission.jpg` | girl-group-24 |
| `counselors.jpg` | counselors-funny |
| `schedule.jpg` | group-hangout-23 |
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
| `collage-17.jpg` | 20231227_212058 |
| `collage-18.jpg` | 20231228_223517 |
| `collage-19.jpg` | event-shot-25 |
| `collage-20.jpg` | f57333568 |
| `collage-21.jpg` | f59851840 |
| `collage-22.jpg` | f60673152 |
| `collage-23.jpg` | f57455680 |
| `collage-24.jpg` | f58565440 |
| `collage-25.jpg` | f4946816 |
| `collage-26.jpg` | f57270976 |
| `collage-27.jpg` | 20231228_190250 |
| `collage-28.jpg` | f59291200 |
| `collage-29.jpg` | IMG_2086 |
| `collage-30.jpg` | IMG_2056 |

**The hero is a six-photo carousel**, `hero-1` through `hero-6`, crossfading every 5s.
`site.js` no-ops when there is a single `.hero-slide`, so dropping back to one photograph is
just deleting the other divs. Each slide ships a 1280/1920/2560 `srcset`; `hero-5` stops at
1920 because there is no 2560 original. Only slide 1 is `fetchpriority="high"` — the rest are
`low`, so the first paint isn't racing five images it won't show for 5 seconds.

**Collage numbering is by position**: `collage-1` is the highest print on the page and
`collage-48` the lowest, one file per figure (earlier, 48 figures shared 30 files, so the
bottom 18 prints repeated the top 18). Photos fill from the top down, in random order within
the filled range. **There are no placeholders left: the scatter is 30 placements and 30
photographs.** The shuffle is constrained by *true* orientation: tall
photos fill the 3:4 slots, wide ones the 4:3 slots, leftovers go square. Near-duplicate shots (the two attentive-listening frames) are kept on
opposite sides of the panel.

To add photos: append a figure as slot 31 and onward, continuing the 26rem row pitch,
and raise `.faq-scatter`'s height and mask to match. Shape follows the 4:3 / 1:1 / 3:4
cycle unless the photo's true shape disagrees, in which case the photo wins.

**Every original in `assets/photos/` is placed.** 39 originals: 10 carry the hero,
About and Event slots, and the other 29 are in the collage. Nothing sits unused.

**The pile was cut from 48 placements to 30, and the placeholders deleted.** Twenty
generated placeholder tiles below a pile of real photographs looked worse than a shorter
pile, and the run only grows as photos arrive. Consequence to know about: the scatter no
longer reaches the bottom of a fully-expanded FAQ, so `.faq-scatter` now sets its height
to where the prints actually end (~138rem) and masks the last 12rem, dissolving the
pile's own bottom edge into the floor. `.faq-scene::before` still covers the opposite
case, where the section is shorter than the pile. **Adding placements past 30 means
growing that height to match**, or the new prints are masked away.

To restore the old geometry for slots 31–48, their `--side` / `--off` / `--y` / `--r` /
`--w` / `--ar` values are in git at `git show HEAD:index.html`.

**The December 2023 batch was 11 landscape frames and one portrait**, which the 3:4 /
4:3 / 1:1 cycle could not absorb: slots 17–28 offer four of each shape. Rather than
scatter the real photos down to slot 47 hunting for 4:3 slots — which would have left
placeholders interleaved through the whole pile instead of gathered at the bottom —
slots 25, 27 and 28 had their `--ar` changed to `4 / 3`, the same move `collage-9` and
`collage-15` already carry. Three of the twelve tolerated a tighter crop and kept their
cycle shape: `collage-18` (campfire, centred), `collage-21` (round table) and
`collage-24` (gym) went to 1:1, and `collage-22` to 3:4, all with the subject checked
for edge-slicing first. `collage-21` and `collage-22` needed the crop biased right of
centre to keep everyone in frame.

**The photo's true shape wins over the cycle.** `collage-9` and `collage-15` sit in what the
cycle calls square slots but carry `--ar: 4 / 3`, because both are wide group shots: a centre
crop to 1:1 threw away 25% of the width and sliced the people standing at the edges. Squaring
a wide group photo is never worth keeping the cycle intact &mdash; change the slot's `--ar` and
re-crop to the photo's own ratio instead. Only `--ar` moves; `--w`, `--off` and `--y` stay put.

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


**`group-photo-23` carries a burnt-in `12/29/2023` camera stamp** across the gravel at
the bottom, at roughly `x 855-1225, y 938-1006` of the 2055&times;1006 original. The
`hero-3-*.jpg` slots are cut from `y 0-935` — above the stamp — then centre-cropped to
16:9, which costs only bare ground below the group's feet. The original keeps the stamp,
since it is the original; re-crop from `y 0-935` if those slots are ever regenerated.

**Crop from the EXIF-rotated image, always.** Phone photos are often stored sideways with an
orientation flag. `sips` crops the raw pixels and keeps the flag, so a portrait photo
"cropped" to 1600&times;900 comes out as a 900&times;1600 image the browser rotates and then
re-crops &mdash; soft and wrongly framed. That happened to `about-splash`, `vision` and
`mission` and to the collage orientation sort. Use PIL with `ImageOps.exif_transpose` before
cropping, and save without the orientation tag.

**About intro: pane left, verse right.** The splash (worship-23) has its window, cross and
stage on the right, so the pane sits on the left and the tint is darkest on the right under
the verse. The flip is CSS `order` only &mdash; source order stays verse-first so it still leads
on a phone. If the splash photo changes, check which side its subject is on before keeping this.
