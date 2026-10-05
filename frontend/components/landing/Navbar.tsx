import Link from "next/link";

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 w-full px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between">
      {/* Logo Wordmark */}
      <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-white select-none">
        finpulse
      </Link>

      {/* Right Navigation */}
      <div className="flex items-center gap-6 sm:gap-8">
        <Link 
          href="#faq" 
          className="text-xs font-medium text-white/90 hover:text-white transition-colors"
        >
          FAQ
        </Link>
        <Link 
          href="#contact" 
          className="text-xs font-medium text-white/90 hover:text-white transition-colors"
        >
          Contact
        </Link>
        <Link
          href="/dashboard"
          className="bg-[#3B6CF6] hover:bg-[#2557EB] text-white text-xs font-semibold px-4 sm:px-5 py-2 rounded-full transition-all shadow-sm active:scale-95"
        >
          Open Dashboard
        </Link>
      </div>
    </header>
  );
}
