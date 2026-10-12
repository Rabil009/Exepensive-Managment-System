import { supabase } from "./supabase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function normalizeClaimStatus(
  rawStatus?: string
): "Pending" | "Approved" | "Reimbursed" | "Rejected" | "Draft" {
  const s = (rawStatus || "").toUpperCase().trim();
  if (
    s === "PAID" ||
    s === "DISBURSED" ||
    s === "CLOSED" ||
    s === "SETTLED" ||
    s.includes("REIMBURS")
  ) {
    return "Reimbursed";
  }
  if (s.includes("REJECT") || s.includes("DECLIN")) {
    return "Rejected";
  }
  if (s === "DRAFT") {
    return "Draft";
  }
  if (
    s === "FINANCE_APPROVED" ||
    s === "PAYMENT_PENDING" ||
    s === "APPROVED" ||
    s === "MANAGER_APPROVED" ||
    s.includes("APPROV")
  ) {
    return "Approved";
  }
  if (s === "SUBMITTED" || s === "PENDING" || s.includes("PEND") || s.includes("SUBMIT")) {
    return "Pending";
  }
  return "Pending";
}

export async function resolveCurrentEmployee(): Promise<{
  id: string;
  name: string;
  email: string;
  department: string;
} | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUser = sessionData?.session?.user;

    let userEmail = authUser?.email || "";
    let userId = authUser?.id || "";

    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("payout_user_email");
      if (!userEmail && storedEmail) {
        userEmail = storedEmail;
      }
    }

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, email, department")
        .eq("id", userId)
        .maybeSingle();

      const name =
        profile?.name ||
        authUser?.user_metadata?.name ||
        userEmail.split("@")[0] ||
        "Employee";
      const department =
        profile?.department ||
        authUser?.user_metadata?.department ||
        "Engineering";

      return {
        id: userId,
        name,
        email: profile?.email || userEmail,
        department,
      };
    }

    if (userEmail) {
      const cleanEmail = userEmail.trim().toLowerCase();
      const prefix = cleanEmail.split("@")[0];

      // 1. Try finding in profiles by email
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, email, department")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          name: profile.name || prefix,
          email: profile.email || cleanEmail,
          department: profile.department || "Engineering",
        };
      }

      // 2. Try matching existing employee_id from expense_claims or employee_cards
      const { data: matchedClaim } = await supabase
        .from("expense_claims")
        .select("employee_id, employee_name, employee_department")
        .ilike("employee_name", prefix)
        .limit(1)
        .maybeSingle();

      if (matchedClaim?.employee_id) {
        return {
          id: matchedClaim.employee_id,
          name: matchedClaim.employee_name || prefix,
          email: cleanEmail,
          department: matchedClaim.employee_department || "Engineering",
        };
      }

      const storedName =
        typeof window !== "undefined"
          ? localStorage.getItem("payout_user_name")
          : null;

      return {
        id: cleanEmail,
        name: storedName || prefix,
        email: cleanEmail,
        department: "Engineering",
      };
    }
  } catch (err) {
    console.warn("Failed resolving current employee:", err);
  }

  return null;
}

async function resolveExpenseOwnerId(
  employeeId: string | undefined,
  employeeName: string,
  authUserId?: string,
) {
  if (employeeId && !employeeId.includes("@")) return employeeId;
  const { data: matchedEmployee } = await supabase
    .from("expense_claims")
    .select("employee_id")
    .ilike("employee_name", employeeName)
    .limit(1)
    .maybeSingle();
  return (
    authUserId ||
    matchedEmployee?.employee_id ||
    "b8ce7a2d-e91a-47f4-92ba-adb7d0bf5c4d"
  );
}

