// ============================================================
// SHARED TYPE CONTRACTS — finance.ts (PRD Complete Specification)
// ============================================================

export type UserRole = "EMPLOYEE" | "MANAGER" | "FINANCE" | "ADMIN";

export type ClaimStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "MANAGER_APPROVED"
  | "MANAGER_REJECTED"
  | "FINANCE_APPROVED"
  | "FINANCE_REJECTED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "DISBURSED"
  | "CLOSED";

export type PaymentMethod =
  | "PERSONAL_CARD"
  | "PERSONAL_CASH"
  | "PERSONAL_UPI"
  | "CORPORATE_CARD";

export type ExpenseCategory =
  | "TRAVEL"
  | "MEALS"
  | "SOFTWARE"
  | "HARDWARE"
  | "OFFICE"
  | "TRAINING"
  | "HOTEL"
  | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId?: string;
  avatarInitials: string;
}

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  merchant?: string;
  receiptUrl?: string;
  receiptName?: string;
  status: ClaimStatus;
  
  // PRD Real Verification & Policy Fields
  policyViolation?: string;
  policyExceededAmount?: number;
  employeeExceptionReason?: string;
  isDuplicateWarning?: boolean;
  duplicateDetails?: string;

  // Finance Hold Engine (PRD Page 5 & 6)
  isHold?: boolean;
  holdReason?: string;
  heldAt?: string;

  // Timestamps and Remarks
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  managerRemark?: string;
  financeRemark?: string;

  // Disbursement Data (PRD Page 7)
  paymentReference?: string;
  disbursedAt?: string;
  paymentChannel?: string;
}

export interface DepartmentBudget {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
  fiscalPeriod: string;
  thresholdPercent: number;
}

export interface ReimbursementRecord {
  id: string;
  claimId: string;
  employeeId: string;
  employeeName: string;
  eligiblePersonalAmount: number;
  corporateCardAmount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "PAID";
  paymentReference?: string;
  disbursedAt?: string;
  paymentMethod?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: any;
}
