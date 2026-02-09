import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 독일어 번역이 필요한 영어 텍스트들
const translations = {
  // Common
  "Access denied": "Zugriff verweigert",
  "Failed to copy": "Kopieren fehlgeschlagen",
  "Developer tools are disabled": "Entwicklertools sind deaktiviert",
  "Downloaded": "Heruntergeladen",
  "Filter": "Filter",
  "Sort": "Sortieren",
  "URL copied": "URL kopiert",

  // Home
  "Works on PC, tablet, and mobile devices": "Funktioniert auf PC, Tablet und Mobilgeräten",
  "Responsive Design": "Responsives Design",
  "Web-based utility tools for developers and general users, no login required": "Webbasierte Hilfsprogramme für Entwickler und allgemeine Benutzer, keine Anmeldung erforderlich",
  "No-Install Utilities": "Keine Installation erforderlich",
  "Available Tools": "Verfügbare Tools",
  "Utilities": "Hilfsprogramme",

  // Messages
  "Report has been submitted successfully.": "Bericht wurde erfolgreich übermittelt.",
  "A network error occurred. Please check your network connection.": "Ein Netzwerkfehler ist aufgetreten. Bitte überprüfen Sie Ihre Netzwerkverbindung.",
  "Translation not found for this message.": "Übersetzung für diese Nachricht nicht gefunden.",
  "An internal server error occurred.": "Ein interner Serverfehler ist aufgetreten.",
  "A validation error occurred.": "Ein Validierungsfehler ist aufgetreten.",

  // Tools
  "Collection of various web-based utility tools": "Sammlung verschiedener webbasierter Hilfsprogramme",

  // Character Counter
  "Character Counter": "Zeichenzähler",
  "Characters (no spaces)": "Zeichen (ohne Leerzeichen)",
  "Space only": "Nur Leerzeichen",
  "Unicode word boundary": "Unicode-Wortgrenze",
  "Word boundary option": "Wortgrenzenoption",
  "Characters": "Zeichen",
  "No Spaces": "Ohne Leerzeichen",
  "Words": "Wörter",
  "Lines": "Zeilen",
  "Bytes": "Bytes",

  // My IP
  "My IP": "Meine IP",
  "IP Information": "IP-Informationen",
  "Timezone": "Zeitzone",
  "Internet Service Provider": "Internetdienstanbieter",
  "Coordinates": "Koordinaten",
  "Refreshing...": "Aktualisierung...",
  "Refresh Info": "Informationen aktualisieren",

  // UUID Generator
  "UUID Generator": "UUID-Generator",
  "Generate UUID (Universally Unique Identifier). Create and copy unique identifiers in UUID v4 format.": "UUID (Universally Unique Identifier) generieren. Erstellen und kopieren Sie eindeutige Kennungen im UUID v4-Format.",
  "Version": "Version",
  "Timestamp-based": "Zeitstempelbasiert",
  "Random": "Zufällig",
  "Quantity": "Anzahl",
  "Options": "Optionen",
  "Uppercase": "Großbuchstaben",
  "Include hyphens": "Mit Bindestrichen",
  "Include braces": "Mit geschweiften Klammern",
  "Include quotes": "Mit Anführungszeichen",
  "Generated UUIDs": "Generierte UUIDs",
  "All copied": "Alle kopiert",

  // Password Generator
  "Password Generator": "Passwortgenerator",
  "Generate secure and strong passwords. Create highly secure passwords by combining uppercase letters, lowercase letters, numbers, and special characters.": "Sichere und starke Passwörter generieren. Erstellen Sie hochsichere Passwörter durch Kombination von Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.",
  "Include uppercase": "Großbuchstaben einschließen",
  "Include lowercase": "Kleinbuchstaben einschließen",
  "Include numbers": "Zahlen einschließen",
  "Include symbols": "Symbole einschließen",
  "Uppercase (A-Z)": "Großbuchstaben (A-Z)",
  "Lowercase (a-z)": "Kleinbuchstaben (a-z)",
  "Numbers (0-9)": "Zahlen (0-9)",
  "Symbols (!@#$%...)": "Symbole (!@#$%...)",
  "Exclude similar characters": "Ähnliche Zeichen ausschließen",
  "0, O, l, I, etc.": "0, O, l, I, usw.",
  "Set options and generate a password": "Optionen festlegen und Passwort generieren",
  "Weak": "Schwach",
  "Medium": "Mittel",
  "Strong": "Stark",
  "Very Strong": "Sehr stark",
  "Regenerate": "Neu generieren",

  // Hash Generator
  "Hash Generator": "Hash-Generator",
  "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes. See real-time results from various hash algorithms as you type.": "Generieren Sie MD5-, SHA-1-, SHA-256- und SHA-512-Hashes. Sehen Sie Echtzeitergebnisse verschiedener Hash-Algorithmen während der Eingabe.",
  "Input Text": "Eingabetext",
  "Enter text to hash...": "Text zum Hashen eingeben...",
  "Hash Type": "Hash-Typ",
  "Compare Hash": "Hash vergleichen",
  "Compare mode": "Vergleichsmodus",
  "Enter hash to compare...": "Hash zum Vergleichen eingeben...",
  "Match": "Übereinstimmung",
  "No match": "Keine Übereinstimmung",

  // QR Generator
  "QR Generator": "QR-Generator",
  "QR code generator that converts text or URLs into QR codes. Generate and download QR codes with various sizes and error recovery levels.": "QR-Code-Generator, der Text oder URLs in QR-Codes umwandelt. Generieren und laden Sie QR-Codes in verschiedenen Größen und mit verschiedenen Fehlerkorrekturebenen herunter.",
  "Data Type": "Datentyp",
  "Text": "Text",
  "Text or URL": "Text oder URL",
  "URL": "URL",
  "Email": "E-Mail",
  "Phone": "Telefon",
  "SMS": "SMS",
  "https://example.com": "https://beispiel.de",
  "user@example.com": "benutzer@beispiel.de",
  "+821012345678": "+491701234567",
  "Phone number": "Telefonnummer",
  "Message content": "Nachrichteninhalt",
  "Error correction level": "Fehlerkorrekturebene",
  "Low (7%)": "Niedrig (7%)",
  "Medium (15%)": "Mittel (15%)",
  "Quartile (25%)": "Quartil (25%)",
  "High (30%)": "Hoch (30%)",
  "Small damage recovery": "Kleine Schadenswiederherstellung",
  "Medium damage recovery": "Mittlere Schadenswiederherstellung",
  "Large damage recovery": "Große Schadenswiederherstellung",
  "Maximum damage recovery": "Maximale Schadenswiederherstellung",
  "Foreground": "Vordergrund",
  "Background": "Hintergrund",
  "Include margin": "Rand einschließen",
  "Download PNG": "PNG herunterladen",
  "Download SVG": "SVG herunterladen",
  "Enter text to\\ngenerate QR code": "Text eingeben um\\nQR-Code zu generieren",
  "Generating...": "Generierung...",
  "Please generate a QR code first": "Bitte generieren Sie zuerst einen QR-Code",
  "QR code downloaded successfully": "QR-Code erfolgreich heruntergeladen",
  "QR code copied successfully": "QR-Code erfolgreich kopiert",

  // WiFi QR
  "WiFi QR": "WLAN-QR",
  "Convert WiFi network information into QR codes for easy sharing. Scan the QR code with a smartphone to connect to WiFi automatically.": "WLAN-Netzwerkinformationen in QR-Codes für einfaches Teilen umwandeln. Scannen Sie den QR-Code mit einem Smartphone, um sich automatisch mit dem WLAN zu verbinden.",
  "No security": "Keine Sicherheit",
  "Hidden network": "Verstecktes Netzwerk",
  "Enter WiFi Information": "WLAN-Informationen eingeben",
  "Generate QR Code": "QR-Code generieren",
  "Generated QR Code": "Generierter QR-Code",
  "Network": "Netzwerk",
  "Security": "Sicherheit",
  "Status": "Status",
  "QR Code Size": "QR-Code-Größe",
  "Please enter network name": "Bitte Netzwerknamen eingeben",
  "Please enter password": "Bitte Passwort eingeben",
  "Password is required for selected security type": "Passwort ist für den gewählten Sicherheitstyp erforderlich",
  "QR code generated successfully": "QR-Code erfolgreich generiert",
  "Failed to generate QR code": "QR-Code-Generierung fehlgeschlagen",
  "For security, only share the generated QR code with trusted people": "Aus Sicherheitsgründen teilen Sie den generierten QR-Code nur mit vertrauenswürdigen Personen"
};

// 독일어 파일 업데이트
function updateGermanTranslations() {
  const filePath = join(__dirname, '..', 'i18n', 'locales', 'de.json');
  let content = readFileSync(filePath, 'utf8');
  let fileContent = content;
  let updateCount = 0;

  // 각 번역 항목에 대해 치환
  for (const [english, german] of Object.entries(translations)) {
    // JSON 문자열 내에서 영어 텍스트를 찾아 독일어로 치환
    const regex = new RegExp(`"${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    const newContent = fileContent.replace(regex, `"${german}"`);

    if (newContent !== fileContent) {
      fileContent = newContent;
      updateCount++;
      console.log(`✅ "${english}" → "${german}"`);
    }
  }

  // 파일 저장
  if (updateCount > 0) {
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`\n✨ ${updateCount}개의 영어 텍스트를 독일어로 번역했습니다!`);
  } else {
    console.log('\n✅ 번역할 항목이 없습니다.');
  }
}

// 실행
updateGermanTranslations();