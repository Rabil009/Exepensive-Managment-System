/**
 * Intelligent Receipt Scanner & OCR Extractor
 * Uses Client-Side Tesseract.js (Zero API key required!)
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
  { name: "Starbucks Coffee", category: "MEALS", aliases: ["starbucks", "starbuck"] },
  { name: "Swiss Bakery & Confectionery", category: "MEALS", aliases: ["swiss bakery", "swiss confectionery"] },
  { name: "McDonald's", category: "MEALS", aliases: ["mcdonald", "mcdonalds", "mcd"] },
  { name: "Subway", category: "MEALS", aliases: ["subway"] },
  { name: "Domino's Pizza", category: "MEALS", aliases: ["dominos", "domino's"] },
  { name: "KFC", category: "MEALS", aliases: ["kfc", "kentucky fried chicken"] },
  { name: "Burger King", category: "MEALS", aliases: ["burger king"] },
  { name: "Swiggy", category: "MEALS", aliases: ["swiggy", "bundl technologies"] },
  { name: "Zomato", category: "MEALS", aliases: ["zomato"] },
  { name: "Cafe Coffee Day", category: "MEALS", aliases: ["cafe coffee day", "ccd"] },
  { name: "Uber", category: "TRAVEL", aliases: ["uber", "uber india", "uber bv"] },
  { name: "Ola Cabs", category: "TRAVEL", aliases: ["ola", "ani technologies"] },
  { name: "Delta Air Lines", category: "TRAVEL", aliases: ["delta", "delta air", "delta airlines"] },
  { name: "IndiGo Airlines", category: "TRAVEL", aliases: ["indigo", "interglobe aviation"] },
  { name: "Air India", category: "TRAVEL", aliases: ["air india", "airindia"] },
  { name: "Vistara Airlines", category: "TRAVEL", aliases: ["vistara", "tata sia"] },
  { name: "IRCTC", category: "TRAVEL", aliases: ["irctc", "indian railway"] },
  { name: "Shell Petrol", category: "TRAVEL", aliases: ["shell", "shell petrol", "shell gas"] },
  { name: "HP Petrol", category: "TRAVEL", aliases: ["hpcl", "hindustan petroleum"] },
  { name: "Indian Oil", category: "TRAVEL", aliases: ["indianoil", "ioc", "iocl"] },
  { name: "Amazon", category: "OFFICE", aliases: ["amazon", "amazon commercial", "amazon seller"] },
  { name: "Flipkart", category: "OFFICE", aliases: ["flipkart"] },
  { name: "Croma", category: "HARDWARE", aliases: ["croma", "infiniti retail"] },
  { name: "Reliance Digital", category: "HARDWARE", aliases: ["reliance digital", "reliance retail"] },
  { name: "Apple Store", category: "HARDWARE", aliases: ["apple store", "apple india"] },
  { name: "Amazon Web Services", category: "SOFTWARE", aliases: ["aws", "amazon web services"] },
  { name: "Google Cloud", category: "SOFTWARE", aliases: ["google cloud", "google workspace", "gsuite"] },
  { name: "Microsoft 365", category: "SOFTWARE", aliases: ["microsoft", "msft", "azure", "office 365"] },
  { name: "GitHub", category: "SOFTWARE", aliases: ["github"] },
  { name: "Zoom", category: "SOFTWARE", aliases: ["zoom video", "zoom.us"] },
  { name: "Slack", category: "SOFTWARE", aliases: ["slack technologies"] },
  { name: "JetBrains", category: "SOFTWARE", aliases: ["jetbrains"] },
  { name: "Taj Hotels", category: "HOTEL", aliases: ["taj hotel", "ihcl", "taj gateway"] },
  { name: "Marriott Hotel", category: "HOTEL", aliases: ["marriott", "courtyard by marriott"] },
  { name: "Hyatt Regency", category: "HOTEL", aliases: ["hyatt", "grand hyatt"] },
  { name: "Radisson", category: "HOTEL", aliases: ["radisson", "park plaza"] },
  { name: "The Oberoi", category: "HOTEL", aliases: ["oberoi"] },
  { name: "Oyo Rooms", category: "HOTEL", aliases: ["oyo"] },
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
 * Extract date in ISO format YYYY-MM-DD
 */
