import { supabase } from "@/lib/supabase";
import type { ExpenseClaim, DepartmentBudget } from "@/types/finance";

/**
 * Fetch all expense claims from Supabase database.
 */
export async function getExpenseClaims(): Promise<ExpenseClaim[]> {
  try {
    const { data, error } = await supabase
      .from("expense_claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database snake_case to frontend camelCase
    return data.map((item: any) => ({
      id: item.id,
      employeeId: item.employee_id,
      employeeName: item.employee_name,
      employeeDepartment: item.employee_department,
      title: item.title,
      description: item.description || "",
      amount: Number(item.amount),
      currency: item.currency || "INR",
      category: item.category,
      paymentMethod: item.payment_method,
      merchant: item.merchant,
      receiptUrl: item.receipt_url,
      receiptName: item.receipt_name,
      status: item.status,
      policyViolation: item.policy_violation,
      policyExceededAmount: item.policy_exceeded_amount ? Number(item.policy_exceeded_amount) : 0,
      employeeExceptionReason: item.employee_exception_reason,
      isDuplicateWarning: item.is_duplicate_warning || false,
      duplicateDetails: item.duplicate_details,
      isHold: item.is_hold || false,
      holdReason: item.hold_reason,
      heldAt: item.held_at,
      submittedAt: item.submitted_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      managerRemark: item.manager_remark,
      financeRemark: item.finance_remark,
      paymentReference: item.payment_reference,
      disbursedAt: item.disbursed_at,
      paymentChannel: item.payment_channel,
    }));
  } catch (err) {
    console.error("Failed to query Supabase claims:", err);
    return [];
  }
}

/**
 * Update an existing claim status & remarks in Supabase
 */
export async function updateClaimInDb(
  claimId: string,
  updates: Partial<ExpenseClaim>
): Promise<boolean> {
  try {
    const dbUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.managerRemark !== undefined) dbUpdates.manager_remark = updates.managerRemark;
    if (updates.financeRemark !== undefined) dbUpdates.finance_remark = updates.financeRemark;
    if (updates.isHold !== undefined) dbUpdates.is_hold = updates.isHold;
    if (updates.holdReason !== undefined) dbUpdates.hold_reason = updates.holdReason;
    if (updates.heldAt !== undefined) dbUpdates.held_at = updates.heldAt;
    if (updates.paymentReference !== undefined) dbUpdates.payment_reference = updates.paymentReference;
    if (updates.paymentChannel !== undefined) dbUpdates.payment_channel = updates.paymentChannel;
    if (updates.disbursedAt !== undefined) dbUpdates.disbursed_at = updates.disbursedAt;

    const { error } = await supabase
      .from("expense_claims")
      .update(dbUpdates)
      .eq("id", claimId);

    if (error) {
      console.warn("Could not sync update to Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error updating claim in Supabase:", err);
    return false;
  }
}

/**
 * Fetch department budgets from Supabase
 */
export async function getDepartmentBudgets(): Promise<DepartmentBudget[]> {
  try {
    const { data, error } = await supabase
      .from("department_budgets")
      .select("*")
      .order("name");

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      allocatedAmount: Number(b.allocated_amount),
      spentAmount: Number(b.spent_amount),
      currency: b.currency || "INR",
      fiscalPeriod: b.fiscal_period,
      thresholdPercent: Number(b.threshold_percent || 85),
    }));
  } catch (err) {
    console.error("Error fetching budgets:", err);
    return [];
  }
}
