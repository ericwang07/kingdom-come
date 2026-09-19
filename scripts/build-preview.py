#!/usr/bin/env python3
"""Build a self-contained preview of the site for the designer.

    python3 scripts/build-preview.py            # -> ~/Desktop/kingdom-come-preview.zip

The zip opens by double-clicking index.html (no server): root-absolute paths are
rewritten to relative ones, and the crown mask is inlined because browsers block SVG
mask sources on file://. It also writes image-guide.html, which lists every image slot
with its file name, size, shape and whether a real photo is in it yet.

Needs Pillow (placeholder detection and image sizes).
"""

import base64
import html
import pathlib
import re
import shutil
import tempfile
import zipfile
from math import gcd

from PIL import Image

SRC = pathlib.Path(__file__).resolve().parent.parent
ZIP = pathlib.Path.home() / "Desktop" / "kingdom-come-preview.zip"
NAME = "kingdom-come-preview"

PAGES = ["index.html", "about.html", "event.html", "apply/index.html"]
SKIP = shutil.ignore_patterns(".DS_Store", "icon.tiff", "*.jpeg", "apps-script.gs")
#     *.jpeg are untouched camera originals parked in assets/photos; nothing references them.


def relativise(page: pathlib.Path, depth: int) -> None:
    up = "../" * depth

    def sub(m):
        attr, url = m.group(1), m.group(2)
        if url == "/":
            target = "index.html"
        elif url.startswith("/#"):
            target = "index.html" + url[1:]
        elif url.endswith("/"):
            target = url[1:] + "index.html"
        else:
            target = url[1:]
        return f'{attr}="{up}{target}"'

    page.write_text(re.sub(r'\b(src|href)="(/[^"]*)"', sub, page.read_text()))


def is_placeholder(path: pathlib.Path) -> bool:
    """Generated placeholders are a flat grey card with a number on it: nearly every
    pixel matches the background. Photos and logos never do."""
    im = Image.open(path)
    if im.mode in ("RGBA", "LA") and im.getchannel("A").getextrema()[0] < 250:
        return False  # transparency -> a logo
    im = im.convert("RGB").resize((64, 64))
    r0, g0, b0 = im.getpixel((1, 1))
    if not (abs(r0 - 225) < 14 and abs(g0 - 224) < 14 and abs(b0 - 219) < 14):
        return False
    flat = sum(1 for r, g, b in im.getdata()
               if abs(r - r0) < 12 and abs(g - g0) < 12 and abs(b - b0) < 12)
    return flat / 4096 > 0.75


def shape(w: int, h: int) -> str:
    g = gcd(w, h)
    return f"{w // g}:{h // g}"


def collect_slots():
    slots = []
    for rel in PAGES:
        text = (SRC / rel).read_text()
        for m in re.finditer(r'(?:<figure[^>]*style="([^"]*)"[^>]*>\s*)?<img([^>]*)>', text):
            src = re.search(r'src="([^"]+)"', m.group(2))
            if not src or "/assets/photos/" not in src.group(1):
                continue
            f = SRC / src.group(1).lstrip("/")
            w, h = Image.open(f).size
            slots.append(dict(page=rel, file=src.group(1).lstrip("/"), w=w, h=h,
                              filled=not is_placeholder(f)))
    return slots


GROUPS = [
    ("Home &mdash; hero", "index.html", lambda f: "hero-" in f,
     "One full-bleed photograph behind the verse, dates and Register button, under a dark "
     "neutral tint. Keep faces and action out of the middle third; wide, open shots work best."),
    ("Home &mdash; scattered photo collage", "index.html", lambda f: "collage-" in f,
     "Snapshots tilted at angles down both sides of the FAQ, numbered top to bottom "
     "(collage-1 is highest on the page). Fill the next empty number. Each slot has a fixed "
     "shape &mdash; match it or the photo is cropped. Candid, unposed shots."),
    ("About &mdash; verse splash", "about.html", lambda f: "about-splash" in f,
     "Full-bleed photo behind the Matthew 6:10 verse, with a white text pane floating over the "
     "right-hand side. Keep the right half quiet and the left clear enough for white type."),
    ("About &mdash; Vision / Mission", "about.html", lambda f: f.endswith(("vision.jpg", "mission.jpg")),
     "Sits beside the Vision and Mission copy, half the page wide. Cropped to 4:3."),
    ("About &mdash; host church logos", "about.html", lambda f: "church-" in f,
     "Shown small, each contained in a box of the same height so wordmarks and square badges "
     "sit side by side. Transparent PNG, dark ink or full colour &mdash; they sit on a pale "
     "background, so a white-on-transparent logo must be recoloured first."),
    ("Event Info &mdash; counsellors", "event.html", lambda f: "counselors" in f,
     "Sits beside the counsellor copy."),
]


def image_guide(slots) -> str:
    sections = []
    for title, page, pred, note in GROUPS:
        seen, group = set(), []
        for s in slots:
            if s["page"] == page and pred(s["file"]) and s["file"] not in seen:
                seen.add(s["file"]); group.append(s)
        if not group:
            continue
        rows = "\n".join(
            f'<tr><td><code>{html.escape(s["file"])}</code></td><td>{s["w"]}&times;{s["h"]}</td>'
            f'<td>{shape(s["w"], s["h"])}</td><td>'
            + ("<span class=ok>photo in</span>" if s["filled"] else "<strong>needs photo</strong>")
            + "</td></tr>" for s in group)
        filled = sum(s["filled"] for s in group)
        sections.append(f"""
  <section class="grp">
    <h2>{title}</h2>
    <p class="note">{note}</p>
    <p class="count">{len(group)} slot{"s" if len(group) != 1 else ""} &middot; {filled} filled</p>
    <table>
      <thead><tr><th>File name</th><th>Size (px)</th><th>Shape</th><th>Status</th></tr></thead>
      <tbody>
{rows}
      </tbody>
    </table>
  </section>""")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Image guide &middot; Kingdom Come</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Public+Sans:wght@400;600&display=swap">