function extractDate(text: string): string | undefined {
  // 1. ISO format: 2026-10-12 or 2026/10/12 or 2026.10.12
  const isoMatch = text.match(/\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // 2. Day-Month-Year: 12-10-2026 or 12/10/2026 or 12.10.2026
  const dmyMatch = text.match(/\b(0[1-9]|[12]\d|3[01])[-/.](0[1-9]|1[0-2])[-/.](20\d{2})\b/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  // 3. Textual Month: 24 Jul 2004 or 12 October 2026 or Oct 12, 2026
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const textMonthRegex = /\b(0?[1-9]|[12]\d|3[01])[\s-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]+(20\d{2}|19\d{2})\b/i;
  const tmMatch = text.match(textMonthRegex);
  if (tmMatch) {
    const day = tmMatch[1].padStart(2, "0");
    const mKey = tmMatch[2].slice(0, 3).toLowerCase();
    const month = months[mKey] || "01";
    const year = tmMatch[3];
    return `${year}-${month}-${day}`;
  }

  return undefined;
}

/**
 * Extract total charge amount
 */
function extractAmount(text: string): string | undefined {
  const lines = getLines(text);
  const candidates: number[] = [];

  // Keywords that signal the grand total
  const totalKeywords = [
    "total charged",
    "grand total",
    "net total",
    "net amount",
    "total amount",
    "balance due",
    "final total",
    "total",
    "amount paid",
    "amount",
  ];

  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const kw of totalKeywords) {
      if (lower.includes(kw)) {
        // Extract numbers with optional decimals: ₹ 500.00 or Rs. 1,250.50 or 500
        const matches = line.match(/(?:(?:rs\.?|inr|₹|\$)\s*)?([\d,]+\.?\d{0,2})/gi);
        if (matches) {
          for (const m of matches) {
            const clean = m.replace(/[^0-9.]/g, "");
            const val = parseFloat(clean);
            // Plausible business expense range: ₹1 to ₹10,00,000 (exclude years like 2026, 2024)
            if (val > 0 && val < 1000000 && val !== 2026 && val !== 2025 && val !== 2024) {
              candidates.push(val);
            }
          }
        }
      }
    }
  }

  if (candidates.length > 0) {
    // Return max candidate among total lines (totals are typically highest)
    const best = Math.max(...candidates);
    return best.toFixed(2);
  }

  // Fallback: search anywhere for currency symbols
  const currencyMatch = text.match(/(?:rs\.?|inr|₹|\$)\s*([\d,]+\.?\d{0,2})/gi);
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
function extractMerchant(text: string, filename?: string): { merchant: string; category?: string } | undefined {
  const lower = text.toLowerCase();

  // 1. Match known brands
  for (const km of KNOWN_MERCHANTS) {
    for (const alias of km.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(lower)) {
        return { merchant: km.name, category: km.category };
      }
    }
  }

  // 2. Check filename hint (e.g. "Starbucks_Receipt.jpg", "Uber_Invoice.png")
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
  const lines = getLines(text);
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const line = lines[i];
    const cleaned = line.replace(/[^a-zA-Z0-9\s&'-]/g, "").trim();
    // Exclude header boilerplate like "TAX INVOICE", "RECEIPT", "BILL", "CASH MEMO"
    if (
      cleaned.length >= 3 &&
      cleaned.length <= 40 &&
      !/^(tax|invoice|receipt|official|cash memo|bill|gstin|cin|phone|date|time)/i.test(cleaned)
    ) {
      return { merchant: cleaned };
    }
  }

  return undefined;
}

/**
 * Extract Expense Category
 */
function extractCategory(text: string, merchantCat?: string): string {
  if (merchantCat) return merchantCat;

  const lower = text.toLowerCase();

  if (/(coffee|pastry|bakery|restaurant|food|dining|meal|lunch|dinner|breakfast|burger|pizza|swiggy|zomato|cafe|beverage|snack)/i.test(lower)) {
    return "MEALS";
  }
  if (/(uber|ola|flight|airline|cab|taxi|fuel|petrol|diesel|toll|train|railway|airport|travel|trip)/i.test(lower)) {
    return "TRAVEL";
  }
  if (/(hotel|room|stay|lodge|resort|suites|guest|inn|hospitality)/i.test(lower)) {
    return "HOTEL";
  }
  if (/(software|cloud|aws|saas|subscription|license|github|domain|zoom|slack)/i.test(lower)) {
    return "SOFTWARE";
  }
  if (/(laptop|monitor|screen|keyboard|mouse|hardware|croma|digital|electronics|cable)/i.test(lower)) {
    return "HARDWARE";
  }
  if (/(stationery|paper|print|supplies|office|desk)/i.test(lower)) {
    return "OFFICE";
  }

  return "OTHER";
}

/**
 * Extract Payment Method
 */
function extractPaymentMethod(text: string): string {
  const lower = text.toLowerCase();
  if (/(corporate\s*card|company\s*card|corporate|mastercard|visa|card\s*ending)/i.test(lower)) {
    return "Corporate Card";
  }
  return "Personal (Out-of-Pocket)";
}

/**
 * Main OCR & Scanning function
 * Runs directly in browser via Tesseract.js (NO API KEY REQUIRED)
 */
export async function scanReceiptFile(file: File): Promise<ExtractedReceiptData> {
  // Check if Gemini API Key is available for optional AI Vision enhancement
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
      console.warn("Gemini vision fallback to Tesseract.js:", e);
    }
  }

  // Default: Native Client-Side Tesseract OCR (Zero API Key!)
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(file);
    await worker.terminate();

    const rawText = ret.data.text || "";
    const merchantInfo = extractMerchant(rawText, file.name);
    const amount = extractAmount(rawText);
    const date = extractDate(rawText);
    const category = extractCategory(rawText, merchantInfo?.category);
    const paymentMethod = extractPaymentMethod(rawText);

    const merchant = merchantInfo?.merchant || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

    return {
      merchant,
      amount,
      date,
      category,
      paymentMethod,
      purpose: merchant ? `Business expense at ${merchant}` : "Business Expense",
      confidence: ret.data.confidence,
      rawText,
    };
  } catch (err) {
    console.error("Tesseract.js OCR scan error:", err);
    // Graceful fallback from filename
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    return {
      merchant: nameWithoutExt,
      category: "OTHER",
      purpose: `Expense receipt: ${file.name}`,
    };
  }
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
  "category": "One of: MEALS, TRAVEL, HOTEL, SOFTWARE, HARDWARE, OFFICE, OTHER",
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

