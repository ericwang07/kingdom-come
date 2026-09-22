/* Kingdom Come — mobile menu, hero carousel, footer year.
   No framework, no build step. See DESIGN.md. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* --- Mobile menu ------------------------------------------------------- */

const toggle = document.querySelector("#menu-toggle");
const overlay = document.querySelector("#menu-overlay");
const closeBtn = document.querySelector("#menu-close");

const setMenu = (open) => {
  if (!overlay || !toggle) return;
  overlay.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) closeBtn?.focus();
  else toggle.focus();
};

toggle?.addEventListener("click", () => setMenu(overlay.hidden));
closeBtn?.addEventListener("click", () => setMenu(false));
overlay?.addEventListener("click", (e) => {
  if (e.target.tagName === "A") setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay && !overlay.hidden) setMenu(false);
});

/* Close the overlay if the viewport grows past the mobile breakpoint. */
window.matchMedia("(min-width: 721px)").addEventListener("change", (e) => {
  if (e.matches && overlay && !overlay.hidden) setMenu(false);
});

/* --- Hero carousel ----------------------------------------------------- */

const slides = [...document.querySelectorAll(".hero-slide")];

if (slides.length > 1) {
  let index = 0;
  let timer = null;

  const show = (next) => {
    const prev = slides[index];
    index = next % slides.length;
    const cur = slides[index];
    if (cur === prev) return;

    slides.forEach((s) => s.removeAttribute("data-prev"));
    prev.removeAttribute("data-active");
    prev.setAttribute("data-prev", "");
    cur.setAttribute("data-active", "");

    /* Drop the outgoing layer once it's fully covered; the timeout is a
       fallback for when transitionend doesn't fire (e.g. a hidden tab). */
    const drop = () => prev.removeAttribute("data-prev");
    cur.addEventListener("transitionend", drop, { once: true });
    window.setTimeout(drop, 1600);
  };

  const start = () => {
    if (timer || reduceMotion.matches) return;
    timer = window.setInterval(() => show(index + 1), 5000);
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  /* No hover-to-pause: the hero is the whole viewport, so any resting cursor
     would halt the carousel for good (mouseenter doesn't fire until the first
     move, and mouseleave needs the pointer to exit the screen). Reduced-motion
     is what actually stops the animation for anyone who needs it. */

  /* Don't advance in a background tab. */
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  reduceMotion.addEventListener("change", () => (reduceMotion.matches ? stop() : start()));

  start();
}

/* --- Header glass ------------------------------------------------------ */

/* Flips the header to its translucent state as soon as the page leaves the
   very top. rAF-throttled so the scroll handler stays cheap. */
const header = document.querySelector(".site-header");

if (header) {
  let queued = false;

  const syncHeader = () => {
    queued = false;
    header.toggleAttribute("data-scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(syncHeader);
  }, { passive: true });

  syncHeader();
}

/* --- Footer year ------------------------------------------------------- */

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
