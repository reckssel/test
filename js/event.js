/* ==========================================================================
   Skills Lab e.V. – event.js (nur Termin-Detailseiten)
   - Countdown („Heute“, „Morgen“, „In 12 Tagen“) nach dem heutigen Datum
   - Vergangene Termine: Hinweis zeigen, Anfrage-Button ausblenden
   - Teilen: Teilen-Menü des Geräts, sonst Link in die Zwischenablage
   Ohne JavaScript bleiben Datum, Aktionen und Hinweis aus dem Build stehen.
   ========================================================================== */
(function () {
  "use strict";

  var SL = window.SkillsLab;
  var E = SL && SL.data && SL.data.event;
  if (!E) return;

  /* Countdown und vergangene Termine ----------------------------------------- */
  function dayNumber(iso) {
    var p = iso.split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000;
  }
  var diff = Math.round(dayNumber(E.date) - dayNumber(SL.today()));
  var chip = document.querySelector("[data-countdown]");
  var past = document.querySelector("[data-event-past]");
  var request = document.querySelector("[data-event-request]");

  if (diff < 0) {
    if (past) past.hidden = false;
    if (request) request.hidden = true;
    if (chip) chip.hidden = true;
  } else {
    if (past) past.hidden = true;
    if (request) request.hidden = false;
    if (chip) {
      var c = E.countdown;
      var text;
      if (diff === 0) text = c.today;
      else if (diff === 1) text = c.tomorrow;
      else {
        var form = "other";
        try { form = new Intl.PluralRules(SL.data.lang).select(diff); } catch (err) { /* alter Browser */ }
        text = SL.format(c[form] || c.other, { n: diff });
      }
      chip.textContent = text;
      chip.classList.toggle("event-countdown--soon", diff <= 1);
      chip.hidden = false;
    }
  }

  /* Teilen ------------------------------------------------------------------- */
  var share = document.querySelector("[data-share]");
  if (!share) return;
  var canShare = typeof navigator.share === "function";
  var label = canShare ? E.share.share : E.share.share_copy;
  share.textContent = label;
  share.hidden = false;
  share.addEventListener("click", function () {
    var url = location.href.split("#")[0];
    if (canShare) {
      navigator.share({ title: E.title, text: E.share_text, url: url }).catch(function () { /* abgebrochen */ });
      return;
    }
    SL.copyText(url).then(function () {
      share.textContent = E.share.share_copied;
      SL.announce(E.share.share_copied);
      window.setTimeout(function () { share.textContent = label; }, 2500);
    });
  });
})();
