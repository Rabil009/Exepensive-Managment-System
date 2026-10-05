import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinPulse — Sovereign Capital & Expense Operations",
  description: "Bespoke corporate expense management and private capital treasury",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-display)] font-sans-luxury antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                color: "var(--text-display)",
                fontFamily: "var(--font-sans)",
                borderRadius: "12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
