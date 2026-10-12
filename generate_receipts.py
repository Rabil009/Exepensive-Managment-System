import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import fitz  # PyMuPDF to convert PDF pages to high-res PNG images

output_dir = os.path.abspath("sample_receipts")
os.makedirs(output_dir, exist_ok=True)
public_dir = os.path.abspath("frontend/public/sample-receipts")
os.makedirs(public_dir, exist_ok=True)

class ReceiptPDF(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        # Decorative top header bar
        self.set_fill_color(24, 24, 27)  # Dark slate
        self.rect(0, 0, 210, 8, 'F')

    def footer(self):
        self.set_y(-18)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 5, "This is a computer-generated tax invoice and requires no physical signature.", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.cell(0, 5, "FinPulse Enterprise Expense Treasury Vault - Verified & Compliant", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def build_receipt(filename_base, header_info, bill_to, items, totals):
    pdf = ReceiptPDF()
    pdf.add_page()

    # Company Branding & Header
    pdf.set_y(15)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(24, 24, 27)
    pdf.cell(110, 8, header_info["company_name"], new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)  # Emerald green badge
    pdf.cell(80, 8, "ORIGINAL TAX INVOICE", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(90, 90, 90)
    pdf.cell(110, 4.5, header_info["company_address"], new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(80, 4.5, f"Invoice #: {header_info['invoice_no']}", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(90, 90, 90)
    pdf.cell(110, 4.5, f"GSTIN: {header_info['gstin']} | PAN: {header_info.get('pan', 'N/A')}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.cell(80, 4.5, f"Invoice Date: {header_info['date']}", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.cell(110, 4.5, f"CIN: {header_info.get('cin', 'U72200KA2021PTC145678')}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(80, 4.5, f"Payment Mode: {header_info.get('payment_mode', 'Corporate Card')}", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(4)
    pdf.set_draw_color(220, 220, 225)
    pdf.set_line_width(0.4)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Billed To Section
    pdf.set_fill_color(248, 250, 252)
    pdf.rect(10, pdf.get_y(), 190, 22, 'F')
    start_y = pdf.get_y() + 2

    pdf.set_xy(14, start_y)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(90, 4, "BILLED TO / EMPLOYEE:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_x(14)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(90, 5, bill_to["employee_name"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_x(14)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(90, 4, f"{bill_to.get('designation', 'Senior Staff')} - {bill_to['department']}", new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_xy(115, start_y)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(80, 4, "COMPANY & GSTIN:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_x(115)
    pdf.set_font("Helvetica", "B", 9.5)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(80, 5, bill_to.get("company", "FinPulse Global Technologies Pvt Ltd"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_x(115)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(80, 4, f"GSTIN: 29AABCU9603R1ZM | State: {bill_to.get('state', 'Karnataka (29)')}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_y(start_y + 24)

    # Table Header
    pdf.set_fill_color(241, 245, 249)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(30, 41, 59)

    col_w = [10, 85, 25, 25, 18, 27]  # Total = 190
    pdf.cell(col_w[0], 7, "#", border="B", align="C", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[1], 7, "Item & Description", border="B", align="L", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[2], 7, "HSN / SAC", border="B", align="C", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[3], 7, "Rate (INR)", border="B", align="R", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[4], 7, "Qty", border="B", align="C", fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(col_w[5], 7, "Amount (INR)", border="B", align="R", fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Table Rows
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(30, 30, 30)
    for idx, item in enumerate(items, 1):
        bg = (idx % 2 == 0)
        if bg:
            pdf.set_fill_color(250, 250, 252)
        else:
            pdf.set_fill_color(255, 255, 255)

        pdf.cell(col_w[0], 6.5, str(idx), border="B", align="C", fill=bg, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[1], 6.5, item["desc"], border="B", align="L", fill=bg, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[2], 6.5, item.get("sac", "998313"), border="B", align="C", fill=bg, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[3], 6.5, f"{item['rate']:,.2f}", border="B", align="R", fill=bg, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[4], 6.5, str(item["qty"]), border="B", align="C", fill=bg, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(col_w[5], 6.5, f"{item['amount']:,.2f}", border="B", align="R", fill=bg, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(3)

    # Totals Section
    totals_start_y = pdf.get_y()

    # Left Notes / Verification Box
    pdf.set_xy(10, totals_start_y)
    pdf.set_fill_color(240, 253, 244)  # Light emerald
    pdf.rect(10, totals_start_y, 105, 34, 'F')
    pdf.set_draw_color(187, 247, 208)
    pdf.rect(10, totals_start_y, 105, 34, 'D')

    pdf.set_xy(14, totals_start_y + 3)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(22, 101, 52)
    pdf.cell(95, 4, "[VERIFIED] PAID IN FULL - TRANSACTION SUCCESSFUL", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_x(14)
    pdf.set_font("Helvetica", "", 7.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(95, 3.8, f"Card Auth Code: {header_info.get('auth_code', 'AUTH-892147')} | RRN: 42918802914", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_x(14)
    pdf.cell(95, 3.8, f"Transaction Ref: {header_info.get('txn_id', 'TXN-99882241')}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_x(14)
    pdf.cell(95, 3.8, f"Category Tag: {header_info.get('category', 'Cloud & Hosting')}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_x(14)
    pdf.set_font("Helvetica", "I", 7.5)
    pdf.set_text_color(22, 101, 52)
    pdf.cell(95, 4, "Digital Tax Receipt generated for official reimbursement.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Right Totals Breakdown
    pdf.set_xy(125, totals_start_y)
    right_labels_w = 40
    right_val_w = 35

    def add_total_line(label, val, is_bold=False, is_green=False):
        pdf.set_x(125)
        pdf.set_font("Helvetica", "B" if is_bold else "", 9 if not is_bold else 11)
        if is_green:
            pdf.set_text_color(16, 185, 129)
        else:
            pdf.set_text_color(30, 30, 30)
        pdf.cell(right_labels_w, 5.5, label, align="L", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(right_val_w, 5.5, val, align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    add_total_line("Subtotal (Taxable):", f"INR {totals['subtotal']:,.2f}")
    if totals.get("cgst"):
        add_total_line("CGST (9.0%):", f"INR {totals['cgst']:,.2f}")
        add_total_line("SGST (9.0%):", f"INR {totals['sgst']:,.2f}")
    elif totals.get("igst"):
        add_total_line("IGST (18.0%):", f"INR {totals['igst']:,.2f}")

    if totals.get("discount"):
        add_total_line("Discount Applied:", f"-INR {totals['discount']:,.2f}")

    pdf.set_x(125)
    pdf.set_draw_color(200, 200, 200)
    pdf.line(125, pdf.get_y() + 1, 200, pdf.get_y() + 1)
    pdf.ln(2)

    add_total_line("Total Paid (INR):", f"INR {totals['grand_total']:,.2f}", is_bold=True, is_green=True)

    # Save PDF
    pdf_path = os.path.join(output_dir, f"{filename_base}.pdf")
    pdf.output(pdf_path)

    # Also copy to frontend public directory
    public_pdf_path = os.path.join(public_dir, f"{filename_base}.pdf")
    pdf.output(public_pdf_path)

    # Generate high-resolution matching PNG image using PyMuPDF
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    pix = page.get_pixmap(dpi=200)  # High resolution 200 DPI

    png_path = os.path.join(output_dir, f"{filename_base}.png")
    pix.save(png_path)

    public_png_path = os.path.join(public_dir, f"{filename_base}.png")
    pix.save(public_png_path)

    print(f"Generated: {filename_base}.pdf & {filename_base}.png")

# 1. AWS Cloud Services Invoice (INR 48,500)
build_receipt(
    filename_base="1_aws_cloud_invoice",
    header_info={
        "company_name": "Amazon Web Services India Pvt Ltd",
        "company_address": "8th Floor, Brigade World Trade Centre, Dr. Rajkumar Road, Bangalore - 560055",
        "gstin": "29AAACA6433F1Z1",
        "pan": "AAACA6433F",
        "invoice_no": "INV-AWS-2026-10-8472",
        "date": "2026-10-08",
        "payment_mode": "Corporate Visa (**** 9999)",
        "auth_code": "AUTH-771928",
        "txn_id": "TXN-AWS-8830129",
        "category": "Software & Cloud Services"
    },
    bill_to={
        "employee_name": "Raja",
        "department": "Engineering & DevOps",
        "designation": "Staff Infrastructure Engineer",
        "company": "FinPulse Systems Pvt Ltd",
        "state": "Karnataka (29)"
    },
    items=[
        {"desc": "Amazon Elastic Compute Cloud (EC2) - c6g.2xlarge Compute", "sac": "998315", "rate": 22000.00, "qty": 1, "amount": 22000.00},
        {"desc": "Amazon Relational Database (RDS PostgreSQL Multi-AZ)", "sac": "998315", "rate": 11500.00, "qty": 1, "amount": 11500.00},
        {"desc": "Amazon Simple Storage Service (S3) & CloudFront CDN", "sac": "998315", "rate": 4500.00, "qty": 1, "amount": 4500.00},
        {"desc": "AWS Premium Business Support Plan & GuardDuty Security", "sac": "998315", "rate": 3101.69, "qty": 1, "amount": 3101.69},
    ],
    totals={
        "subtotal": 41101.69,
        "cgst": 3699.15,
        "sgst": 3699.15,
        "grand_total": 48500.00
    }
)

# 2. Taj Palace Business Hotel Stay (INR 14,250)
build_receipt(
    filename_base="2_taj_hotel_invoice",
    header_info={
        "company_name": "The Indian Hotels Company Limited (Taj Palace)",
        "company_address": "Sardar Patel Marg, Diplomatic Enclave, New Delhi - 110021",
        "gstin": "07AAACT1711P1ZL",
        "pan": "AAACT1711P",
        "invoice_no": "TAJ-DEL-2026-9931",
        "date": "2026-10-09",
        "payment_mode": "Corporate Card (**** 9999)",
        "auth_code": "AUTH-402918",
        "txn_id": "TXN-TAJ-490219",
        "category": "Hotel & Accommodation"
    },
    bill_to={
        "employee_name": "Theju",
        "department": "Treasury & Finance",
        "designation": "Associate Director",
        "company": "FinPulse Systems Pvt Ltd",
        "state": "Delhi (07)"
    },
    items=[
        {"desc": "Superior Deluxe Room - Executive Corporate Rate (2 Nights)", "sac": "996311", "rate": 5500.00, "qty": 2, "amount": 11000.00},
        {"desc": "Executive Club Lounge Access & High-Speed Conference Wi-Fi", "sac": "996311", "rate": 1076.27, "qty": 1, "amount": 1076.27},
    ],
    totals={
        "subtotal": 12076.27,
        "cgst": 1086.86,
        "sgst": 1086.86,
        "grand_total": 14250.00
    }
)

# 3. Vistara / Air India Flight Ticket (INR 9,850)
build_receipt(
    filename_base="3_vistara_flight_receipt",
    header_info={
        "company_name": "Tata SIA Airlines Limited (Vistara / Air India)",
        "company_address": "Terminal 3, Indira Gandhi International Airport, New Delhi - 110037",
        "gstin": "07AABCT2319K1ZM",
        "pan": "AABCT2319K",
        "invoice_no": "UK-TKT-2026-44019",
        "date": "2026-10-10",
        "payment_mode": "Personal Card (Out-of-Pocket)",
        "auth_code": "AUTH-918204",
        "txn_id": "PNR-W8R92K",
        "category": "Airfare & Travel"
    },
    bill_to={
        "employee_name": "Theju",
        "department": "Engineering & Technology",
        "designation": "Senior Engineer",
        "company": "FinPulse Systems Pvt Ltd",
        "state": "Karnataka (29)"
    },
    items=[
        {"desc": "Air Passenger Ticket (DEL -> BLR) Premium Economy - Flight UK-817", "sac": "996411", "rate": 7800.00, "qty": 1, "amount": 7800.00},
        {"desc": "Fuel Charge & Aviation Security Surcharge (ASF)", "sac": "996411", "rate": 547.46, "qty": 1, "amount": 547.46},
    ],
    totals={
        "subtotal": 8347.46,
        "igst": 1502.54,
        "grand_total": 9850.00
    }
)

# 4. ITC Grand Team Dinner (INR 3,450)
build_receipt(
    filename_base="4_itc_team_dinner_receipt",
    header_info={
        "company_name": "ITC Hotels Limited - Grand Food & Beverage",
        "company_address": "ITC Gardenia, 1 Residency Road, Bangalore - 560025",
        "gstin": "29AAACI1681G1Z0",
        "pan": "AACI1681G",
        "invoice_no": "ITC-FB-2026-1029",
        "date": "2026-10-11",
        "payment_mode": "Personal Card (Out-of-Pocket)",
        "auth_code": "AUTH-229104",
        "txn_id": "TXN-ITC-592019",
        "category": "Meals & Entertainment"
    },
    bill_to={
        "employee_name": "Raja",
        "department": "Engineering",
        "designation": "Lead Architect",
        "company": "FinPulse Systems Pvt Ltd",
        "state": "Karnataka (29)"
    },
    items=[
        {"desc": "Executive Team Working Dinner Buffet (4 Attendees)", "sac": "996331", "rate": 725.00, "qty": 4, "amount": 2900.00},
        {"desc": "Non-Alcoholic Fresh Artisan Mocktails & Mineral Water", "sac": "996331", "rate": 385.71, "qty": 1, "amount": 385.71},
    ],
    totals={
        "subtotal": 3285.71,
        "cgst": 82.14,
        "sgst": 82.14,
        "grand_total": 3450.00
    }
)

print("All sample receipts generated successfully in sample_receipts/ and frontend/public/sample-receipts/")
