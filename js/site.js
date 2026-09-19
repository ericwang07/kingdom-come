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
    slides[index].removeAttribute("data-active");
    index = next % slides.length;
    slides[index].setAttribute("data-active", "");
  };

  const start = () => {
    if (timer || reduceMotion.matches) return;
    timer = window.setInterval(() => show(index + 1), 6000);
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const hero = document.querySelector(".hero");
  hero?.addEventListener("mouseenter", stop);
  hero?.addEventListener("mouseleave", start);

  /* Don't advance in a background tab. */
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  reduceMotion.addEventListener("change", () => (reduceMotion.matches ? stop() : start()));

  start();
}

/* --- Footer year ------------------------------------------------------- */

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
