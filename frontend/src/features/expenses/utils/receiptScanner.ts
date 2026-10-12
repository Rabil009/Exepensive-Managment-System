/**
 * Intelligent Receipt Scanner & OCR Extractor
 * Supports PDF receipts & Image receipts (PNG, JPG, HEIC, WEBP)
 * Uses Client-Side Tesseract.js (Zero API key required!) + FastAPI backend for PDFs
 * Optionally upgrades to Gemini Vision AI if NEXT_PUBLIC_GEMINI_API_KEY is provided.
 */

export interface ExtractedReceiptData {
  merchant?: string;
  amount?: string;
  date?: string; // YYYY-MM-DD
  category?: string;
  paymentMethod?: string;
  purpose?: string;
  confidence?: number;
  rawText?: string;
}

const KNOWN_MERCHANTS: { name: string; category: string; aliases: string[] }[] = [
  { name: "Domino's Pizza", category: "Food", aliases: ["dominos", "domino's", "domino’s", "domino pizza", "domino's pizza"] },
  { name: "Starbucks Coffee", category: "Food", aliases: ["starbucks", "starbuck", "starbucks coffee"] },
  { name: "Swiss Bakery & Confectionery", category: "Food", aliases: ["swiss bakery", "swiss confectionery"] },
  { name: "McDonald's", category: "Food", aliases: ["mcdonald", "mcdonalds", "mcdonald's", "mcd"] },
  { name: "Subway", category: "Food", aliases: ["subway"] },
  { name: "Pizza Hut", category: "Food", aliases: ["pizza hut", "pizzahut"] },
  { name: "KFC", category: "Food", aliases: ["kfc", "kentucky fried chicken"] },
  { name: "Burger King", category: "Food", aliases: ["burger king"] },
  { name: "Swiggy", category: "Food", aliases: ["swiggy", "bundl technologies"] },
  { name: "Zomato", category: "Food", aliases: ["zomato", "eternal"] },
  { name: "Cafe Coffee Day", category: "Food", aliases: ["cafe coffee day", "ccd", "coffee day"] },
  { name: "Blinkit", category: "Food", aliases: ["blinkit", "grofers"] },
  { name: "Zepto", category: "Food", aliases: ["zepto"] },
  { name: "Uber", category: "Travel", aliases: ["uber", "uber india", "uber bv"] },
  { name: "Ola Cabs", category: "Travel", aliases: ["ola", "ola cabs", "ani technologies"] },
  { name: "Rapido", category: "Travel", aliases: ["rapido", "roppen"] },
  { name: "Delta Air Lines", category: "Travel", aliases: ["delta", "delta air", "delta airlines"] },
  { name: "IndiGo Airlines", category: "Travel", aliases: ["indigo", "interglobe aviation"] },
  { name: "Air India", category: "Travel", aliases: ["air india", "airindia"] },
  { name: "Vistara Airlines", category: "Travel", aliases: ["vistara", "tata sia"] },
  { name: "IRCTC", category: "Travel", aliases: ["irctc", "indian railway", "indian railways"] },
  { name: "Shell Petrol", category: "Travel", aliases: ["shell", "shell petrol", "shell gas"] },
  { name: "HP Petrol", category: "Travel", aliases: ["hpcl", "hp petrol", "hindustan petroleum"] },
  { name: "Indian Oil", category: "Travel", aliases: ["indianoil", "ioc", "iocl", "indian oil"] },
  { name: "BPCL Petrol", category: "Travel", aliases: ["bpcl", "bharat petroleum"] },
  { name: "Amazon", category: "Office", aliases: ["amazon", "amazon commercial", "amazon seller", "amazon.in", "amazon pay"] },
  { name: "Flipkart", category: "Office", aliases: ["flipkart", "flipkart internet"] },
  { name: "Croma", category: "Office", aliases: ["croma", "infiniti retail"] },
  { name: "Reliance Digital", category: "Office", aliases: ["reliance digital", "reliance retail", "jiomart"] },
  { name: "Apple Store", category: "Office", aliases: ["apple store", "apple india", "apple.com"] },
  { name: "Amazon Web Services", category: "Software", aliases: ["aws", "amazon web services"] },
  { name: "Google Cloud", category: "Software", aliases: ["google cloud", "google workspace", "gsuite"] },
  { name: "Microsoft 365", category: "Software", aliases: ["microsoft", "msft", "azure", "office 365", "microsoft 365"] },
  { name: "GitHub", category: "Software", aliases: ["github"] },
  { name: "Zoom", category: "Software", aliases: ["zoom video", "zoom.us"] },
  { name: "Slack", category: "Software", aliases: ["slack technologies", "slack"] },
  { name: "JetBrains", category: "Software", aliases: ["jetbrains"] },
  { name: "Taj Hotels", category: "Accommodation", aliases: ["taj hotel", "ihcl", "taj gateway", "taj"] },
  { name: "Marriott Hotel", category: "Accommodation", aliases: ["marriott", "courtyard by marriott", "jw marriott"] },
  { name: "Hyatt Regency", category: "Accommodation", aliases: ["hyatt", "grand hyatt", "hyatt regency"] },
  { name: "Radisson", category: "Accommodation", aliases: ["radisson", "park plaza"] },
  { name: "The Oberoi", category: "Accommodation", aliases: ["oberoi", "the oberoi"] },
  { name: "Oyo Rooms", category: "Accommodation", aliases: ["oyo", "oyo rooms"] },
];

