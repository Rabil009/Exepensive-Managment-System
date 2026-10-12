"""Receipt Scanner API Endpoint
Parses PDF & image receipts using pypdf and intelligent text extraction.
"""

import io
import re
import logging
from typing import Annotated
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/employee", tags=["employee-receipt-scanner"])

KNOWN_MERCHANTS = [
    {"name": "Starbucks Coffee", "category": "MEALS", "aliases": ["starbucks", "starbuck"]},
    {"name": "Swiss Bakery & Confectionery", "category": "MEALS", "aliases": ["swiss bakery", "swiss confectionery"]},
    {"name": "McDonald's", "category": "MEALS", "aliases": ["mcdonald", "mcdonalds", "mcd"]},
    {"name": "Subway", "category": "MEALS", "aliases": ["subway"]},
    {"name": "Domino's Pizza", "category": "MEALS", "aliases": ["dominos", "domino's"]},
    {"name": "KFC", "category": "MEALS", "aliases": ["kfc", "kentucky fried chicken"]},
    {"name": "Burger King", "category": "MEALS", "aliases": ["burger king"]},
    {"name": "Swiggy", "category": "MEALS", "aliases": ["swiggy", "bundl technologies"]},
    {"name": "Zomato", "category": "MEALS", "aliases": ["zomato"]},
    {"name": "Cafe Coffee Day", "category": "MEALS", "aliases": ["cafe coffee day", "ccd"]},
    {"name": "Uber", "category": "TRAVEL", "aliases": ["uber", "uber india", "uber bv"]},
    {"name": "Ola Cabs", "category": "TRAVEL", "aliases": ["ola", "ani technologies"]},
    {"name": "Delta Air Lines", "category": "TRAVEL", "aliases": ["delta", "delta air", "delta airlines"]},
    {"name": "IndiGo Airlines", "category": "TRAVEL", "aliases": ["indigo", "interglobe aviation"]},
    {"name": "Air India", "category": "TRAVEL", "aliases": ["air india", "airindia"]},
    {"name": "Vistara Airlines", "category": "TRAVEL", "aliases": ["vistara", "tata sia"]},
    {"name": "IRCTC", "category": "TRAVEL", "aliases": ["irctc", "indian railway"]},
    {"name": "Shell Petrol", "category": "TRAVEL", "aliases": ["shell", "shell petrol", "shell gas"]},
    {"name": "HP Petrol", "category": "TRAVEL", "aliases": ["hpcl", "hindustan petroleum"]},
    {"name": "Indian Oil", "category": "TRAVEL", "aliases": ["indianoil", "ioc", "iocl"]},
    {"name": "Amazon", "category": "OFFICE", "aliases": ["amazon", "amazon commercial", "amazon seller"]},
    {"name": "Flipkart", "category": "OFFICE", "aliases": ["flipkart"]},
    {"name": "Croma", "category": "HARDWARE", "aliases": ["croma", "infiniti retail"]},
    {"name": "Reliance Digital", "category": "HARDWARE", "aliases": ["reliance digital", "reliance retail"]},
    {"name": "Apple Store", "category": "HARDWARE", "aliases": ["apple store", "apple india"]},
    {"name": "Amazon Web Services", "category": "SOFTWARE", "aliases": ["aws", "amazon web services"]},
    {"name": "Google Cloud", "category": "SOFTWARE", "aliases": ["google cloud", "google workspace", "gsuite"]},
    {"name": "Microsoft 365", "category": "SOFTWARE", "aliases": ["microsoft", "msft", "azure", "office 365"]},
    {"name": "GitHub", "category": "SOFTWARE", "aliases": ["github"]},
    {"name": "Zoom", "category": "SOFTWARE", "aliases": ["zoom video", "zoom.us"]},
    {"name": "Slack", "category": "SOFTWARE", "aliases": ["slack technologies"]},
    {"name": "JetBrains", "category": "SOFTWARE", "aliases": ["jetbrains"]},
    {"name": "Taj Hotels", "category": "HOTEL", "aliases": ["taj hotel", "ihcl", "taj gateway"]},
    {"name": "Marriott Hotel", "category": "HOTEL", "aliases": ["marriott", "courtyard by marriott"]},
    {"name": "Hyatt Regency", "category": "HOTEL", "aliases": ["hyatt", "grand hyatt"]},
    {"name": "Radisson", "category": "HOTEL", "aliases": ["radisson", "park plaza"]},
    {"name": "The Oberoi", "category": "HOTEL", "aliases": ["oberoi"]},
    {"name": "Oyo Rooms", "category": "HOTEL", "aliases": ["oyo"]},
]

MONTHS = {
    "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
    "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12",
}

def extract_date(text: str) -> str | None:
    # 1. ISO format: 2026-10-12
    iso_match = re.search(r"\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b", text)
    if iso_match:
        return f"{iso_match.group(1)}-{iso_match.group(2)}-{iso_match.group(3)}"

    # 2. Textual month: 12-Oct-2026 or 12 October 2026
    tm_match = re.search(r"\b(0?[1-9]|[12]\d|3[01])[\s-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]+(20\d{2}|19\d{2})\b", text, re.I)
    if tm_match:
        d = tm_match.group(1).zfill(2)
        m = MONTHS.get(tm_match.group(2).lower()[:3], "01")
        y = tm_match.group(3)
        return f"{y}-{m}-{d}"

    # 3. Day-Month-Year: 12-10-2026
    dmy_match = re.search(r"\b(0[1-9]|[12]\d|3[01])[-/.](0[1-9]|1[0-2])[-/.](20\d{2})\b", text)
    if dmy_match:
        return f"{dmy_match.group(3)}-{dmy_match.group(2)}-{dmy_match.group(1)}"

    return None

