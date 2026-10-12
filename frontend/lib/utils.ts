import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  const isINR = currency === "INR";
  return new Intl.NumberFormat(isINR ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
}

export function getEmployeeAvatar(name: string): string {
  const cleanName = (name || "User").trim();
  const initials =
    cleanName
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  // Institutional fintech palette for dynamic user initials
  const colors = [
    { bg: "#2563EB", fg: "#FFFFFF" },
    { bg: "#059669", fg: "#FFFFFF" },
    { bg: "#4F46E5", fg: "#FFFFFF" },
    { bg: "#7C3AED", fg: "#FFFFFF" },
    { bg: "#DB2777", fg: "#FFFFFF" },
    { bg: "#D97706", fg: "#FFFFFF" },
    { bg: "#0891B2", fg: "#FFFFFF" },
  ];
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) hash += cleanName.charCodeAt(i);
  const theme = colors[Math.abs(hash) % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${theme.bg}"/><text x="50" y="58" font-size="38" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="${theme.fg}" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
