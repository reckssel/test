/* ==========================================================================
   Skills Lab e.V. – calendar.js (nur Terminseite)
   - Monatskalender: ein Monat sichtbar, Blättern mit „Vorheriger/Nächster Monat“
   - Heute markieren, vergangene Tage/Termine abschwächen
   - Umschalten Kalender ↔ Liste (Wahl wird gemerkt)
   - Klick auf einen Termin öffnet ein Detailfenster (<dialog>) mit
     „In meinen Kalender“ (.ics-Datei), „Anfragen“ und Link zum Kurs
   - Kursfilter (aus main.js) blendet auch Termine im Kalender aus
   Ohne JavaScript sind alle Monate untereinander sichtbar und die Termine
   verlinken auf ihre Zeile in der Liste (mit .ics-Button).
   ========================================================================== */
(function () {
  "use strict";

  var SL = window.SkillsLab;
  var C = SL && SL.data && SL.data.calendar;
  if (!C) return;

  var forEach = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var today = SL.today();
  var calView = document.getElementById("calendar-view");
  var listView = document.getElementById("list-view");
  var months = Array.prototype.slice.call(document.querySelectorAll(".cal-month"));
  var prevBtn = document.querySelector("[data-cal-prev]");
  var nextBtn = document.querySelector("[data-cal-next]");
  var status = document.getElementById("cal-status");
  var chips = document.querySelectorAll(".cal-chip");
  var filter = document.getElementById("filter-course");

  /* Heute und Vergangenes markieren ---------------------------------------- */
  forEach(document.querySelectorAll(".mg-day[data-date]"), function (td) {
    var d = td.getAttribute("data-date");
    if (d === today) {
      td.classList.add("mg-today");
      td.setAttribute("aria-current", "date");
    } else if (d < today) {
      td.classList.add("mg-past");
    }
  });
  forEach(chips, function (chip) {
    if (chip.getAttribute("data-date") < today) chip.classList.add("cal-chip--past");
  });

  /* Monate blättern ----------------------------------------------------------- */
  var index = 0;
  var currentMonth = today.slice(0, 7);

  function firstUpcomingMonth(course) {
    for (var i = 0; i < months.length; i++) {
      var found = months[i].querySelector(
        '.cal-chip' + (course ? '[data-course="' + course + '"]' : "") + ':not(.cal-chip--past)'
      );
      if (found) return i;
    }
    return -1;
  }

  function show(i, announce) {
    if (!months.length) return;
    index = Math.max(0, Math.min(months.length - 1, i));
    months.forEach(function (m, j) { m.hidden = j !== index; });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === months.length - 1;
    if (status && announce) {
      var title = months[index].querySelector(".cal-month-title");
      status.textContent = title ? title.textContent : "";
    }
  }

  var start = -1;
  months.forEach(function (m, j) { if (m.getAttribute("data-month") === currentMonth) start = j; });
  if (start === -1) start = firstUpcomingMonth("");
  if (start === -1) start = months.length - 1;
  show(start, false);

  if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1, true); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1, true); });

  /* Ansicht Kalender ↔ Liste ------------------------------------------------- */
  var viewButtons = document.querySelectorAll("[data-view]");
  function setView(view, remember) {
    calView.hidden = view !== "calendar";
    listView.hidden = view !== "list";
    forEach(viewButtons, function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-view") === view ? "true" : "false");
    });
    if (remember) SL.store.set("sl-dates-view", view);
  }
  forEach(viewButtons, function (b) {
    b.addEventListener("click", function () { setView(b.getAttribute("data-view"), true); });
  });
  // Sprungziel #termin-… gehört zur Liste; sonst gespeicherte Wahl, Standard Kalender
  var initialView = /^#termin-/.test(window.location.hash) ? "list" : (SL.store.get("sl-dates-view") === "list" ? "list" : "calendar");
  setView(initialView, false);

  /* Kursfilter auch im Kalender ---------------------------------------------- */
  function filterChips(course, jump) {
    forEach(chips, function (chip) {
      chip.parentNode.hidden = !!course && chip.getAttribute("data-course") !== course;
    });
    forEach(document.querySelectorAll(".mg-day"), function (td) {
      td.classList.toggle("mg-has", !!td.querySelector("li:not([hidden]) .cal-chip"));
    });
    if (jump && course) {
      var i = firstUpcomingMonth(course);
      if (i !== -1) show(i, true);
    }
  }
  document.addEventListener("sl-filter", function (event) { filterChips(event.detail.course, true); });
  if (filter && filter.value) filterChips(filter.value, true);

  /* Detailfenster zu einem Termin --------------------------------------------- */
  var dialog = document.getElementById("event-dialog");
  var opener = null;

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }

  function openEvent(id, chip) {
    var e = C.events[id];
    if (!e || !dialog || typeof dialog.showModal !== "function") return false;
    var s = C.strings;
    dialog.querySelector("#event-dialog-title").textContent = e.title;
    var facts = dialog.querySelector("[data-dialog-facts]");
    facts.innerHTML = "";
    [[s.dialog_when, e.date + ", " + e.time], [s.dialog_where, e.place], [s.dialog_seats, e.seats]].forEach(function (row) {
      facts.appendChild(el("dt", {}, row[0]));
      facts.appendChild(el("dd", {}, row[1]));
    });
    var actions = dialog.querySelector("[data-dialog-actions]");
    actions.innerHTML = "";
    var ics = el("a", { "class": "btn ics-btn", href: e.ics, download: "" });
    var icon = document.querySelector(".ics-link .icon, .ics-btn .icon");
    if (icon) ics.appendChild(icon.cloneNode(true));
    ics.appendChild(document.createTextNode(s.ics_add));
    actions.appendChild(ics);
    actions.appendChild(el("a", { "class": "btn btn--outline", href: e.request }, e.full ? s.waitlist : s.request));
    actions.appendChild(el("a", { "class": "btn btn--text", href: e.course }, s.dialog_course));
    opener = chip;
    dialog.showModal();
    ics.focus();
    return true;
  }

  forEach(chips, function (chip) {
    chip.addEventListener("click", function (event) {
      if (openEvent(chip.getAttribute("data-event"), chip)) event.preventDefault();
    });
  });

  if (dialog) {
    dialog.querySelector("[data-dialog-close]").addEventListener("click", function () { dialog.close(); });
    // Klick auf den abgedunkelten Hintergrund schließt ebenfalls
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { if (opener) opener.focus(); });
  }
})();