<style>
  :root {{ --ink:#1E1C1A; --muted:#69635C; --rule:#E3DFD8; --paper:#FDFCFA; }}
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:clamp(1.5rem,5vw,4rem); background:var(--paper); color:var(--ink);
         font-family:"Public Sans",system-ui,sans-serif; line-height:1.6; }}
  .wrap {{ max-width:60rem; margin-inline:auto; }}
  h1 {{ font-family:Fraunces,Georgia,serif; font-size:clamp(1.9rem,1.2rem+2.6vw,2.9rem); margin:0 0 .5rem; }}
  h2 {{ font-family:Fraunces,Georgia,serif; font-size:1.4rem; margin:0 0 .35rem; }}
  .lede, .note {{ color:var(--muted); max-width:46rem; }}
  .note {{ margin:.25rem 0 .75rem; }}
  .steps {{ border:1px solid var(--rule); padding:1.25rem 1.5rem; margin:2rem 0 3rem; background:#fff; }}
  .steps li {{ margin-bottom:.4rem; }}
  .grp {{ margin-bottom:3rem; }}
  .count {{ font-size:.8rem; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin:0 0 .5rem; }}
  table {{ width:100%; border-collapse:collapse; font-size:.95rem; }}
  th, td {{ text-align:left; padding:.5rem .6rem; border-bottom:1px solid var(--rule); vertical-align:top; }}
  th {{ font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }}
  code {{ font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.9em; }}
  .ok {{ color:#6E7F72; }}
  a {{ color:inherit; }}
</style>
</head>
<body>
<div class="wrap">
  <h1>Image guide</h1>
  <p class="lede">Some slots already have real photos in them; the rest are grey placeholders, each
    labelled on screen with its file name. The tables below mark which is which. To fill a slot, save
    the photo with <strong>exactly the same file name</strong> into <code>assets/photos/</code>,
    replacing the placeholder, then reload the page.</p>

  <div class="steps">
    <ol>
      <li>Open <a href="index.html">index.html</a> in a browser to see the site (also:
        <a href="about.html">about.html</a>, <a href="event.html">event.html</a>,
        <a href="apply/index.html">apply/index.html</a>).</li>
      <li>Find a grey box you want to fill &mdash; it prints its own file name.</li>
      <li>Drop your photo into <code>assets/photos/</code> using that same name and extension.</li>
      <li>Export at the pixel size listed below (or larger, same shape). JPEG, sRGB, quality ~80.
        Aim for under 400&nbsp;KB each.</li>
      <li>Export photos <strong>upright</strong>: phone pictures are often stored sideways with a
        rotation flag, which crops badly. Re-saving from an editor fixes this.</li>
      <li>Photos are cropped to fill their slot from the centre, so leave breathing room around faces.</li>
    </ol>
  </div>
{"".join(sections)}
  <section class="grp">
    <h2>Not photos</h2>
    <p class="note">Brand assets, already final &mdash; no action needed unless we rebrand:
      <code>assets/crown.svg</code>, <code>assets/favicon.svg</code>, <code>assets/logo.svg</code>,
      <code>assets/apple-touch-icon.png</code>.</p>
  </section>
</div>
</body>
</html>
"""


README = """KINGDOM COME - WEBSITE PREVIEW
==============================

Double-click index.html to open the site in your browser. Everything runs
offline, no server needed (fonts load from Google, so offline they fall back
to system fonts).

Pages:
  index.html          Home
  about.html          About
  event.html          Event Info
  apply/index.html    Counselor application
  image-guide.html    <- START HERE: every image slot, its file name, size and status

Replacing a photo:
  Save your photo into assets/photos/ using exactly the same file name as
  the placeholder it replaces, then reload the page.
"""


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        out = pathlib.Path(tmp) / NAME
        out.mkdir()
        for rel in PAGES[:3]:
            shutil.copy2(SRC / rel, out / rel)
        for d in ("apply", "css", "js", "assets"):
            shutil.copytree(SRC / d, out / d, ignore=SKIP)
        for rel in PAGES:
            relativise(out / rel, rel.count("/"))

        # file:// blocks SVG mask sources, so inline the crown in the bundled CSS
        crown = base64.b64encode((SRC / "assets/crown.svg").read_bytes()).decode()
        css = out / "css/site.css"
        css.write_text(css.read_text().replace(
            'url("../assets/crown.svg")', f'url("data:image/svg+xml;base64,{crown}")'))

        slots = collect_slots()
        (out / "image-guide.html").write_text(image_guide(slots))
        (out / "README.txt").write_text(README)

        leftovers = re.findall(r'(?:src|href)="/[^"]*"',
                               "".join((out / p).read_text() for p in PAGES))
        assert not leftovers, f"absolute paths left: {leftovers[:5]}"

        ZIP.unlink(missing_ok=True)
        with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
            for f in sorted(out.rglob("*")):
                if f.is_file() and f.name != ".DS_Store":
                    z.write(f, f.relative_to(tmp))

    filled = sum(s["filled"] for s in {s["file"]: s for s in slots}.values())
    total = len({s["file"] for s in slots})
    print(f"{ZIP}  {ZIP.stat().st_size / 1e6:.1f} MB  ({filled}/{total} image slots filled)")


if __name__ == "__main__":
    main()
