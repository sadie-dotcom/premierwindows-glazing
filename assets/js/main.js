/* ==========================================================================
   Premier Windows — Glazing
   Shared vanilla JavaScript for every page.

   Loaded with `defer`, so the DOM is ready by the time this runs. No
   frameworks, no dependencies. Keep additions small, progressive, and
   guarded (feature-detect, fail silently) so a broken script never breaks
   the page.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Mobile navigation toggle
     Wires up any [data-nav-toggle] button to the [data-nav] menu,
     keeping aria-expanded and aria-label in sync for screen readers.
     ------------------------------------------------------------------ */
  function initNavToggle() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    // Close the menu when a link is chosen.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    // Close on Escape and return focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state if the viewport grows to the desktop breakpoint.
    var desktop = window.matchMedia("(min-width: 48rem)");
    desktop.addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     Current year — fills any [data-current-year] element (e.g. footer).
     ------------------------------------------------------------------ */
  function initCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  initNavToggle();
  initCurrentYear();
})();
