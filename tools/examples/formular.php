<?php
/**
 * Beispiel-Empfänger für die Formulare von Skills Lab e.V. (eigenes PHP-Skript)
 *
 * Einsatz:
 *   1. Datei auf den Webspace kopieren, z. B. als /formular.php
 *   2. $EMPFAENGER und $ABSENDER unten anpassen
 *   3. In data/site.json bei "forms" die URL eintragen, z. B. "https://www.example.org/formular.php"
 *   4. python3 tools/build.py ausführen und Seiten hochladen
 *
 * Das Skript nimmt die Formulardaten per POST entgegen, prüft Honeypot und Pflichtangaben,
 * schickt eine E-Mail an den Verein und antwortet mit JSON ({"ok": true}).
 * Es speichert nichts auf dem Server.
 *
 * Hinweise:
 *   - Der Webspace muss PHP und die mail()-Funktion unterstützen (beim Hoster erfragen).
 *   - Die Daten liegen danach im E-Mail-Postfach des Vereins: Zugriff und Löschfristen regeln!
 *   - Double-Opt-in für den Newsletter leistet dieses Skript NICHT (dafür einen Newsletter-Dienst nutzen).
 *   - Beispielcode: vor dem Einsatz von einer fachkundigen Person prüfen lassen.
 */

declare(strict_types=1);

$EMPFAENGER = 'info@example.org';          // [Platzhalter] Postfach des Vereins
$ABSENDER   = 'website@example.org';       // [Platzhalter] Adresse der eigenen Domain (wichtig gegen Spam-Filter)
$ERLAUBTE_FORMULARE = ['contact', 'newsletter', 'membership', 'donation'];
$MAX_FELDLAENGE = 5000;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function antwort(int $status, array $daten): void
{
    http_response_code($status);
    echo json_encode($daten, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    antwort(405, ['ok' => false, 'error' => 'method']);
}

// Honeypot: Bots füllen das versteckte Feld „website“ aus → scheinbarer Erfolg, keine E-Mail
if (!empty($_POST['website'])) {
    antwort(200, ['ok' => true]);
}

// Formularart aus dem Betreff ableiten (wird vom JavaScript als _subject mitgeschickt)
$betreff = trim((string)($_POST['_subject'] ?? 'Anfrage über die Website'));
$betreff = preg_replace('/[\r\n]+/', ' ', $betreff);          // keine Kopfzeilen-Injektion
$betreff = mb_substr($betreff, 0, 150);

// Mindestprüfung: E-Mail-Adresse und Datenschutz-Einwilligung bzw. Newsletter-Einwilligung
$email = trim((string)($_POST['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    antwort(422, ['ok' => false, 'error' => 'email']);
}
if (empty($_POST['datenschutz']) && empty($_POST['einwilligung'])) {
    antwort(422, ['ok' => false, 'error' => 'consent']);
}

// Inhalt der E-Mail: alle Felder außer technischen
$zeilen = [];
foreach ($_POST as $name => $wert) {
    if (in_array($name, ['website', '_subject'], true) || is_array($wert)) {
        continue;
    }
    $name = preg_replace('/[^a-z0-9_\-]/i', '', (string)$name);
    $wert = mb_substr(trim((string)$wert), 0, $MAX_FELDLAENGE);
    $zeilen[] = $name . ': ' . $wert;
}
$zeilen[] = '';
$zeilen[] = 'Gesendet am: ' . date('d.m.Y H:i');

$kopf = [
    'From: Skills Lab Website <' . $ABSENDER . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

$ok = mail(
    $EMPFAENGER,
    '=?UTF-8?B?' . base64_encode($betreff) . '?=',
    implode("\n", $zeilen),
    implode("\r\n", $kopf)
);

antwort($ok ? 200 : 500, ['ok' => $ok]);