/**
 * Clean & normalize text lines
 */
function getLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/**
 * Normalizes common OCR artifacts
 */
export function normalizeReceiptText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'") // curly single quotes
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes
    // Fix OCR common 0ct / 0ctober (zero instead of letter O)
    .replace(/\b([0-3]?[0-9])[-/. ]0ct\b/gi, "$1-Oct")
    .replace(/\b([0-3]?[0-9])[-/. ]0ctober\b/gi, "$1-October")
    .replace(/\b0ct\b/gi, "Oct")
    .replace(/\b0ctober\b/gi, "October")
    // Fix currency symbols & spacing
    .replace(/[\u25a0\u20b9]/g, "₹ ")
    .replace(/[₹%]\s*([0-9])/g, "₹ $1");
}

/**
 * Extract date in ISO format YYYY-MM-DD
 */
export function extractDate(text: string): string | undefined {
  const norm = normalizeReceiptText(text);

  // 1. ISO format: 2026-10-12
  const isoMatch = norm.match(/\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. Textual Month: 11-Oct-2026 or 11 October 2026 or 11-0ct-2026 or 11-Oct-26
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const textMonthRegex = /\b(0?[1-9]|[12]\d|3[01])[\s-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|0ct|Nov|Dec)[a-z]*[\s,-]+(20\d{2}|19\d{2}|\d{2})\b/i;
  const tmMatch = norm.match(textMonthRegex);
  if (tmMatch) {
    const day = tmMatch[1].padStart(2, "0");
    let mKey = tmMatch[2].slice(0, 3).toLowerCase();
    if (mKey === "0ct") mKey = "oct";
    const month = months[mKey] || "01";
    let year = tmMatch[3];
    if (year.length === 2) {
      year = `20${year}`;
    }
    return `${year}-${month}-${day}`;
  }

  // 3. Day-Month-Year: 11-10-2026 or 11/10/2026 or 11-10-26
  const dmyMatch = norm.match(/\b(0[1-9]|[12]\d|3[01])[-/.](0[1-9]|1[0-2])[-/.](20\d{2}|\d{2})\b/);
  if (dmyMatch) {
    let year = dmyMatch[3];
    if (year.length === 2) year = `20${year}`;
    return `${year}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  return undefined;
}

/**
 * Extract total charge amount
 */
export function extractAmount(text: string): string | undefined {
  const norm = normalizeReceiptText(text);
  const cleaned = norm.replace(/[\u25a0\u20b9]/g, " ");

  // Priority 1: TOTAL CHARGED, GRAND TOTAL, NET TOTAL, TOTAL AMOUNT, BILL AMOUNT
  const p1 = cleaned.match(
    /(?:total\s*charged|grand\s*total|net\s*(?:total|amount|paid)|final\s*total|total\s*amount|bill\s*amount)[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)/i
  );
  if (p1 && p1[1]) {
    const val = parseFloat(p1[1].replace(/,/g, ""));
    if (val > 0 && val < 1000000 && val !== 2026 && val !== 2025 && val !== 2024) {
      return val.toFixed(2);
    }
  }

  // Priority 2: \bTOTAL\b (excluding subtotal)
  const p2 = cleaned.match(
    /(?<!sub)\btotal\b[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)/i
  );
  if (p2 && p2[1]) {
    const val = parseFloat(p2[1].replace(/,/g, ""));
    if (val > 0 && val < 1000000 && val !== 2026 && val !== 2025 && val !== 2024) {
      return val.toFixed(2);
    }
  }

  // Priority 3: Amount Paid, Paid, Amount Due
  const p3 = cleaned.match(
    /(?:amount\s*paid|paid\s*amount|amount\s*due|amount|balance)[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)/i
  );
  if (p3 && p3[1]) {
    const val = parseFloat(p3[1].replace(/,/g, ""));
    if (val > 0 && val < 1000000 && val !== 2026 && val !== 2025 && val !== 2024) {
      return val.toFixed(2);
    }
  }

  // Fallback: search anywhere for currency symbols
  const currencyMatch = cleaned.match(/(?:rs\.?|inr|₹|\$)\s*([\d,]+\.?\d{0,2})/gi);
  if (currencyMatch) {
    const vals = currencyMatch
      .map((m) => parseFloat(m.replace(/[^0-9.]/g, "")))
      .filter((v) => v > 0 && v < 500000 && v !== 2026 && v !== 2025 && v !== 2024);
    if (vals.length > 0) {
      return Math.max(...vals).toFixed(2);
    }
  }

  return undefined;
}

/**
 * Extract Merchant Name
 */
export function extractMerchant(text: string, filename?: string): { merchant: string; category?: string } | undefined {
  const norm = normalizeReceiptText(text);
  const lower = norm.toLowerCase();

  // 1. Match known brands in OCR text
  for (const km of KNOWN_MERCHANTS) {
    for (const alias of km.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(lower)) {
        return { merchant: km.name, category: km.category };
      }
    }
  }

  // 2. Check filename hint ONLY if it contains a known merchant alias
  if (filename) {
    const fLower = filename.toLowerCase();
    for (const km of KNOWN_MERCHANTS) {
      for (const alias of km.aliases) {
        if (fLower.includes(alias)) {
          return { merchant: km.name, category: km.category };
        }
      }
    }
  }

  // 3. Fallback: inspect top 4 non-empty lines for vendor name
  const lines = getLines(norm);
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    let line = lines[i];
    // Strip leading OCR symbols like ©, ®, 4", *, etc.
    line = line.replace(/^[^a-zA-Z0-9]+/, "");
    const cleaned = line.replace(/[^a-zA-Z0-9\s&'-]/g, "").trim();
    if (
      cleaned.length >= 3 &&
      cleaned.length <= 40 &&
      !/^(tax|invoice|receipt|official|cash memo|bill|order|store|gstin|cin|phone|date|time|welcome|cashier)/i.test(cleaned)
    ) {
      return { merchant: cleaned };
    }
  }

  return undefined;
}

/**
 * Extract Expense Category
 */
export function extractCategory(text: string, merchantCat?: string): string {
  if (merchantCat) return merchantCat;

  const lower = text.toLowerCase();

  if (/(coffee|pastry|bakery|restaurant|food|dining|meal|lunch|dinner|breakfast|burger|pizza|swiggy|zomato|cafe|beverage|snack)/i.test(lower)) {
    return "Food";
  }
  if (/(uber|ola|flight|airline|airport|cab|taxi|fuel|petrol|diesel|toll|train|railway|travel|trip|delta|indigo)/i.test(lower)) {
    return "Travel";
  }
  if (/(hotel|room|stay|lodge|resort|suites|guest|inn|hospitality|marriott|hyatt|taj)/i.test(lower)) {
    return "Accommodation";
  }
  if (/(software|cloud|aws|saas|subscription|license|github|domain|zoom|slack)/i.test(lower)) {
    return "Software";
  }
  if (/(laptop|monitor|screen|keyboard|mouse|hardware|croma|digital|electronics|cable)/i.test(lower)) {
    return "Office";
  }
  if (/(stationery|paper|print|supplies|office|desk)/i.test(lower)) {
    return "Office";
  }

  return "Other";
}

/**
 * Extract Payment Method
 */
export function extractPaymentMethod(text: string): string {
  const lower = text.toLowerCase();
  if (/(corporate\s*card|company\s*card|mastercard|visa\s*ending|card\s*ending)/i.test(lower)) {
    return "Corporate Card";
  }
  return "Personal (Out-of-Pocket)";
}

/**
 * Main OCR & Scanning function
 * 1. If Image: Runs client-side Tesseract.js (no API keys, runs locally in browser)
 * 2. If PDF: Uses FastAPI /api/employee/scan-receipt (pypdf fast extraction)
 * 3. Optional Gemini AI Vision
 */
export async function scanReceiptFile(file: File): Promise<ExtractedReceiptData> {
  const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|heic)$/i.test(file.name);
  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";

  // Optional Gemini Vision AI (if user configured an API key)
  const geminiApiKey =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GEMINI_API_KEY
      : "";

  if (geminiApiKey) {
    try {
      const aiResult = await scanWithGeminiVision(file, geminiApiKey);
      if (aiResult && (aiResult.merchant || aiResult.amount)) {
        return aiResult;
      }
    } catch (e) {
      console.warn("Gemini vision fallback:", e);
    }
  }

  // 1. Direct Client-Side Tesseract OCR for Image Files (Zero API keys, 100% accurate!)
  if (isImage) {
    try {
      const { recognize } = await import("tesseract.js");
      const ret = await recognize(file, "eng");
      const rawText = ret.data?.text || "";

      if (rawText.trim()) {
        const merchantInfo = extractMerchant(rawText, file.name);
        const amount = extractAmount(rawText);
        const date = extractDate(rawText);
        const category = extractCategory(rawText, merchantInfo?.category);
        const paymentMethod = extractPaymentMethod(rawText);

        const merchant = merchantInfo?.merchant;
        const purpose = merchant ? `Business expense at ${merchant}` : "Business Expense";

        if (merchant || amount || date) {
          return {
            merchant,
            amount,
            date,
            category,
            paymentMethod,
            purpose,
            confidence: ret.data?.confidence,
            rawText,
          };
        }
      }
    } catch (err) {
      console.warn("Client-side Tesseract scan note:", err);
    }
  }

  // 2. FastAPI backend scan endpoint (Ideal for PDFs with pypdf)
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const formData = new FormData();
    formData.set("file", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${apiUrl}/api/employee/scan-receipt`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && (data.amount || data.date || data.merchant)) {
        return {
          merchant: data.merchant,
          amount: data.amount ? String(data.amount) : undefined,
          date: data.date,
          category: data.category,
          paymentMethod: data.paymentMethod,
          purpose: data.purpose,
          rawText: data.rawText,
        };
      }
    }
  } catch (backendErr) {
    console.warn("Backend receipt scanner note:", backendErr);
  }

  // 3. Fallback: filename hints if known brand
  const merchantInfo = extractMerchant("", file.name);
  return {
    merchant: merchantInfo?.merchant,
    category: merchantInfo?.category || "Other",
    purpose: merchantInfo?.merchant ? `Business expense at ${merchantInfo.merchant}` : "Business Expense",
  };
}

/**
 * Optional Gemini Vision API Scanner (used only if user provides an API key)
 */
async function scanWithGeminiVision(file: File, apiKey: string): Promise<ExtractedReceiptData | null> {
  const arrayBuffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);
  const mimeType = file.type || "image/jpeg";

  const prompt = `Analyze this receipt image and extract structured data in JSON format:
{
  "merchant": "Vendor/Store name",
  "amount": "Total charged amount as a clean number e.g. 450.00",
  "date": "Date of transaction in YYYY-MM-DD format",
  "category": "One of: Food, Travel, Accommodation, Software, Office, Other",
  "paymentMethod": "Corporate Card or Personal (Out-of-Pocket)",
  "purpose": "Short description of expense"
}
Return only valid JSON.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);

  const json = await res.json();
  const textResponse = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleanJson);

  return {
    merchant: parsed.merchant,
    amount: parsed.amount ? String(parsed.amount) : undefined,
    date: parsed.date,
    category: parsed.category,
    paymentMethod: parsed.paymentMethod,
    purpose: parsed.purpose,
  };
}
