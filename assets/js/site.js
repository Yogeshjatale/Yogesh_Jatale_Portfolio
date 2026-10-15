(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- Theme toggle (dark / light), remembered in the browser ---- */
  var toggle = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-label");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var next = theme === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    label.textContent = next === "light" ? "Light" : "Dark";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", theme === "dark" ? "#1c0e13" : "#f6f2f3"); }
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("yj-theme", next); } catch (e) {}
  });

  /* ---- Mobile menu ---- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    nav.classList.toggle("nav--open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  }
  menuBtn.addEventListener("click", function () {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { setMenu(false); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setMenu(false); }
  });

  /* ---- Mark the section in view in the nav ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        links.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + entry.target.id;
          if (on) { a.setAttribute("aria-current", "true"); }
          else { a.removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- Resume button: shows only when the PDF exists ----
     Put your resume at assets/Yogesh_Jatale_Resume.pdf and the buttons appear. */
  var RESUME = "assets/Yogesh_Jatale_Resume.pdf";
  if (window.fetch && location.protocol !== "file:") {
    fetch(RESUME, { method: "HEAD" }).then(function (res) {
      if (!res.ok) { return; }
      document.querySelectorAll("[data-resume]").forEach(function (a) {
        a.href = RESUME;
        a.hidden = false;
      });
    }).catch(function () {});
  }
})();
