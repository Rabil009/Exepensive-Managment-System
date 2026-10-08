// Demo accounts matching the three cards displayed in Cards & Limits.
export const cardUsage = [
  { id: "aura", name: "Aura", last4: "4921", network: "Visa", limit: 7500, weeks: [640, 890, 670, 1120.5] },
  { id: "apple", name: "Apple Card", last4: "8814", network: "Mastercard", limit: 5000, weeks: [240, 380, 320, 500] },
  { id: "personal", name: "Personal", last4: "2048", network: "Visa", limit: 10000, weeks: [420, 610.5, 550, 900] },
] as const;
