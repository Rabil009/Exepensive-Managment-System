import {
  Compass,
  Receipt,
  ClipboardList,
  CreditCard,
  ChartNoAxesCombined,
} from "lucide-react";

export const navigation = [
  { label: "Overview", icon: Compass, path: "/employee/dashboard" },
  {
    label: "New Expense",
    icon: Receipt,
    path: "/employee/expenses/new",
  },
  { label: "Cards & Limits", icon: CreditCard, path: "/employee/cards" },
  { label: "Reports", icon: ClipboardList, path: "/employee/reports" },
  {
    label: "Analytics",
    icon: ChartNoAxesCombined,
    path: "/employee/analytics",
  },
];
