import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Providers } from "./providers";
import "@/shared/styles/global.css";

export const metadata: Metadata = {
  title: "Aura — Employee Expense Workspace",
  description: "Employee expenses, reports, cards, and analytics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense
          fallback={
            <div className="aura-loading" role="status">
              Loading...
            </div>
          }
        >
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
