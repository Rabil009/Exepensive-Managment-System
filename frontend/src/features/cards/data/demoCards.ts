export const transactions = [
  {
    date: "Oct 24, 2025",
    merchant: "Delta Airlines",
    purpose: "Business Flight to SFO Direct",
    payment: "Corporate",
    amount: 1120,
    status: "Success",
  },
  {
    date: "Oct 23, 2025",
    merchant: "The Clancy, Autograph Collection",
    purpose: "Lodging 2 nights Deluxe King",
    payment: "Corporate",
    amount: 760.5,
    status: "Success",
  },
  {
    date: "Oct 23, 2025",
    merchant: "Blue Bottle Coffee — Mint Plaza",
    purpose: "Strategy Lunch & Team Sync",
    payment: "Personal",
    amount: 38.25,
    status: "Success",
  },
  {
    date: "Oct 22, 2025",
    merchant: "Uber Black",
    purpose: "SFO Airport Ground Transfer",
    payment: "Corporate",
    amount: 82.5,
    status: "Success",
  },
];
export const categories = [
  {
    label: "Travel & Lodging",
    icon: "flight_takeoff",
    spent: 1962.25,
    limit: 4000,
    color: "blue",
  },
  {
    label: "Meals & Per Diem",
    icon: "restaurant",
    spent: 219,
    limit: 1000,
    color: "green",
  },
  {
    label: "Software & SaaS",
    icon: "cloud_sync",
    spent: 540,
    limit: 1500,
    color: "blue",
  },
  {
    label: "Equipment & Dev",
    icon: "devices",
    spent: 599.25,
    limit: 1000,
    color: "gray",
  },
];
export const controls = [
  {
    name: "Mobile Wallet",
    icon: "smartphone",
    enabled: "Apple Pay Linked",
    disabled: "Wallet disabled",
  },
  {
    name: "Travel Geo-Fence",
    icon: "flight",
    enabled: "SFO · HND Active",
    disabled: "Geo-fence disabled",
  },
  {
    name: "Dynamic 3DS",
    icon: "security",
    enabled: "Rolling CVV",
    disabled: "3DS disabled",
  },
  {
    name: "ATM Cash Lock",
    icon: "local_atm",
    enabled: "Cash lock active",
    disabled: "Corporate Blocked",
  },
];
export type CardState = {
  frozen: boolean;
  controls: boolean[];
  virtualCards: { name: string; limit: number; last4: string }[];
  requestedLimit?: number;
};
export const storageKey = "aura-demo-card-v1";
export const defaultState: CardState = {
  frozen: false,
  controls: [true, true, true, false],
  virtualCards: [],
};

export const demoCardAccount = {
  currency: "USD",
  billingStart: "2025-10-01",
  billingEnd: "2025-10-31",
  monthlyLimit: 7500,
  sampleSpend: 3320.5,
};
