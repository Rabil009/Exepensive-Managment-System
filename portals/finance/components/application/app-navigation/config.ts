import type { ComponentType, SVGProps, ReactNode } from "react";

export interface NavSubItemType {
  label: string;
  href: string;
  badge?: number | string;
}

export interface NavItemType {
  label: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>> | any;
  items?: NavSubItemType[];
  badge?: ReactNode;
}

export interface NavItemDividerType {
  divider: true;
}

