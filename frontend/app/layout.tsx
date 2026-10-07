import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinPulse — Track every expense, stay in control",
  description: "9 out of 10 teams close their monthly reports in under an hour.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Forum&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-zinc-900 dark:text-zinc-100 bg-[#FAFAFA] dark:bg-[#09090B] selection:bg-zinc-200 dark:selection:bg-white/20 overflow-x-hidden overscroll-none">
        {children}
      </body>
    </html>
  );
}