export async function employeeRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token || "";
  const authUser = sessionData?.session?.user;
  const currentEmp = await resolveCurrentEmployee();
  const employeeId = currentEmp?.id;
  const employeeName = currentEmp?.name || "Employee";
  const employeeDept = currentEmp?.department || "Engineering";

  // 1. Try FastAPI backend if online
  if (apiUrl && !apiUrl.includes("localhost:8000")) {
    try {
      const response = await fetch(`${apiUrl}/api/employee${path}`, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) return response;
    } catch {
      // Backend offline, fallback to direct Supabase cloud below
    }
  }

  // 2. Direct Real Supabase Cloud Logic
  let responseData: any = null;
  let responseStatus = 200;

  // OVERVIEW: Real claims & dynamic summary metrics (ISOLATED BY EMPLOYEE)
  if (path.startsWith("/overview")) {
    try {
      if (!employeeId && !employeeName) {
        responseData = {
          expenses: [],
          summary: {
            ready_for_reimbursement: "0",
            pending_approval: "0",
            card_spending_mtd: "0",
            card_limit: "100000",
            card_limit_remaining: "100000",
            approved_count: 0,
            pending_count: 0,
          },
        };
      } else {
        // Build flexible query matching either employee_id OR employee_name
        let claimsQuery = supabase.from("expense_claims").select("*");
        if (employeeId && employeeName) {
          claimsQuery = claimsQuery.or(
            `employee_id.eq.${employeeId},employee_name.ilike.${employeeName}`
          );
        } else if (employeeId) {
          claimsQuery = claimsQuery.eq("employee_id", employeeId);
        } else {
          claimsQuery = claimsQuery.ilike("employee_name", employeeName);
        }

        const { data: rawClaims, error } = await claimsQuery.order("created_at", {
          ascending: false,
        });

        const claims = !error && rawClaims ? rawClaims : [];
        const draftEmployeeId = await resolveExpenseOwnerId(
          employeeId,
          employeeName,
          authUser?.id,
        );
        const { data: rawDrafts } = draftEmployeeId
          ? await supabase
              .from("employee_expense_drafts")
              .select("*")
              .eq("employee_id", draftEmployeeId)
              .order("updated_at", { ascending: false })
          : { data: [] };
        const drafts = rawDrafts || [];

        const pendingClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Pending"
        );
        const approvedClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Approved"
        );
        const cardClaims = claims.filter((c: any) =>
          (c.payment_method || "").toUpperCase().includes("CORPORATE")
        );

        const pendingAmount = pendingClaims.reduce(
          (s: number, c: any) => s + (Number(c.amount) || 0),
          0
        );
        const approvedAmount = approvedClaims.reduce(
          (s: number, c: any) => s + (Number(c.amount) || 0),
          0
        );
        const cardSpent = cardClaims.reduce(
          (s: number, c: any) => s + (Number(c.amount) || 0),
          0
        );
        const cardLimit = 100000;

        responseData = {
          expenses: [
            ...claims.map((claim: any) => ({
              id: claim.id,
              date: claim.expense_date || (claim.created_at || "").slice(0, 10),
              merchant: claim.merchant || claim.title || "Expense",
              category: claim.category || "OTHER",
              amount: Number(claim.amount) || 0,
              status: normalizeClaimStatus(claim.status),
              raw_status: claim.status || "SUBMITTED",
              source: "claim",
              description: claim.description || "",
              receipt: claim.receipt_name || null,
              receiptUrl: claim.receipt_url || null,
              employee_name: claim.employee_name || null,
              currency: claim.currency || "INR",
              report: claim.report_name || "General",
              paymentMethod: (claim.payment_method || "")
                .toUpperCase()
                .includes("CORPORATE")
                ? "Corporate Card"
                : "Personal (Out-of-Pocket)",
              attendees: claim.attendees || [],
              manager_remark: claim.manager_remark || null,
              finance_remark: claim.finance_remark || null,
            })),
            ...drafts.map((d: any) => ({
              id: d.id,
              date: d.expense_date || (d.updated_at || d.created_at || "").slice(0, 10),
              merchant: d.merchant || "Untitled draft",
              category: d.category || "OTHER",
              amount: Number(d.amount) || 0,
              status: "Draft",
              raw_status: "DRAFT",
              source: "draft",
              description: d.business_purpose || "",
              receipt: d.receipt_name || null,
              currency: d.currency || "INR",
              report: d.report_name || "Unassigned",
              paymentMethod: d.payment_method || "Personal (Out-of-Pocket)",
              attendees: d.attendees || [],
            })),
          ].sort((a: any, b: any) => (b.date || "").localeCompare(a.date || "")),
          summary: {
            ready_for_reimbursement: String(approvedAmount),
            pending_approval: String(pendingAmount),
            card_spending_mtd: String(cardSpent),
            card_limit: String(cardLimit),
            card_limit_remaining: String(Math.max(0, cardLimit - cardSpent)),
            approved_count: approvedClaims.length,
            pending_count: pendingClaims.length,
          },
        };
      }
    } catch {
      responseData = {
        expenses: [],
        summary: {
          ready_for_reimbursement: "0",
          pending_approval: "0",
          card_spending_mtd: "0",
          card_limit: "100000",
          card_limit_remaining: "100000",
          approved_count: 0,
          pending_count: 0,
        },
      };
    }
  }

  // CARDS: Real cards & transactions from Supabase (ISOLATED BY EMPLOYEE)
  else if (path.startsWith("/cards")) {
    try {
      if (!employeeId && !employeeName) {
        responseData = {
          cards: [],
          transactions: [],
          requests: [],
          usage: {
            month: new Date().toISOString().slice(0, 7),
            cards: [],
            categories: [],
          },
        };
      } else {
        // 1. POST /cards/requests (Create Virtual Card or Request Limit Increase)
        if (path.startsWith("/cards/requests") && init.method === "POST") {
          let bodyData: any = {};
          if (typeof init.body === "string") {
            bodyData = JSON.parse(init.body);
          }

          const targetEmpId = employeeId || "b8ce7a2d-e91a-47f4-92ba-adb7d0bf5c4d";

          const { data: newReq, error: reqErr } = await supabase
            .from("employee_card_requests")
            .insert({
              employee_id: targetEmpId,
              card_id: bodyData.card_id || null,
              request_type: bodyData.request_type,
              card_name: bodyData.card_name || null,
              requested_limit: Number(bodyData.requested_limit),
              status: "PENDING",
            })
            .select()
            .single();

          if (reqErr) {
            console.error("Card request insert error:", reqErr);
            throw new Error(reqErr.message);
          }

          responseData = newReq || { status: "PENDING" };
        }

        // 2. PATCH /cards/[id] (Update card security controls)
        else if (init.method === "PATCH") {
          const cardId = path.split("/cards/")[1];
          let patchData: any = {};
          if (typeof init.body === "string") {
            patchData = JSON.parse(init.body);
          }

          const { data: updatedCard } = await supabase
            .from("employee_cards")
            .update({
              active: patchData.active,
              frozen: patchData.frozen,
              wallet_enabled: patchData.wallet_enabled,
              travel_limits_enabled: patchData.travel_limits_enabled,
              online_verification_enabled: patchData.online_verification_enabled,
              atm_lock_enabled: patchData.atm_lock_enabled,
              updated_at: new Date().toISOString(),
            })
            .eq("id", cardId)
            .select()
            .single();

          responseData = updatedCard || { id: cardId, ...patchData };
        }

        // 3. GET /cards (Load cards, usage metrics, and transactions)
        else {
          let cardsQuery = supabase.from("employee_cards").select("*");
          if (employeeId && employeeName) {
            cardsQuery = cardsQuery.or(
              `employee_id.eq.${employeeId},display_name.ilike.%${employeeName}%`
            );
          } else if (employeeId) {
            cardsQuery = cardsQuery.eq("employee_id", employeeId);
          } else {
            cardsQuery = cardsQuery.ilike("display_name", `%${employeeName}%`);
          }

          let { data: dbCards } = await cardsQuery.order("created_at", {
            ascending: false,
          });

          let cards = dbCards || [];

          // If no cards exist for this employee, auto-provision an active corporate card in their name
          if (cards.length === 0 && employeeId) {
            const last4 = Math.floor(1000 + Math.random() * 9000).toString();
            const { data: seededCard } = await supabase
              .from("employee_cards")
              .insert({
                employee_id: employeeId,
                display_name: `${employeeName} - Corporate`,
                kind: "PHYSICAL",
                network: "Visa Commercial",
                last4,
                currency: "INR",
                monthly_limit: 100000,
                active: true,
                frozen: false,
                wallet_enabled: true,
                travel_limits_enabled: false,
                online_verification_enabled: true,
                atm_lock_enabled: false,
              })
              .select()
              .single();

            if (seededCard) {
              cards = [seededCard];
            }
          }

          const { data: dbTxns } = await supabase
            .from("employee_card_transactions")
            .select("*")
            .eq("employee_id", employeeId)
            .order("transaction_date", { ascending: false });

          const transactions = dbTxns || [];

          // Fetch card requests for this employee
          let reqQuery = supabase.from("employee_card_requests").select("*");
          if (employeeId) {
            reqQuery = reqQuery.eq("employee_id", employeeId);
          }
          const { data: dbReqs } = await reqQuery.order("created_at", {
            ascending: false,
          });

          const primaryCard = cards[0];
          const cardLimit = Number(primaryCard?.monthly_limit) || 100000;

          // Calculate card spending
          const spent = transactions
            .filter((t: any) => t.status !== "DECLINED")
            .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

          // Standard 4 category limits matching SpendingLimits component
          const categories = [
            {
              category: "SOFTWARE",
              name: "Software & Cloud",
              spent: "0",
              limit: String(Math.round(cardLimit * 0.35)),
              remaining: String(Math.round(cardLimit * 0.35)),
            },
            {
              category: "TRAVEL",
              name: "Travel & Transit",
              spent: "0",
              limit: String(Math.round(cardLimit * 0.35)),
              remaining: String(Math.round(cardLimit * 0.35)),
            },
            {
              category: "MEALS",
              name: "Meals & Dining",
              spent: "0",
              limit: String(Math.round(cardLimit * 0.15)),
              remaining: String(Math.round(cardLimit * 0.15)),
            },
            {
              category: "OFFICE",
              name: "Office & Equipment",
              spent: "0",
              limit: String(Math.round(cardLimit * 0.15)),
              remaining: String(Math.round(cardLimit * 0.15)),
            },
          ];

          responseData = {
            cards,
            transactions,
            requests: dbReqs || [],
            usage: {
              month: new Date().toISOString().slice(0, 7),
              cards: cards.map((c: any) => {
                const cLimit = Number(c.monthly_limit) || 100000;
                return {
                  id: c.id,
                  spent: String(spent),
                  limit: String(cLimit),
                  remaining: String(Math.max(0, cLimit - spent)),
                };
              }),
              categories,
            },
          };
        }
      }
    } catch (cardsErr) {
      console.error("Cards endpoint error:", cardsErr);
      responseData = {
        cards: [],
        transactions: [],
        requests: [],
        usage: {
          month: new Date().toISOString().slice(0, 7),
          cards: [],
          categories: [],
        },
      };
    }
  }

  // ANALYTICS: Dynamic calculation from real expense claims & cards
  else if (path.startsWith("/analytics")) {
    const urlObj = new URL(path, "http://localhost");
    const monthParam =
      urlObj.searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);

    const emptyAnalytics = {
      month: monthParam,
      currency: "INR",
      totals: {
        total_spend: "0",
        pending_approval: "0",
        reimbursed: "0",
        corporate_card_spend: "0",
      },
      categories: [],
      daily_spend: [],
      weekly_spend: [],
      funding: { corporate: "0", personal: "0" },
      receipt_compliance: { attached: 0, total: 0 },
      largest_expense: null,
      cards: [],
    };

    try {
      if (!employeeId && !employeeName) {
        responseData = emptyAnalytics;
      } else {
        // 1. Fetch claims
        let claimsQuery = supabase.from("expense_claims").select("*");
        if (employeeId && employeeName) {
          claimsQuery = claimsQuery.or(
            `employee_id.eq.${employeeId},employee_name.ilike.${employeeName}`
          );
        } else if (employeeId) {
          claimsQuery = claimsQuery.eq("employee_id", employeeId);
        } else if (employeeName) {
          claimsQuery = claimsQuery.ilike("employee_name", employeeName);
        }

        const { data: claims } = await claimsQuery;
        const allClaims = claims || [];

        // 2. Fetch employee cards
        let cardsQuery = supabase.from("employee_cards").select("*");
        if (employeeId && employeeName) {
          cardsQuery = cardsQuery.or(
            `employee_id.eq.${employeeId},display_name.ilike.%${employeeName}%`
          );
        } else if (employeeId) {
          cardsQuery = cardsQuery.eq("employee_id", employeeId);
        } else if (employeeName) {
          cardsQuery = cardsQuery.ilike("display_name", `%${employeeName}%`);
        }
        const { data: dbCards } = await cardsQuery;
        const cards = (dbCards || []).map((c: any) => ({
          id: c.id,
          name: c.display_name || "Corporate Card",
          last4: c.last4 || null,
          limit: String(c.monthly_limit || 100000),
        }));

        // Filter claims by month or fallback to allClaims for resilient display
        const monthClaims = allClaims.filter((c: any) => {
          const d = c.expense_date || (c.created_at || "").slice(0, 10);
          return d.startsWith(monthParam);
        });

        const targetClaims = monthClaims.length > 0 ? monthClaims : allClaims;

        const totalSpend = targetClaims.reduce(
          (acc: number, c: any) => acc + (Number(c.amount) || 0),
          0
        );
        const pendingApproval = targetClaims
          .filter((c: any) => normalizeClaimStatus(c.status) === "Pending")
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const reimbursed = targetClaims
          .filter((c: any) => normalizeClaimStatus(c.status) === "Reimbursed")
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const corporateSpend = targetClaims
          .filter((c: any) =>
            (c.payment_method || "").toUpperCase().includes("CORPORATE")
          )
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const personalSpend = targetClaims
          .filter(
            (c: any) =>
              !(c.payment_method || "").toUpperCase().includes("CORPORATE")
          )
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);

        const catMap: Record<string, number> = {};
        const daysMap: Record<string, number> = {};
        const weeksMap: Record<string, number> = { W1: 0, W2: 0, W3: 0, W4: 0, W5: 0 };

        targetClaims.forEach((c: any) => {
          const amt = Number(c.amount) || 0;
          const cat = c.category || "OTHER";
          catMap[cat] = (catMap[cat] || 0) + amt;

          const d = c.expense_date || (c.created_at || "").slice(0, 10);
          if (d) {
            daysMap[d] = (daysMap[d] || 0) + amt;
          }
          const day = parseInt((d || "").slice(8, 10), 10) || 1;
          const w =
            day <= 7
              ? "W1"
              : day <= 14
              ? "W2"
              : day <= 21
              ? "W3"
              : day <= 28
              ? "W4"
              : "W5";
          weeksMap[w] = (weeksMap[w] || 0) + amt;
        });

        const categories = Object.entries(catMap).map(([name, amount]) => ({
          name,
          amount: String(amount),
        }));

        const daily_spend = Object.entries(daysMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, amount]) => ({
            date,
            amount: String(amount),
          }));

        const weekly_spend = Object.entries(weeksMap).map(([week, amount]) => ({
          week,
          amount: String(amount),
        }));

        const attached = targetClaims.filter(
          (c: any) => Boolean(c.receipt_url || c.receipt_name)
        ).length;

        let largest: {
          merchant: string;
          date: string;
          amount: number;
          currency: string;
        } | null = null;

        if (targetClaims.length > 0) {
          const sorted = [...targetClaims].sort(
            (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)
          );
          const top = sorted[0];
          if (top && (Number(top.amount) || 0) > 0) {
            largest = {
              merchant: top.merchant || top.title || "Expense",
              date: top.expense_date || (top.created_at || "").slice(0, 10),
              amount: Number(top.amount) || 0,
              currency: top.currency || "INR",
            };
          }
        }

        responseData = {
          month: monthParam,
          currency: "INR",
          totals: {
            total_spend: String(totalSpend),
            pending_approval: String(pendingApproval),
            reimbursed: String(reimbursed),
            corporate_card_spend: String(corporateSpend),
          },
          categories,
          daily_spend,
          weekly_spend,
          funding: {
            corporate: String(corporateSpend),
            personal: String(personalSpend),
          },
          receipt_compliance: {
            attached,
            total: targetClaims.length,
          },
          largest_expense: largest,
          cards,
        };
      }
    } catch (err) {
      console.error("Analytics endpoint error:", err);
      responseData = emptyAnalytics;
    }
  }

  // REPORTS: Real reports grouped with DYNAMIC workflow_stage
  else if (path.startsWith("/reports")) {
    try {
      if (!employeeId && !employeeName) {
        responseData = { reports: [] };
      } else {
        let claimsQuery = supabase.from("expense_claims").select("*");
        if (employeeId && employeeName) {
          claimsQuery = claimsQuery.or(
            `employee_id.eq.${employeeId},employee_name.ilike.${employeeName}`
          );
        } else if (employeeId) {
          claimsQuery = claimsQuery.eq("employee_id", employeeId);
        }

        const { data: claims } = await claimsQuery;
        const allClaims = claims || [];

        const reportGroups: Record<string, any[]> = {};
        allClaims.forEach((c: any) => {
          const rName = c.report_name || "General";
          if (!reportGroups[rName]) reportGroups[rName] = [];
          reportGroups[rName].push(c);
        });

        const computedReports = Object.entries(reportGroups).map(
          ([name, repClaims]) => {
            // Dynamically compute workflow_stage based on real claims
            const hasRejected = repClaims.some((c: any) =>
              (c.status || "").toUpperCase().includes("REJECT")
            );
            const allComplete = repClaims.every((c: any) => {
              const st = (c.status || "").toUpperCase();
              return (
                st === "PAID" ||
                st === "DISBURSED" ||
                st === "CLOSED" ||
                st === "SETTLED"
              );
            });
            const allApproved = repClaims.every((c: any) => {
              const st = (c.status || "").toUpperCase();
              return (
                st.includes("APPROV") ||
                st === "PAID" ||
                st === "DISBURSED" ||
                st === "CLOSED"
              );
            });

            const allDraft =
              repClaims.length > 0 &&
              repClaims.every((c: any) => (c.status || "").toUpperCase() === "DRAFT");

            let workflowStage:
              | "DRAFT"
              | "REJECTED"
              | "COMPLETE"
              | "FINANCE_REVIEW"
              | "MANAGER_REVIEW" = "MANAGER_REVIEW";

            if (allDraft) {
              workflowStage = "DRAFT";
            } else if (hasRejected) {
              workflowStage = "REJECTED";
            } else if (allComplete) {
              workflowStage = "COMPLETE";
            } else if (allApproved) {
              workflowStage = "FINANCE_REVIEW";
            }

            return {
              name,
              workflow_stage: workflowStage,
              can_withdraw: workflowStage === "MANAGER_REVIEW",
              can_submit: workflowStage === "DRAFT",
              items: repClaims.map((c: any) => ({
                id: c.id,
                date: c.expense_date || (c.created_at || "").slice(0, 10),
                merchant: c.merchant || c.title,
                category: c.category,
                amount: Number(c.amount) || 0,
                status: normalizeClaimStatus(c.status),
                currency: c.currency || "INR",
              })),
            };
          }
        );

        responseData = { reports: computedReports };
      }
    } catch {
      responseData = { reports: [] };
    }
  }

  // NEW EXPENSE OPTIONS
  else if (path.startsWith("/new-expense/options")) {
    try {
      const { data: policies } = await supabase
        .from("expense_policies")
        .select("category");
      const dbCategories = policies?.map((p: any) => p.category) || [];
      responseData = {
        categories:
          dbCategories.length > 0
            ? dbCategories
            : [
                "TRAVEL",
                "MEALS",
                "SOFTWARE",
                "HARDWARE",
                "OFFICE",
                "HOTEL",
                "TRAINING",
                "OTHER",
              ],
        reports: ["Q4 Operations", "Client Visit", "General", "Conference 2026"],
      };
    } catch {
      responseData = {
        categories: [
          "TRAVEL",
          "MEALS",
          "SOFTWARE",
          "HARDWARE",
          "OFFICE",
          "HOTEL",
          "TRAINING",
          "OTHER",
        ],
        reports: ["General"],
      };
    }
  }

  // LOAD A SAVED DRAFT
  else if (path.match(/^\/new-expense\/[^/]+$/) && init.method !== "DELETE") {
    const draftId = decodeURIComponent(path.split("/").pop() || "");
    const draftOwnerId = await resolveExpenseOwnerId(employeeId, employeeName, authUser?.id);
    const { data: savedDraft, error } = await supabase
      .from("employee_expense_drafts")
      .select("*")
      .eq("id", draftId)
      .eq("employee_id", draftOwnerId)
      .maybeSingle();
    if (error || !savedDraft) {
      responseStatus = error ? 500 : 404;
      responseData = { detail: error?.message || "Draft not found" };
    } else {
      responseData = savedDraft;
    }
  }

  // DELETE A SAVED DRAFT
  else if (path.match(/^\/new-expense\/[^/]+$/) && init.method === "DELETE") {
    const draftId = decodeURIComponent(path.split("/").pop() || "");
    const draftOwnerId = await resolveExpenseOwnerId(employeeId, employeeName, authUser?.id);
    const { data: deletedDraft, error } = await supabase
      .from("employee_expense_drafts")
      .delete()
      .eq("id", draftId)
      .eq("employee_id", draftOwnerId)
      .select("id")
      .maybeSingle();
    if (error || !deletedDraft) {
      responseStatus = error ? 500 : 404;
      responseData = { detail: error?.message || "Draft not found" };
    } else {
      responseData = { id: draftId, status: "deleted" };
    }
  }

  // NEW EXPENSE SUBMIT
  else if (path.startsWith("/new-expense") && init.method === "POST") {
    try {
      if (init.body instanceof FormData) {
        const rawData = init.body.get("data");
        const file = init.body.get("file") as File | null;
        if (typeof rawData === "string") {
          const parsed = JSON.parse(rawData);

          // Resolve employee UUID
          const submitEmployeeId = await resolveExpenseOwnerId(
            employeeId,
            employeeName,
            authUser?.id,
          );

          let receiptUrl: string | null = null;
          let receiptName: string | null = null;
          let receiptPath: string | null = null;

          if (file && file.size > 0 && submitEmployeeId) {
            try {
              const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
              const filePath = `${submitEmployeeId}/${parsed.id}/${Date.now()}-${safeName}`;
              const { error: uploadError } = await supabase.storage
                .from("receipts")
                .upload(filePath, file, { upsert: true });

              if (!uploadError) {
                receiptPath = filePath;
                const { data: urlData } = supabase.storage
                  .from("receipts")
                  .getPublicUrl(filePath);
                receiptUrl = urlData?.publicUrl || null;
                receiptName = file.name;
              }
            } catch (storageErr) {
              console.warn("Storage upload note:", storageErr);
            }
          }

          const action = init.body.get("action");
          if (action === "Draft") {
            const { data: existingDraft } = await supabase
              .from("employee_expense_drafts")
              .select("receipt_path,receipt_name,receipt_content_type,receipt_size_bytes")
              .eq("id", parsed.id)
              .eq("employee_id", submitEmployeeId)
              .maybeSingle();
            const draftRow = {
              id: parsed.id,
              employee_id: submitEmployeeId,
              merchant: parsed.merchant?.trim() || null,
              expense_date: parsed.date || null,
              amount: Number(parsed.amount) || 0,
              currency: "INR",
              category: parsed.category || null,
              report_name: parsed.report || null,
              payment_method: parsed.payment_method || null,
              business_purpose: parsed.purpose || null,
              attendees: parsed.attendees || [],
              linked_transaction_id: parsed.linked_transaction_id || null,
              receipt_path: receiptPath || existingDraft?.receipt_path || null,
              receipt_name: receiptName || existingDraft?.receipt_name || null,
              receipt_content_type: file?.type || existingDraft?.receipt_content_type || null,
              receipt_size_bytes: file?.size || existingDraft?.receipt_size_bytes || null,
            };
            const { data: savedDraft, error: draftError } = await supabase
              .from("employee_expense_drafts")
              .upsert(draftRow, { onConflict: "id" })
              .select()
              .single();
            if (draftError) throw new Error(draftError.message);
            responseData = { id: parsed.id, status: "Draft", draft: savedDraft };
          } else {

          const rawCat = (parsed.category || "OTHER").toUpperCase();
          const validCategories = [
            "TRAVEL",
            "MEALS",
            "SOFTWARE",
            "HARDWARE",
            "OFFICE",
            "TRAINING",
            "HOTEL",
            "OTHER",
          ];
          let category = validCategories.includes(rawCat) ? rawCat : "OTHER";
          if (rawCat.includes("FOOD") || rawCat.includes("DIN")) category = "MEALS";
          if (rawCat.includes("HOTEL") || rawCat.includes("STAY")) category = "HOTEL";
          if (
            rawCat.includes("TRAVEL") ||
            rawCat.includes("FLIGHT") ||
            rawCat.includes("UBER") ||
            rawCat.includes("CAB")
          )
            category = "TRAVEL";

          const rawPm = (parsed.payment_method || "").toUpperCase();
          let paymentMethod = "PERSONAL_CARD";
          if (rawPm.includes("CORPORATE") || rawPm.includes("CARD"))
            paymentMethod = "CORPORATE_CARD";
          else if (rawPm.includes("UPI")) paymentMethod = "PERSONAL_UPI";
          else if (rawPm.includes("CASH")) paymentMethod = "PERSONAL_CASH";

          const claimId = parsed.id || `CLM-${Date.now().toString().slice(-6)}`;

          const { error: insertError } = await supabase
            .from("expense_claims")
            .insert({
              id: claimId,
              employee_id: submitEmployeeId,
              employee_name: employeeName,
              employee_department: employeeDept,
              title: parsed.merchant || "Expense",
              merchant: parsed.merchant || "Vendor",
              description: parsed.purpose || "",
              amount: Number(parsed.amount) || 0,
              currency: "INR",
              category,
              payment_method: paymentMethod,
              status: "SUBMITTED",
              report_name: parsed.report || "General",
              receipt_url: receiptUrl,
              receipt_name: receiptName,
              receipt_path: receiptPath,
              receipt_content_type: file?.type || null,
              receipt_size_bytes: file?.size || null,
              expense_date: parsed.date || new Date().toISOString().slice(0, 10),
              submitted_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Direct Supabase claim insertion error:", insertError);
            throw new Error(insertError.message);
          }

          await supabase
            .from("employee_expense_drafts")
            .delete()
            .eq("id", claimId)
            .eq("employee_id", submitEmployeeId);
          responseData = { id: claimId, status: "Pending" };
          }
        }
      }
    } catch (err) {
      console.error("New expense submission error:", err);
      responseData = {
        id: "error",
        status: "Failed",
        error: err instanceof Error ? err.message : "Error",
      };
    }
  } else {
    responseData = {};
  }

  return new Response(JSON.stringify(responseData), {
    status: responseStatus,
    headers: { "Content-Type": "application/json" },
  });
}

export async function employeeJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return (await employeeRequest(path, init)).json() as Promise<T>;
}