def extract_amount(text: str) -> str | None:
    cleaned = re.sub(r"[\u25a0\u20b9]", " ", text)

    # Priority 1: TOTAL CHARGED, GRAND TOTAL, NET TOTAL
    p1 = re.search(
        r"(?:total\s*charged|grand\s*total|net\s*(?:total|amount|paid)|final\s*total)[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)",
        cleaned,
        re.I,
    )
    if p1:
        val = p1.group(1).replace(",", "")
        return f"{float(val):.2f}"

    # Priority 2: \bTOTAL\b (exclude subtotal)
    p2 = re.search(
        r"(?<!sub)\btotal\b[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)",
        cleaned,
        re.I,
    )
    if p2:
        val = p2.group(1).replace(",", "")
        return f"{float(val):.2f}"

    # Priority 3: Any amount or balance due
    p3 = re.search(
        r"(?:amount\s*due|amount|balance)[\s:=-]*[\r\n\s]*(?:rs\.?|inr|₹|\$)?[\s]*([\d,]+(?:\.\d{1,2})?)",
        cleaned,
        re.I,
    )
    if p3:
        val = p3.group(1).replace(",", "")
        return f"{float(val):.2f}"

    return None

def extract_merchant(text: str, filename: str = "") -> tuple[str, str | None]:
    lower = text.lower()
    for km in KNOWN_MERCHANTS:
        for alias in km["aliases"]:
            if re.search(rf"\b{re.escape(alias)}\b", lower, re.I):
                return km["name"], km["category"]

    if filename:
        f_lower = filename.lower()
        for km in KNOWN_MERCHANTS:
            for alias in km["aliases"]:
                if alias in f_lower:
                    return km["name"], km["category"]

    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for line in lines[:4]:
        clean = re.sub(r"[^a-zA-Z0-9\s&'-]", "", line).strip()
        if (
            len(clean) >= 3
            and len(clean) <= 40
            and not re.search(r"^(tax|invoice|receipt|official|cash memo|bill|gstin|cin|phone|date|time)", clean, re.I)
        ):
            return clean, None

    return filename.rsplit(".", 1)[0].replace("_", " ").title() if filename else "Business Vendor", None

def extract_category(text: str, merchant_cat: str | None = None) -> str:
    if merchant_cat:
        return merchant_cat
    lower = text.lower()
    if re.search(r"(coffee|pastry|bakery|restaurant|food|dining|meal|lunch|dinner|breakfast|burger|pizza|swiggy|zomato|cafe|beverage|snack)", lower):
        return "MEALS"
    if re.search(r"(uber|ola|flight|airline|airport|cab|taxi|fuel|petrol|diesel|toll|train|railway|travel|trip|delta|indigo)", lower):
        return "TRAVEL"
    if re.search(r"(hotel|room|stay|lodge|resort|suites|guest|inn|hospitality|marriott|hyatt|taj)", lower):
        return "HOTEL"
    if re.search(r"(software|cloud|aws|saas|subscription|license|github|domain|zoom|slack)", lower):
        return "SOFTWARE"
    if re.search(r"(laptop|monitor|screen|keyboard|mouse|hardware|croma|digital|electronics|cable)", lower):
        return "HARDWARE"
    if re.search(r"(stationery|paper|print|supplies|office|desk)", lower):
        return "OFFICE"
    return "OTHER"

def extract_payment_method(text: str) -> str:
    if re.search(r"(corporate\s*card|company\s*card|corporate|mastercard|visa|card\s*ending)", text, re.I):
        return "Corporate Card"
    return "Personal (Out-of-Pocket)"


@router.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    """Extract structured expense information from an uploaded PDF or image receipt."""
    filename = file.filename or "receipt"
    content = await file.read()

    raw_text = ""
    is_pdf = filename.lower().endswith(".pdf") or (file.content_type == "application/pdf")

    if is_pdf:
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            page_texts = []
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    page_texts.append(t)
            raw_text = "\n".join(page_texts)
        except Exception as e:
            logger.warning(f"pypdf extraction failed: {e}")

    # Fallback to OCR if text is empty or image
    if not raw_text.strip():
        try:
            import pytesseract
            from PIL import Image
            img = Image.open(io.BytesIO(content))
            raw_text = pytesseract.image_to_string(img)
        except Exception as e:
            logger.warning(f"pytesseract extraction note: {e}")

    # Fallback to string extraction if still empty
    if not raw_text.strip():
        # Clean latin1/utf-8 strings
        clean_strs = re.findall(rb"[\x20-\x7e\n]{4,}", content)
        raw_text = "\n".join([s.decode("utf-8", errors="ignore") for s in clean_strs])

    merchant, m_cat = extract_merchant(raw_text, filename)
    amount = extract_amount(raw_text)
    date = extract_date(raw_text)
    category = extract_category(raw_text, m_cat)
    payment_method = extract_payment_method(raw_text)
    purpose = f"Business expense at {merchant}" if merchant else "Business Expense"

    return {
        "success": True,
        "filename": filename,
        "merchant": merchant,
        "amount": amount,
        "date": date,
        "category": category,
        "paymentMethod": payment_method,
        "purpose": purpose,
        "rawText": raw_text[:1000],
    }

