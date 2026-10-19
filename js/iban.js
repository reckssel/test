/* ==========================================================================
   Skills Lab e.V. – iban.js
   IBAN-Prüfung nach ISO 13616 (Länge je Land + Prüfsumme Mod 97-10).
   Läuft vollständig im Browser, es werden keine Daten übertragen.
   Hinweis: Eine gültige Prüfsumme heißt nicht, dass das Konto existiert.
   ========================================================================== */
(function () {
  "use strict";

  var SL = (window.SkillsLab = window.SkillsLab || {});

  /* IBAN-Längen der Länder im SEPA-Raum */
  var LENGTHS = {
    AD: 24, AT: 20, BE: 16, BG: 22, CH: 21, CY: 28, CZ: 24, DE: 22, DK: 18, EE: 20,
    ES: 24, FI: 18, FR: 27, GB: 22, GI: 23, GR: 27, HR: 21, HU: 28, IE: 22, IS: 26,
    IT: 27, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MT: 31, NL: 18, NO: 15, PL: 28,
    PT: 25, RO: 24, SE: 24, SI: 19, SK: 24, SM: 27, VA: 22
  };

  /** Leerzeichen entfernen, Großbuchstaben */
  function normalize(value) {
    return String(value || "").replace(/[\s-]+/g, "").toUpperCase();
  }

  /** In Vierergruppen darstellen */
  function format(value) {
    return normalize(value).replace(/(.{4})/g, "$1 ").trim();
  }

  /** Rest der Division durch 97 – stückweise, weil die Zahl zu groß für Number ist */
  function mod97(digits) {
    var remainder = 0;
    for (var i = 0; i < digits.length; i += 7) {
      remainder = parseInt(String(remainder) + digits.substring(i, i + 7), 10) % 97;
    }
    return remainder;
  }

  /**
   * Prüft eine IBAN.
   * @returns {{valid: boolean, error: (null|"iban"|"iban_length"|"iban_country")}}
   */
  function validate(value) {
    var iban = normalize(value);
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return { valid: false, error: "iban" };
    var country = iban.slice(0, 2);
    if (!LENGTHS[country]) return { valid: false, error: "iban_country" };
    if (iban.length !== LENGTHS[country]) return { valid: false, error: "iban_length" };
    var rearranged = iban.slice(4) + iban.slice(0, 4);
    var digits = rearranged.replace(/[A-Z]/g, function (ch) { return String(ch.charCodeAt(0) - 55); });
    return mod97(digits) === 1 ? { valid: true, error: null } : { valid: false, error: "iban" };
  }

  SL.iban = { normalize: normalize, format: format, validate: validate };
})();
