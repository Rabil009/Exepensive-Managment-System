import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Zoho Expense | Expense management that runs itself",
  description: "A standalone visual concept for the Zoho Expense landing page hero.",
};

const base = "https://www.zoho.com";
const links = [
  { label: "Features", href: base + "/in/expense/expense-features/?src=expense-header" },
  { label: "Pricing", href: base + "/in/expense/pricing/?src=expense-header" },
  { label: "Solutions", href: base + "/in/expense/expense-management-software/?src=expense-header" },
  { label: "Customers", href: base + "/in/expense/customers/?src=expense-header" },
  { label: "Enterprise T&E", href: base + "/in/expense/enterprise/?src=expense-header" },
  { label: "Resources", href: base + "/in/expense/support/?src=expense-header" },
];

export default function ZohoExpenseConcept() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.corporateBar}>
          <div className={styles.headerContainer}>
            <a className={styles.corporateLogo} href={base + "/"} aria-label="Zoho home">
              <Image src="/zoho/zoho-logo.svg" alt="Zoho" width={67} height={24} />
            </a>
            <nav className={styles.suiteNav} aria-label="Zoho corporate suite">
              <span>Explore Zoho</span>
              <a href={base + "/erp/"}>ERP</a>
              <a href={base + "/books/"}>Books</a>
              <a href={base + "/procurement/"}>Procurement</a>
              <a href={base + "/?src=expense-header"}>All products</a>
            </nav>
          </div>
        </div>
        <div className={styles.productBar}>
          <div className={styles.headerContainer}>
            <a className={styles.productBrand} href={base + "/in/expense/"} aria-label="Zoho Expense home">
              <span className={styles.productBrandName}>Zoho <strong>Expense</strong></span>
            </a>
            <nav className={styles.productNav} aria-label="Zoho Expense main navigation">
              {links.map(({ label, href }) => <a key={label} href={href}>{label}</a>)}
            </nav>
            <div className={styles.headerActions}>
              <a className={styles.signIn} href="https://accounts.zoho.com/signin?servicename=ZohoExpense&signupurl=https%3A%2F%2Fwww.zoho.com%2Fin%2Fexpense%2Fsignup%2F">Sign In</a>
              <a className={styles.headerCta} href={base + "/expense/signup/"}>Try Zoho Expense</a>
            </div>
            <details className={styles.mobileMenu}>
              <summary aria-label="Open menu"><span /><span /><span /></summary>
              <nav aria-label="Zoho Expense mobile navigation">
                {links.map(({ label, href }) => <a key={label} href={href}>{label}</a>)}
                <a href="https://accounts.zoho.com/signin?servicename=ZohoExpense&signupurl=https%3A%2F%2Fwww.zoho.com%2Fin%2Fexpense%2Fsignup%2F">Sign In</a>
                <a href={base + "/expense/signup/"}>Try Zoho Expense</a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="expense-management-that-runs">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.ziaLine}><Image src="/zoho/zia-logo.svg" alt="" width={29} height={29} /><span>Powered by Zia</span></div>
              <h1 id="expense-management-that-runs">Expense management that runs itself</h1>
              <p>Zoho Expense, powered by Zia, handles receipt capture, report assembly, and policy enforcement automatically — across every entity, currency, and region you operate in.</p>
              <div className={styles.ctaGroup}>
                <a className={styles.primaryCta} href={base + "/expense/signup/"}>Try Zoho Expense <span aria-hidden="true">↗</span></a>
                <a className={styles.secondaryCta} href={base + "/in/expense/demo-request/?src=expense-footer"}>Request a demo</a>
              </div>
            </div>
            <div className={styles.preview} aria-label="Zoho Expense receipt scanning preview">
              <div className={styles.previewGlow} />
              <div className={styles.previewTopline}><span>FROM RECEIPT TO REPORT</span><span>01 / 03</span></div>
              <div className={styles.phoneWrap}><Image src="/zoho/hero-image.webp" alt="Zoho Expense mobile receipt scanner showing a hotel receipt" width={756} height={852} priority sizes="(max-width: 767px) 85vw, (max-width: 1199px) 48vw, 540px" /></div>
              <div className={styles.previewNote}><span className={styles.previewNoteIcon}>✓</span><div><strong>Ready for review</strong><span>Details captured from receipt</span></div></div>
            </div>
          </div>
        </section>
        <section className={styles.productStrip} aria-label="Zoho Expense workflow">
          <div><span>01</span><strong>Capture a receipt</strong></div>
          <div><span>02</span><strong>Assemble the report</strong></div>
          <div><span>03</span><strong>Enforce policy</strong></div>
        </section>
      </main>
    </div>
  );
}
