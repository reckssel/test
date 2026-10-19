/* ==========================================================================
   Skills Lab e.V. – forms.js
   Validierung, Spam-Schutz und Versand aller Formulare
   (Kontakt, Newsletter, Mitgliedsantrag, Spendenanfrage).

   Versand:
     - data-endpoint gesetzt  → POST per fetch (z. B. Formspree, eigenes PHP)
     - data-endpoint leer     → mailto-Fallback (E-Mail-Programm öffnet sich)
   Ohne JavaScript greifen die HTML-Attribute (required, type=email) und
   das action-Attribut des Formulars.
   ========================================================================== */
(function () {
  "use strict";

  var SL = (window.SkillsLab = window.SkillsLab || {});
  var S = SL.data.strings || {};
  var ERR = S.errors || {};
  var STATUS = S.status || {};

  /* Hilfsfunktionen -------------------------------------------------------- */

  /** Ist das Element sichtbar und aktiv (nicht in ausgeblendetem Bereich)? */
  function isActive(el) {
    if (el.disabled) return false;
    var node = el;
    while (node && node !== document) {
      if (node.hidden) return false;
      node = node.parentNode;
    }
    return true;
  }

  /** Bedingung „name=wert“ bzw. „name“ (Checkbox angehakt) prüfen */
  function conditionMet(form, condition) {
    var parts = condition.split("=");
    var field = form.elements[parts[0]];
    if (!field) return false;
    if (parts.length === 1) return !!field.checked;
    if (field.length !== undefined && field.tagName !== "SELECT") {
      for (var i = 0; i < field.length; i++) {
        if (field[i].checked) return field[i].value === parts[1];
      }
      return false;
    }
    return field.value === parts[1];
  }

  function isRequired(form, el) {
    if (el.required) return true;
    var cond = el.getAttribute("data-required-if");
    return cond ? conditionMet(form, cond) : false;
  }

  /** Beschriftung eines Feldes ohne Sternchen */
  function labelOf(form, el) {
    var text = "";
    if (el.type === "radio") {
      var fs = el.closest("fieldset");
      var legend = fs && fs.querySelector("legend");
      text = legend ? legend.textContent : el.name;
    } else {
      var label = form.querySelector('label[for="' + el.id + '"]');
      text = label ? label.textContent : el.name;
    }
    return text.replace(/\*/g, "").replace(/\s+/g, " ").trim();
  }

  function errorTarget(form, el) {
    if (el.type === "radio") return document.getElementById(form.id.replace(/^form-/, "") + "-" + el.name + "-error");
    return document.getElementById(el.id + "-error");
  }

  function setError(form, el, message) {
    var target = errorTarget(form, el);
    if (target) target.textContent = message || "";
    var group = el.type === "radio" ? form.querySelectorAll('input[name="' + el.name + '"]') : [el];
    Array.prototype.forEach.call(group, function (g) {
      if (message) g.setAttribute("aria-invalid", "true");
      else g.removeAttribute("aria-invalid");
    });
  }

  function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(value + "T00:00:00").getTime());
  }

  /** Ein Feld prüfen. Gibt die Fehlermeldung zurück oder "". */
  function check(form, el) {
    if (!isActive(el) || el.name === "website") return "";
    var required = isRequired(form, el);
    var value = (el.value || "").trim();

    if (el.type === "checkbox") return required && !el.checked ? ERR.checkbox : "";
    if (el.type === "radio") {
      if (!required) return "";
      var any = form.querySelector('input[name="' + el.name + '"]:checked');
      return any ? "" : ERR.choose;
    }
    if (el.tagName === "SELECT") return required && !value ? ERR.choose : "";
    if (!value) return required ? ERR.required : "";

    switch (el.getAttribute("data-validate")) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? "" : ERR.email;
      case "zip":
        return /^[0-9A-Za-z][0-9A-Za-z \-]{2,9}$/.test(value) ? "" : ERR.zip;
      case "birthdate":
        if (!isValidDate(value)) return ERR.date;
        return value > SL.today() ? ERR.birthdate : "";
      case "iban":
        if (!SL.iban) return "";
        var result = SL.iban.validate(value);
        return result.valid ? "" : ERR[result.error] || ERR.iban;
      case "amount":
        var n = parseFloat(value.replace(",", "."));
        return isFinite(n) && n >= 1 && n <= 10000 ? "" : ERR.amount;
    }
    return "";
  }

  function controls(form) {
    return Array.prototype.filter.call(form.elements, function (el) {
      return el.name && el.type !== "submit" && el.type !== "button" && el.tagName !== "FIELDSET";
    });
  }

  /** Alle Felder prüfen, Fehler anzeigen, Liste der Fehler zurückgeben */
  function validateAll(form) {
    var errors = [];
    var seenRadio = {};
    controls(form).forEach(function (el) {
      if (el.type === "radio") {
        if (seenRadio[el.name]) return;
        seenRadio[el.name] = true;
      }
      var message = check(form, el);
      setError(form, el, message);
      if (message) errors.push({ el: el, message: message });
    });
    return errors;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function showSummary(form, errors) {
    var box = document.getElementById(form.id + "-summary");
    if (!box) return;
    if (!errors.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.innerHTML =
      "<h3>" + escapeHtml(ERR.summary) + "</h3><ul>" +
      errors.map(function (e) {
        return '<li><a href="#' + e.el.id + '">' + escapeHtml(labelOf(form, e.el)) + ": " + escapeHtml(e.message) + "</a></li>";
      }).join("") + "</ul>";
    box.hidden = false;
    box.focus();
    Array.prototype.forEach.call(box.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function (event) {
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (target) {
          event.preventDefault();
          target.focus();
        }
      });
    });
  }

  /** Formularinhalte als lesbare Zeilen „Beschriftung: Wert“ */
  function collect(form) {
    var lines = [];
    var seenRadio = {};
    controls(form).forEach(function (el) {
      if (el.name === "website" || !isActive(el)) return;
      var value;
      if (el.type === "radio") {
        if (seenRadio[el.name]) return;
        seenRadio[el.name] = true;
        var checked = form.querySelector('input[name="' + el.name + '"]:checked');
        if (!checked) return;
        var lab = form.querySelector('label[for="' + checked.id + '"]');
        value = lab ? lab.textContent.trim() : checked.value;
      } else if (el.type === "checkbox") {
        value = el.checked ? el.value : (SL.data.lang === "de" ? "nein" : "no");
      } else if (el.tagName === "SELECT") {
        value = el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : "";
      } else {
        value = el.value.trim();
        if (el.getAttribute("data-validate") === "iban" && SL.iban) value = SL.iban.format(value);
      }
      if (value === "") return;
      lines.push(labelOf(form, el) + ": " + value);
    });
    return lines;
  }

  function showStatus(form, html) {
    var status = document.getElementById(form.id + "-status");
    if (!status) return;
    status.innerHTML = html ? '<div class="success-box" tabindex="-1">' + html + "</div>" : "";
    var box = status.firstChild;
    if (box && box.focus) box.focus();
  }

  /* Bedingte Bereiche (z. B. SEPA-Mandat nur bei Lastschrift) --------------- */
  function updateConditional(form) {
    Array.prototype.forEach.call(form.querySelectorAll("[data-show-if]"), function (section) {
      var show = conditionMet(form, section.getAttribute("data-show-if"));
      section.hidden = !show;
      Array.prototype.forEach.call(section.querySelectorAll("input, select, textarea"), function (el) {
        el.disabled = !show;
      });
    });
  }

  /* Versand ---------------------------------------------------------------- */
  function send(form, formId) {
    var endpoint = form.getAttribute("data-endpoint");
    var name = (S.form_names && S.form_names[formId]) || formId;
    var subject = SL.format(S.mail_subject, { form: name });

    if (endpoint) {
      var button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.setAttribute("data-label", button.textContent);
        button.textContent = STATUS.sending;
      }
      var body = new FormData(form);
      body.append("_subject", subject);
      return fetch(endpoint, { method: "POST", body: body, headers: { Accept: "application/json" } })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return "<p>" + escapeHtml(STATUS[formId] || "") + "</p>";
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = button.getAttribute("data-label");
          }
        });
    }

    // mailto-Fallback: E-Mail-Programm mit vorausgefüllter Nachricht öffnen
    var mail = "mailto:" + encodeURIComponent(SL.data.org.email).replace("%40", "@") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(collect(form).join("\n"));
    window.location.href = mail;
    return Promise.resolve(
      "<p>" + escapeHtml(STATUS[formId] || "") + "</p><p class=\"small\">" + escapeHtml(STATUS.mailto_opened) + "</p>"
    );
  }

  /* Einrichtung je Formular ------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll("form[data-form]"), function (form) {
    var formId = form.getAttribute("data-form");
    form.noValidate = true; // eigene, mehrsprachige Meldungen statt Browser-Meldungen

    updateConditional(form);
    form.addEventListener("change", function () { updateConditional(form); });

    // Prüfen beim Verlassen eines Feldes; Fehler beim Tippen sofort zurücknehmen
    form.addEventListener("focusout", function (event) {
      var el = event.target;
      if (!el.name || el.type === "radio" || el.type === "checkbox") return;
      if (el.getAttribute("data-validate") === "iban" && el.value && SL.iban) el.value = SL.iban.format(el.value);
      if (el.value || el.getAttribute("aria-invalid")) setError(form, el, check(form, el));
    });
    form.addEventListener("input", function (event) {
      var el = event.target;
      if (el.getAttribute("aria-invalid") === "true" && !check(form, el)) setError(form, el, "");
    });
    form.addEventListener("change", function (event) {
      var el = event.target;
      if ((el.type === "radio" || el.type === "checkbox") && el.getAttribute("aria-invalid") === "true") {
        setError(form, el, check(form, el));
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showStatus(form, "");

      // Honeypot: Bots füllen das versteckte Feld aus → scheinbarer Erfolg, kein Versand
      var trap = form.elements.website;
      if (trap && trap.value) {
        showStatus(form, "<p>" + escapeHtml(STATUS[formId] || "") + "</p>");
        form.reset();
        return;
      }

      var errors = validateAll(form);
      showSummary(form, errors);
      if (errors.length) return;

      // Spendenanfrage: Daten für die Bestätigung merken, bevor das Formular geleert wird
      var donation = null;
      if (formId === "donation") {
        var interval = form.querySelector('input[name="rhythmus"]:checked');
        donation = {
          amount: SL.girocode ? SL.girocode.parseAmount(form.elements.betrag.value) : null,
          interval: interval ? interval.value : "once",
          name: form.elements.name.value.trim(),
          email: form.elements.email.value.trim()
        };
      }

      send(form, formId)
        .then(function (html) {
          showStatus(form, html);
          form.reset();
          updateConditional(form);
          if (donation && SL.payments) {
            var confirm = document.getElementById("donation-confirm");
            var statusLine = confirm && confirm.querySelector("[data-confirm-status]");
            if (statusLine) statusLine.innerHTML = html.replace(/<\/?p[^>]*>/g, " ");
            var provider = SL.payments.get("transfer");
            if (provider) provider.start(donation);
          }
        })
        .catch(function () {
          showStatus(form, '<p class="error-text">' + escapeHtml(ERR.send_failed) + "</p>");
        });
    });
  });

  /* Kontaktformular aus Links vorbelegen (?thema=…&termin=…&kurs=…) -------- */
  var contact = document.getElementById("form-contact");
  if (contact) {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get("thema");
    if (topic && contact.elements.thema.querySelector('option[value="' + topic.replace(/[^a-z]/g, "") + '"]')) {
      contact.elements.thema.value = topic;
    }
    var label = null;
    if (params.get("termin") && SL.data.events) label = SL.data.events[params.get("termin")];
    if (!label && params.get("kurs") && SL.data.courses) label = SL.data.courses[params.get("kurs")];
    if (label && !contact.elements.nachricht.value) {
      contact.elements.nachricht.value = SL.format(S.prefill, { event: label }) + "\n\n";
    }
  }
})();
