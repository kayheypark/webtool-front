import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 일본어 번역이 필요한 영어 텍스트들
const translations = {
  // Common
  "Access denied": "アクセスが拒否されました",
  "Failed to copy": "コピーに失敗しました",
  "Developer tools are disabled": "開発者ツールは無効になっています",
  "Downloaded": "ダウンロード完了",
  "Filter": "フィルター",
  "Sort": "並べ替え",
  "URL copied": "URLをコピーしました",

  // Home
  "Works on PC, tablet, and mobile devices": "PC、タブレット、モバイル機器で動作",
  "Responsive Design": "レスポンシブデザイン",
  "Web-based utility tools for developers and general users, no login required": "開発者と一般ユーザー向けのWebベースユーティリティツール、ログイン不要",
  "No-Install Utilities": "インストール不要のユーティリティ",
  "Available Tools": "利用可能なツール",
  "Utilities": "ユーティリティ",

  // Messages
  "Report has been submitted successfully.": "レポートが正常に送信されました。",
  "A network error occurred. Please check your network connection.": "ネットワークエラーが発生しました。ネットワーク接続を確認してください。",
  "Translation not found for this message.": "このメッセージの翻訳が見つかりません。",
  "An internal server error occurred.": "内部サーバーエラーが発生しました。",
  "A validation error occurred.": "検証エラーが発生しました。",

  // Tools
  "Collection of various web-based utility tools": "様々なWebベースユーティリティツールのコレクション",

  // Character Counter
  "Character Counter": "文字カウンター",
  "Characters (no spaces)": "文字（スペースなし）",
  "Space only": "スペースのみ",
  "Unicode word boundary": "Unicode単語境界",
  "Word boundary option": "単語境界オプション",
  "Characters": "文字",
  "No Spaces": "スペースなし",
  "Words": "単語",
  "Lines": "行",
  "Bytes": "バイト",

  // My IP
  "My IP": "私のIP",
  "IP Information": "IP情報",
  "Timezone": "タイムゾーン",
  "Internet Service Provider": "インターネットサービスプロバイダー",
  "Coordinates": "座標",
  "Refreshing...": "更新中...",
  "Refresh Info": "情報を更新",

  // UUID Generator
  "UUID Generator": "UUID生成器",
  "Generate UUID (Universally Unique Identifier). Create and copy unique identifiers in UUID v4 format.": "UUID（汎用一意識別子）を生成。UUID v4形式の一意識別子を作成してコピー。",
  "Version": "バージョン",
  "Timestamp-based": "タイムスタンプベース",
  "Random": "ランダム",
  "Quantity": "数量",
  "Options": "オプション",
  "Uppercase": "大文字",
  "Include hyphens": "ハイフンを含む",
  "Include braces": "波括弧を含む",
  "Include quotes": "引用符を含む",
  "Generated UUIDs": "生成されたUUID",
  "All copied": "すべてコピーしました",

  // Password Generator
  "Password Generator": "パスワード生成器",
  "Generate secure and strong passwords. Create highly secure passwords by combining uppercase letters, lowercase letters, numbers, and special characters.": "安全で強力なパスワードを生成。大文字、小文字、数字、特殊文字を組み合わせて高度に安全なパスワードを作成。",
  "Include uppercase": "大文字を含む",
  "Include lowercase": "小文字を含む",
  "Include numbers": "数字を含む",
  "Include symbols": "記号を含む",
  "Uppercase (A-Z)": "大文字 (A-Z)",
  "Lowercase (a-z)": "小文字 (a-z)",
  "Numbers (0-9)": "数字 (0-9)",
  "Symbols (!@#$%...)": "記号 (!@#$%...)",
  "Exclude similar characters": "類似文字を除外",
  "0, O, l, I, etc.": "0, O, l, I など",
  "Set options and generate a password": "オプションを設定してパスワードを生成",
  "Weak": "弱い",
  "Medium": "中程度",
  "Strong": "強い",
  "Very Strong": "非常に強い",
  "Regenerate": "再生成",

  // Hash Generator
  "Hash Generator": "ハッシュ生成器",
  "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes. See real-time results from various hash algorithms as you type.": "MD5、SHA-1、SHA-256、SHA-512ハッシュを生成。入力しながら様々なハッシュアルゴリズムのリアルタイム結果を確認。",
  "Input Text": "入力テキスト",
  "Enter text to hash...": "ハッシュ化するテキストを入力...",
  "Hash Type": "ハッシュタイプ",
  "Compare Hash": "ハッシュを比較",
  "Compare mode": "比較モード",
  "Enter hash to compare...": "比較するハッシュを入力...",
  "Match": "一致",
  "No match": "不一致",

  // QR Generator
  "QR Generator": "QR生成器",
  "QR code generator that converts text or URLs into QR codes. Generate and download QR codes with various sizes and error recovery levels.": "テキストやURLをQRコードに変換するQRコード生成器。様々なサイズとエラー回復レベルでQRコードを生成してダウンロード。",
  "Data Type": "データタイプ",
  "Text": "テキスト",
  "Text or URL": "テキストまたはURL",
  "URL": "URL",
  "Email": "メール",
  "Phone": "電話",
  "SMS": "SMS",
  "https://example.com": "https://example.com",
  "user@example.com": "user@example.com",
  "+821012345678": "+821012345678",
  "Phone number": "電話番号",
  "Message content": "メッセージ内容",
  "Error correction level": "エラー訂正レベル",
  "Low (7%)": "低 (7%)",
  "Medium (15%)": "中 (15%)",
  "Quartile (25%)": "四分位 (25%)",
  "High (30%)": "高 (30%)",
  "Small damage recovery": "小規模な損傷回復",
  "Medium damage recovery": "中規模な損傷回復",
  "Large damage recovery": "大規模な損傷回復",
  "Maximum damage recovery": "最大限の損傷回復",
  "Foreground": "前景",
  "Background": "背景",
  "Include margin": "余白を含む",
  "Download PNG": "PNGをダウンロード",
  "Download SVG": "SVGをダウンロード",
  "Enter text to\\ngenerate QR code": "QRコードを生成する\\nテキストを入力",
  "Generating...": "生成中...",
  "Please generate a QR code first": "最初にQRコードを生成してください",
  "QR code downloaded successfully": "QRコードを正常にダウンロードしました",
  "QR code copied successfully": "QRコードを正常にコピーしました",

  // WiFi QR
  "WiFi QR": "WiFi QR",
  "Convert WiFi network information into QR codes for easy sharing. Scan the QR code with a smartphone to connect to WiFi automatically.": "WiFiネットワーク情報をQRコードに変換して簡単に共有。スマートフォンでQRコードをスキャンすると自動的にWiFiに接続。",
  "No security": "セキュリティなし",
  "Hidden network": "隠しネットワーク",
  "Enter WiFi Information": "WiFi情報を入力",
  "Generate QR Code": "QRコード生成",
  "Generated QR Code": "生成されたQRコード",
  "Network": "ネットワーク",
  "Security": "セキュリティ",
  "Status": "ステータス",
  "QR Code Size": "QRコードサイズ",
  "Please enter network name": "ネットワーク名を入力してください",
  "Please enter password": "パスワードを入力してください",
  "Password is required for selected security type": "選択したセキュリティタイプにはパスワードが必要です",
  "QR code generated successfully": "QRコードが正常に生成されました",
  "Failed to generate QR code": "QRコードの生成に失敗しました",
  "For security, only share the generated QR code with trusted people": "セキュリティのため、生成されたQRコードは信頼できる人とのみ共有してください"
};

// 일본어 파일 업데이트
function updateJapaneseTranslations() {
  const filePath = join(__dirname, '..', 'i18n', 'locales', 'ja.json');
  let content = readFileSync(filePath, 'utf8');
  let fileContent = content;
  let updateCount = 0;

  // 각 번역 항목에 대해 치환
  for (const [english, japanese] of Object.entries(translations)) {
    // JSON 문자열 내에서 영어 텍스트를 찾아 일본어로 치환
    const regex = new RegExp(`"${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    const newContent = fileContent.replace(regex, `"${japanese}"`);

    if (newContent !== fileContent) {
      fileContent = newContent;
      updateCount++;
      console.log(`✅ "${english}" → "${japanese}"`);
    }
  }

  // 파일 저장
  if (updateCount > 0) {
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`\n✨ ${updateCount}개의 영어 텍스트를 일본어로 번역했습니다!`);
  } else {
    console.log('\n✅ 번역할 항목이 없습니다.');
  }
}

// 실행
updateJapaneseTranslations();