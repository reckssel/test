/* ==========================================================================
   Skills Lab e.V. – payments.js
   Erweiterungspunkt für Zahlungswege. In Version 1 gibt es nur
   „transfer“ (Überweisung mit GiroCode). Weitere Anbieter (z. B. PayPal,
   Stripe, SEPA-Lastschrift) können später mit SkillsLab.payments.register()
   ergänzt und in data/site.json → payments.donation_providers aktiviert
   werden. Siehe docs/03-dokumentation.md, Abschnitt „Erweiterungen“.

   Schnittstelle eines Anbieters:
     {
       id: "paypal",                      // eindeutige Kennung
       label: "PayPal",                   // Anzeigename
       isAvailable: function () {...},    // true, wenn nutzbar
       start: function (donation) {...}   // donation = { amount, interval, name, email }
     }
   ========================================================================== */
(function () {
  "use strict";

  var SL = (window.SkillsLab = window.SkillsLab || {});
  var registry = {};

  SL.payments = {
    register: function (provider) {
      if (!provider || !provider.id || typeof provider.start !== "function") {
        throw new Error("Ungültiger Zahlungsanbieter");
      }
      registry[provider.id] = provider;
    },
    /** Aktivierte und verfügbare Anbieter in der konfigurierten Reihenfolge */
    available: function () {
      var ids = SL.data.providers || ["transfer"];
      return ids.map(function (id) { return registry[id]; }).filter(function (p) {
        return p && (!p.isAvailable || p.isAvailable());
      });
    },
    get: function (id) { return registry[id]; }
  };

  /* Anbieter „Überweisung / GiroCode“ -------------------------------------- */
  SL.payments.register({
    id: "transfer",
    label: (SL.data.strings && SL.data.strings.donate && SL.data.strings.donate.provider_transfer) || "Überweisung",
    isAvailable: function () { return !!SL.data.bank; },
    /** Zeigt die Bestätigung mit Bankdaten und GiroCode für den Betrag */
    start: function (donation) {
      var confirm = document.getElementById("donation-confirm");
      if (!confirm) return;
      var reference = SL.data.bank.reference + (donation.name ? " " + donation.name : "");
      var box = confirm.querySelector("[data-giro]");
      if (SL.girocode && box) SL.girocode.render(box, donation.amount || null, reference.slice(0, 140));
      var interval = confirm.querySelector("[data-confirm-interval]");
      if (interval) interval.hidden = !donation.interval || donation.interval === "once";
      var providers = confirm.querySelector("[data-providers]");
      if (providers) {
        providers.textContent = SL.payments.available().map(function (p) { return p.label; }).join(", ");
      }
      confirm.hidden = false;
      confirm.focus();
    }
  });
})();
