/* ==========================================================================
   Skills Lab e.V. – girocode.js
   Erzeugt einen EPC-QR-Code („GiroCode“) für SEPA-Überweisungen – vollständig
   im Browser mit der lokalen Bibliothek js/vendor/qrcode.js (MIT).
   Es werden keine Daten an Server übertragen.

   Aufbau des Datensatzes (EPC069-12, Version 002, laut Sekundärquellen):
     1 BCD  2 002  3 1 (UTF-8)  4 SCT  5 BIC  6 Name (≤70)  7 IBAN
     8 Betrag „EUR12.50“ (optional)  9 Purpose (leer)  10 Referenz (leer)
     11 Verwendungszweck (≤140)
   Gesamt höchstens 331 Byte, Fehlerkorrektur M.
   ========================================================================== */
(function () {
  "use strict";

  var SL = (window.SkillsLab = window.SkillsLab || {});
  var MAX_BYTES = 331;
  var QUIET = 4; // Ruhezone in Modulen

  function byteLength(text) {
    return window.TextEncoder ? new TextEncoder().encode(text).length : unescape(encodeURIComponent(text)).length;
  }

  /** EPC-Datensatz als Text */
  function payload(opts) {
    var amount = typeof opts.amount === "number" && opts.amount > 0 ? "EUR" + opts.amount.toFixed(2) : "";
    var lines = [
      "BCD",
      "002",
      "1",
      "SCT",
      opts.bic || "",
      String(opts.name || "").slice(0, 70),
      String(opts.iban || "").replace(/\s+/g, "").toUpperCase(),
      amount,
      "",
      "",
      String(opts.text || "").slice(0, 140)
    ];
    var data = lines.join("\n");
    if (byteLength(data) > MAX_BYTES) throw new Error("EPC-Datensatz zu lang");
    return data;
  }

  /** QR-Code als SVG-Text (schwarz auf weiß, scharfe Kanten) */
  function svg(text) {
    if (typeof window.qrcode !== "function") throw new Error("QR-Bibliothek fehlt");
    window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs["UTF-8"];
    var qr = window.qrcode(0, "M");
    qr.addData(text, "Byte");
    qr.make();
    var count = qr.getModuleCount();
    var size = count + QUIET * 2;
    var d = "";
    for (var y = 0; y < count; y++) {
      for (var x = 0; x < count; x++) {
        if (qr.isDark(y, x)) d += "M" + (x + QUIET) + " " + (y + QUIET) + "h1v1h-1z";
      }
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" ' +
      'width="' + size * 6 + '" height="' + size * 6 + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
      '<rect width="100%" height="100%" fill="#ffffff"/><path fill="#000000" d="' + d + '"/></svg>'
    );
  }

  /** Betrag in der Seitensprache formatieren */
  function money(amount) {
    var lang = SL.data.lang || "de";
    var n = new Intl.NumberFormat(lang, {
      minimumFractionDigits: amount % 1 ? 2 : 0,
      maximumFractionDigits: 2
    }).format(amount);
    return (SL.data.money_pattern || "{n} €").replace("{n}", n);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /**
   * Zeichnet Code und Textalternative in einen Bereich [data-giro].
   * @param {Element} box  Bereich mit [data-giro-code] und [data-giro-text]
   * @param {number|null} amount  Betrag in Euro oder null (frei wählbar)
   * @param {string} [reference]  Verwendungszweck (Standard aus den Bankdaten)
   */
  function render(box, amount, reference) {
    var bank = SL.data.bank;
    var s = SL.data.strings.donate;
    var text = reference || bank.reference;
    var data = payload({ bic: bank.bic, name: bank.holder, iban: bank.iban, amount: amount, text: text });
    var code = box.querySelector("[data-giro-code]");
    code.innerHTML = svg(data);
    code.setAttribute(
      "aria-label",
      amount
        ? SL.format(s.giro_alt, { amount: money(amount), name: bank.holder })
        : SL.format(s.giro_alt_open, { name: bank.holder })
    );
    var rows = [
      [s.giro_recipient, bank.holder],
      [s.iban, SL.iban ? SL.iban.format(bank.iban) : bank.iban],
      [s.bic, bank.bic],
      [s.giro_amount, amount ? money(amount) : s.giro_open_amount],
      [s.reference, text]
    ];
    var dl = box.querySelector("[data-giro-text]");
    if (dl) {
      dl.innerHTML = rows.map(function (r) {
        return "<dt>" + escapeHtml(r[0]) + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
      }).join("");
    }
    box.setAttribute("data-amount", amount || "");
    return data;
  }

  /** SVG-Datei zum Speichern anbieten */
  function download(box) {
    var svgEl = box.querySelector("[data-giro-code] svg");
    if (!svgEl) return;
    var source = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgEl.outerHTML.replace(/ aria-hidden="true" focusable="false"/, "");
    var blob = new Blob([source], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var amount = box.getAttribute("data-amount");
    a.href = url;
    a.download = "skills-lab-girocode" + (amount ? "-" + String(amount).replace(".", "_") + "eur" : "") + ".svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /** Betragseingabe lesen (Komma oder Punkt), null wenn ungültig */
  function parseAmount(value) {
    var n = parseFloat(String(value || "").replace(/\s/g, "").replace(",", "."));
    return isFinite(n) && n >= 1 && n <= 10000 ? Math.round(n * 100) / 100 : null;
  }

  SL.girocode = { payload: payload, svg: svg, render: render, download: download, money: money, parseAmount: parseAmount };

  /* Spendenseite: Betragswahl → Code live aktualisieren ------------------- */
  var main = document.querySelector('[data-giro="main"]');
  if (!main || !SL.data.bank) return;

  var radios = document.querySelectorAll('input[name="giro-amount"]');
  var otherField = document.getElementById("giro-other-field");
  var otherInput = document.getElementById("giro-other");
  var otherError = document.getElementById("giro-other-error");

  function update() {
    var checked = document.querySelector('input[name="giro-amount"]:checked');
    var amount = null;
    if (checked && checked.value === "other") {
      otherField.hidden = false;
      if (otherInput.value) {
        amount = parseAmount(otherInput.value);
        var invalid = amount === null;
        otherError.textContent = invalid ? SL.data.strings.errors.amount : "";
        otherInput.setAttribute("aria-invalid", invalid ? "true" : "false");
      } else {
        otherError.textContent = "";
        otherInput.removeAttribute("aria-invalid");
      }
    } else {
      otherField.hidden = true;
      amount = checked ? Number(checked.value) : null;
    }
    render(main, amount);
  }

  Array.prototype.forEach.call(radios, function (r) {
    r.addEventListener("change", function () {
      update();
      if (r.value === "other") otherInput.focus();
    });
  });
  otherInput.addEventListener("input", update);

  var dl = document.querySelector("[data-giro-download]");
  if (dl) dl.addEventListener("click", function () { download(main); });

  update();
})();
