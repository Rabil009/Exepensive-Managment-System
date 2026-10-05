import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { CreateSection } from "@/components/landing/CreateSection";
import { ChannelSection } from "@/components/landing/ChannelSection";
import { ScanSection } from "@/components/landing/ScanSection";
import { MethodsSection } from "@/components/landing/MethodsSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#111111] overflow-x-hidden">
      {/* Transparent Overlaid Navbar */}
      <Navbar />

      {/* Hero: Royal Blue with Stage Illustration */}
      <Hero />

      {/* Section 2: Dark - Log Expenses in Seconds with 3D Coins & 4 Columns */}
      <CreateSection />

      {/* Section 3: Dark - Envelope Image Left, Text Right */}
      <ChannelSection />

      {/* Section 4: Dark - Scan & Go with QR Code Circle */}
      <ScanSection />

      {/* Section 5: Light - All Your Accounts in One Place with 45deg Tilted Badges */}
      <MethodsSection />

      {/* Final CTA: Royal Blue - Start for Free Today with Rocket & Footer */}
      <FinalCTA />
    </main>
  );
}
