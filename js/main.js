/* ==========================================================================
   Skills Lab e.V. – main.js
   Grundfunktionen für alle Seiten. Klassisches Skript (kein ES-Modul),
   damit die Website auch per Doppelklick (file://) funktioniert.

   Inhalt:
     1. Namensraum, Seitendaten, Hilfsfunktionen
     2. Nur-mit-JavaScript-Elemente einblenden
     3. Mobiles Menü
     4. Darstellung (hell/dunkel/System)
     5. Sprache merken
     6. Einwilligung (Banner, Karte, Cookie-Einstellungen)
     7. Kopieren-Buttons, Drucken
     8. Termine (vergangene ausblenden, Filter, Startseite)
   ========================================================================== */
(function () {
  "use strict";

  /* 1. Namensraum ---------------------------------------------------------- */
  var SL = (window.SkillsLab = window.SkillsLab || {});

  try {
    SL.data = JSON.parse(document.getElementById("site-data").textContent);
  } catch (e) {
    SL.data = { lang: document.documentElement.lang || "de", strings: {} };
  }

  /** localStorage mit Absicherung (privater Modus, gesperrte Speicherung) */
  SL.store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignorieren */ }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* ignorieren */ }
    }
  };

  /** Platzhalter {name} in Texten ersetzen */
  SL.format = function (text, values) {
    return String(text || "").replace(/\{(\w+)\}/g, function (m, key) {
      return values && values[key] !== undefined ? values[key] : m;
    });
  };

  /** Heutiges Datum im Format JJJJ-MM-TT (lokale Zeit) */
  SL.today = function () {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  };

  /** Unsichtbare Live-Region für kurze Ansagen (z. B. „Kopiert“) */
  var live = document.createElement("div");
  live.className = "visually-hidden";
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  document.body.appendChild(live);
  SL.announce = function (message) {
    live.textContent = "";
    window.setTimeout(function () { live.textContent = message; }, 50);
  };

  /* 2. Nur-mit-JavaScript-Elemente einblenden ----------------------------- */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-js-only], .copy-btn, [data-print], [data-map-load]"),
    function (el) { el.hidden = false; }
  );

  /* 3. Mobiles Menü -------------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? toggle.getAttribute("data-label-close") : toggle.getAttribute("data-label-open");
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* 4. Darstellung --------------------------------------------------------- */
  var themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    var saved = SL.store.get("sl-theme");
    themeSelect.value = saved === "light" || saved === "dark" ? saved : "system";
    themeSelect.addEventListener("change", function () {
      var value = themeSelect.value;
      if (value === "light" || value === "dark") {
        document.documentElement.setAttribute("data-theme", value);
        SL.store.set("sl-theme", value);
      } else {
        document.documentElement.removeAttribute("data-theme");
        SL.store.remove("sl-theme");
      }
    });
  }

  /* 5. Sprache merken (für die Sprachweiche auf /index.html) -------------- */
  SL.store.set("sl-lang", SL.data.lang);
  Array.prototype.forEach.call(document.querySelectorAll("a[data-lang]"), function (link) {
    link.addEventListener("click", function () {
      SL.store.set("sl-lang", link.getAttribute("data-lang"));
    });
  });

  /* 6. Einwilligung -------------------------------------------------------- */
  var CONSENT_KEY = "sl-consent";
  var CONSENT_VERSION = 1;

  SL.consent = {
    get: function () {
      try {
        var c = JSON.parse(SL.store.get(CONSENT_KEY));
        return c && c.version === CONSENT_VERSION ? c : null;
      } catch (e) { return null; }
    },
    set: function (map) {
      SL.store.set(CONSENT_KEY, JSON.stringify({ map: !!map, date: new Date().toISOString(), version: CONSENT_VERSION }));
      hideBanner();
      if (map) loadMaps();
    },
    allowsMap: function () {
      var c = SL.consent.get();
      return !!(c && c.map);
    }
  };

  var banner = document.getElementById("consent");

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    // Inhalt am Seitenende nicht verdecken (WCAG 2.4.11 Fokus nicht verdeckt)
    document.body.style.paddingBottom = banner.offsetHeight + "px";
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.style.paddingBottom = "";
  }

  if (banner) {
    Array.prototype.forEach.call(banner.querySelectorAll("[data-consent]"), function (btn) {
      btn.addEventListener("click", function () {
        SL.consent.set(btn.getAttribute("data-consent") === "accept");
      });
    });
    if (!SL.consent.get()) showBanner();
  }

  /** Karte(n) erst nach Einwilligung als iframe einsetzen */
  function loadMaps() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-map]"), function (box) {
      if (box.querySelector("iframe")) return;
      var frame = document.createElement("iframe");
      frame.src = box.getAttribute("data-map");
      frame.title = box.getAttribute("data-map-title") || "";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer";
      box.innerHTML = "";
      box.appendChild(frame);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-map-load]"), function (btn) {
    btn.addEventListener("click", function () {
      SL.consent.set(true);
      var frame = document.querySelector("[data-map] iframe");
      if (frame) frame.focus();
    });
  });

  if (SL.consent.allowsMap()) loadMaps();

  // Seite „Cookie-Einstellungen“
  var settingsForm = document.getElementById("consent-settings");
  if (settingsForm) {
    var mapBox = document.getElementById("consent-map");
    var current = document.getElementById("consent-current");
    var status = document.getElementById("consent-status");
    var strings = SL.data.strings.cookies || {};
    var showCurrent = function () {
      current.textContent = SL.consent.allowsMap() ? strings.current_on : strings.current_off;
    };
    mapBox.checked = SL.consent.allowsMap();
    showCurrent();
    settingsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      SL.consent.set(mapBox.checked);
      showCurrent();
      status.textContent = strings.saved;
    });
  }

  /* 7. Kopieren und Drucken ------------------------------------------------ */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback für ältere Browser bzw. file://
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(area);
      }
    });
  }
  SL.copyText = copyText;

  document.addEventListener("click", function (event) {
    var btn = event.target.closest ? event.target.closest("[data-copy]") : null;
    if (!btn) return;
    var d = (SL.data.strings && SL.data.strings.donate) || {};
    var original = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", original);
    copyText(btn.getAttribute("data-copy")).then(function () {
      btn.textContent = d.copied || "✓";
      btn.setAttribute("data-state", "done");
      SL.announce(d.copied || "✓");
      window.setTimeout(function () {
        btn.textContent = original;
        btn.removeAttribute("data-state");
      }, 2000);
    }).catch(function () { /* Kopieren nicht möglich – Text bleibt markierbar */ });
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-print]"), function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });

  /* 8. Termine -------------------------------------------------------------- */
  var today = SL.today();

  // Startseite: nur kommende Termine, höchstens N
  var upcomingList = document.querySelector("[data-upcoming]");
  if (upcomingList) {
    var max = parseInt(upcomingList.getAttribute("data-upcoming"), 10) || 3;
    var shown = 0;
    Array.prototype.forEach.call(upcomingList.querySelectorAll("[data-date]"), function (item) {
      var visible = item.getAttribute("data-date") >= today && shown < max;
      item.hidden = !visible;
      if (visible) shown++;
    });
    var empty = document.querySelector("[data-upcoming-empty]");
    if (empty) empty.hidden = shown > 0;
  }

  // Terminseite: vergangene ausblenden, Filter nach Kurs
  var table = document.getElementById("dates-table");
  if (table) {
    var rows = table.querySelectorAll("tbody tr[data-date]");
    var months = table.querySelectorAll("tbody[data-month]");
    var filter = document.getElementById("filter-course");
    var statusEl = document.getElementById("filter-status");
    var emptyEl = document.getElementById("dates-empty");

    var apply = function (announce) {
      var course = filter ? filter.value : "";
      var count = 0;
      Array.prototype.forEach.call(rows, function (row) {
        var visible = row.getAttribute("data-date") >= today && (!course || row.getAttribute("data-course") === course);
        row.hidden = !visible;
        if (visible) count++;
      });
      // Monatsüberschrift nur zeigen, wenn der Monat sichtbare Termine hat
      Array.prototype.forEach.call(months, function (group) {
        group.hidden = !group.querySelector("tr[data-date]:not([hidden])");
      });
      emptyEl.hidden = count > 0;
      table.hidden = count === 0;
      if (statusEl && announce) statusEl.textContent = SL.format(SL.data.strings.filter_count, { n: count });
    };

    if (filter) {
      var preset = new URLSearchParams(window.location.search).get("kurs");
      if (preset && filter.querySelector('option[value="' + preset.replace(/[^a-z0-9-]/gi, "") + '"]')) {
        filter.value = preset;
      }
      filter.addEventListener("change", function () { apply(true); });
    }
    apply(Boolean(filter && filter.value));
  }
})();
