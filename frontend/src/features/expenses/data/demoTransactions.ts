export const transactions = [
  {
    card: "VISA",
    merchant: "Uber Technologies",
    note: "Today · Corporate Card (••4921)",
    amount: "42.80",
    payment: "Corporate Card (••4921)",
    category: "Travel",
    date: "2026-10-07",
  },
  {
    card: "MC",
    merchant: "Philz Coffee SFO",
    note: "Yesterday · Apple Card (••8814)",
    amount: "16.45",
    payment: "Apple Card (••8814)",
    category: "Food",
    date: "2026-10-06",
  },
];

export type UnlinkedTransaction = (typeof transactions)[number];
