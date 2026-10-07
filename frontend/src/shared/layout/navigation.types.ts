import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  badge?: number | null;
};

export type SidebarUser = {
  name: string;
  initials: string;
  subtitle: string;
};
