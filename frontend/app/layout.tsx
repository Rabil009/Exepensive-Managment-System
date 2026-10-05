import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans antialiased text-white selection:bg-[#3B6CF6] selection:text-white bg-[#111111] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
