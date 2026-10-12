import { supabase } from "./supabase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function normalizeClaimStatus(rawStatus?: string): "Pending" | "Approved" | "Reimbursed" | "Rejected" | "Draft" {
  const s = (rawStatus || "").toUpperCase().trim();
  if (s === "PAID" || s === "DISBURSED" || s === "CLOSED" || s === "SETTLED" || s.includes("REIMBURS")) {
    return "Reimbursed";
  }
  if (s.includes("REJECT")) {
    return "Rejected";
  }
  if (s === "DRAFT") {
    return "Draft";
  }
  if (s === "FINANCE_APPROVED" || s === "PAYMENT_PENDING" || s === "APPROVED") {
    return "Approved";
  }
  if (s === "MANAGER_APPROVED" || s === "SUBMITTED" || s === "PENDING" || s.includes("PEND") || s.includes("SUBMIT")) {
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

      return {
        id: userId,
        name: profile?.name || authUser?.user_metadata?.name || userEmail.split("@")[0] || "Employee",
        email: profile?.email || userEmail,
        department: profile?.department || authUser?.user_metadata?.department || "Engineering",
      };
    }

    if (userEmail) {
      const cleanEmail = userEmail.trim().toLowerCase();
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, email, department")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile) {
        return {
          id: profile.id,
          name: profile.name || cleanEmail.split("@")[0],
          email: profile.email || cleanEmail,
          department: profile.department || "Engineering",
        };
      }

      const storedName = typeof window !== "undefined" ? localStorage.getItem("payout_user_name") : null;
      return {
        id: cleanEmail,
        name: storedName || cleanEmail.split("@")[0],
        email: cleanEmail,
        department: "Engineering",
      };
    }
  } catch (err) {
    console.warn("Failed resolving current employee:", err);
  }

  return null;
}

export async function employeeRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token || "";
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

  // OVERVIEW: Real claims & dynamic summary metrics (STRICTLY ISOLATED BY EMPLOYEE)
  if (path.startsWith("/overview")) {
    try {
      if (!employeeId) {
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
        const { data: rawClaims, error } = await supabase
          .from("expense_claims")
          .select("*")
          .eq("employee_id", employeeId)
          .order("created_at", { ascending: false });

        const claims = (!error && rawClaims) ? rawClaims : [];

        const pendingClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Pending"
        );
        const approvedClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Approved"
        );
        const reimbursedClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Reimbursed"
        );
        const cardClaims = claims.filter(
          (c: any) => (c.payment_method || "").toUpperCase().includes("CORPORATE")
        );

        const pendingAmount = pendingClaims.reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0);
        const approvedAmount = approvedClaims.reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0);
        const cardSpent = cardClaims.reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0);
        const cardLimit = 100000;

        responseData = {
          expenses: claims.map((c: any) => ({
            id: c.id,
            date: c.expense_date || (c.created_at || "").slice(0, 10),
            merchant: c.merchant || c.title || "Expense",
            category: c.category || "OTHER",
            amount: Number(c.amount) || 0,
            status: normalizeClaimStatus(c.status),
            raw_status: c.status || "SUBMITTED",
            source: "claim",
            description: c.description || "",
            receipt: c.receipt_name || null,
            currency: c.currency || "INR",
            report: c.report_name || "General",
            paymentMethod: (c.payment_method || "").toUpperCase().includes("CORPORATE") ? "Corporate Card" : "Personal (Out-of-Pocket)",
            attendees: c.attendees || [],
          })),
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

  // CARDS: Real cards & transactions from Supabase (STRICTLY ISOLATED BY EMPLOYEE)
  else if (path.startsWith("/cards")) {
    try {
      if (!employeeId) {
        responseData = {
          cards: [],
          transactions: [],
          requests: [],
          usage: { month: new Date().toISOString().slice(0, 7), cards: [], categories: [] },
        };
      } else {
        // 1. POST /cards/requests (Create Virtual Card or Request Limit Increase)
        if (path.startsWith("/cards/requests") && init.method === "POST") {
          let bodyData: any = {};
          if (typeof init.body === "string") {
            bodyData = JSON.parse(init.body);
          }

          if (bodyData.request_type === "VIRTUAL_CARD") {
            const cardName = bodyData.card_name || `${employeeName} - Virtual Card`;
            const requestedLimit = Number(bodyData.requested_limit) || 50000;

            // Submit as PENDING so Manager & Finance can review and authorize it (NO AUTO-APPROVAL)
            const { data: newReq, error: reqErr } = await supabase
              .from("employee_card_requests")
              .insert({
                employee_id: employeeId,
                card_id: null,
                request_type: "VIRTUAL_CARD",
                card_name: cardName,
                requested_limit: requestedLimit,
                status: "PENDING",
              })
              .select()
              .single();

            if (reqErr) {
              console.error("Card request insert error:", reqErr);
              throw new Error(reqErr.message);
            }

            responseData = { success: true, pending: true, request: newReq };
          } else if (bodyData.request_type === "LIMIT_INCREASE") {
            const requestedLimit = Number(bodyData.requested_limit) || 150000;
            const cardId = bodyData.card_id;

            // Submit as PENDING so Manager & Finance can review and authorize it (NO AUTO-APPROVAL)
            const { data: newReq, error: reqErr } = await supabase
              .from("employee_card_requests")
              .insert({
                employee_id: employeeId,
                card_id: cardId || null,
                request_type: "LIMIT_INCREASE",
                card_name: `${employeeName} - Limit Increase`,
                requested_limit: requestedLimit,
                status: "PENDING",
              })
              .select()
              .single();

            if (reqErr) {
              console.error("Limit request insert error:", reqErr);
              throw new Error(reqErr.message);
            }

            responseData = { success: true, pending: true, request: newReq };
          }
        }

        // 2. PATCH /cards/:id (Update Card Controls: freeze, active, channels)
        else if (init.method === "PATCH") {
          const segments = path.split("/");
          const cardId = segments[segments.length - 1];
          let patchData: any = {};
          if (typeof init.body === "string") {
            patchData = JSON.parse(init.body);
          }

          const updatePayload: any = {
            updated_at: new Date().toISOString(),
          };
          if (typeof patchData.active === "boolean") updatePayload.active = patchData.active;
          if (typeof patchData.frozen === "boolean") updatePayload.frozen = patchData.frozen;
          if (typeof patchData.wallet_enabled === "boolean") updatePayload.wallet_enabled = patchData.wallet_enabled;
          if (typeof patchData.travel_limits_enabled === "boolean") updatePayload.travel_limits_enabled = patchData.travel_limits_enabled;
          if (typeof patchData.online_verification_enabled === "boolean") updatePayload.online_verification_enabled = patchData.online_verification_enabled;
          if (typeof patchData.atm_lock_enabled === "boolean") updatePayload.atm_lock_enabled = patchData.atm_lock_enabled;

          const { data: updatedCard } = await supabase
            .from("employee_cards")
            .update(updatePayload)
            .eq("id", cardId)
            .eq("employee_id", employeeId)
            .select()
            .maybeSingle();

          responseData = updatedCard || { id: cardId, ...patchData };
        }

        // 3. GET /cards (Load all cards, usage metrics, and transactions for this employee)
        else {
          let { data: dbCards } = await supabase
            .from("employee_cards")
            .select("*")
            .eq("employee_id", employeeId)
            .order("created_at", { ascending: false });

          let cards = dbCards || [];

          // If no cards exist for this employee, auto-provision an active corporate card in their name
          if (cards.length === 0) {
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

          // Fetch requests for this employee
          const { data: dbReqs } = await supabase
            .from("employee_card_requests")
            .select("*")
            .eq("employee_id", employeeId)
            .order("created_at", { ascending: false });

          const primaryCard = cards[0];
          const cardLimit = Number(primaryCard?.monthly_limit) || 100000;

          // Calculate card spending strictly for this employee
          const spent = transactions
            .filter((t: any) => t.status !== "DECLINED")
            .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

          // Group categories strictly for this employee
          const catMap: Record<string, number> = {};
          transactions.forEach((t: any) => {
            const cat = (t.category || "OTHER").toUpperCase();
            catMap[cat] = (catMap[cat] || 0) + (Number(t.amount) || 0);
          });

          const categories = Object.entries(catMap).map(([cat, amt]) => {
            const catLimit = Math.max(15000, Math.round(cardLimit * 0.35));
            return {
              category: cat,
              name: cat.charAt(0) + cat.slice(1).toLowerCase(),
              spent: String(amt),
              limit: String(catLimit),
              remaining: String(Math.max(0, catLimit - amt)),
            };
          });

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
              categories: categories.length > 0 ? categories : [
                { category: "SOFTWARE", name: "Software", spent: "0", limit: "35000", remaining: "35000" },
                { category: "TRAVEL", name: "Travel", spent: "0", limit: "35000", remaining: "35000" },
                { category: "MEALS", name: "Meals", spent: "0", limit: "15000", remaining: "15000" },
              ],
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
        usage: { month: new Date().toISOString().slice(0, 7), cards: [], categories: [] },
      };
    }
  }

  // ANALYTICS: Dynamic calculation from real expense claims (STRICTLY ISOLATED BY EMPLOYEE)
  else if (path.startsWith("/analytics")) {
    try {
      if (!employeeId) {
        responseData = { totals: { total_spend: "0", pending_approval: "0", reimbursed: "0", corporate_card_spend: "0" }, categories: [] };
      } else {
        const { data: claims } = await supabase
          .from("expense_claims")
          .select("*")
          .eq("employee_id", employeeId);

        const allClaims = claims || [];

        const totalSpend = allClaims.reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const pendingApproval = allClaims
          .filter((c: any) => normalizeClaimStatus(c.status) === "Pending")
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const reimbursed = allClaims
          .filter((c: any) => normalizeClaimStatus(c.status) === "Reimbursed")
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);
        const corporateSpend = allClaims
          .filter((c: any) => (c.payment_method || "").toUpperCase().includes("CORPORATE"))
          .reduce((acc: number, c: any) => acc + (Number(c.amount) || 0), 0);

        // Group by category
        const catMap: Record<string, number> = {};
        allClaims.forEach((c: any) => {
          const cat = c.category || "OTHER";
          catMap[cat] = (catMap[cat] || 0) + (Number(c.amount) || 0);
        });
        const categories = Object.entries(catMap).map(([name, amount]) => ({ name, amount: String(amount) }));

        // Find largest
        const sorted = [...allClaims].sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
        const largest = sorted[0];

        responseData = {
          month: new Date().toISOString().slice(0, 7),
          currency: "INR",
          totals: {
            total_spend: String(totalSpend),
            pending_approval: String(pendingApproval),
            reimbursed: String(reimbursed),
            corporate_card_spend: String(corporateSpend),
          },
          categories,
          daily_spend: allClaims.slice(0, 7).map((c: any) => ({
            date: c.expense_date || (c.created_at || "").slice(0, 10),
            amount: String(c.amount),
          })),
          weekly_spend: [{ week: "This Month", amount: String(totalSpend) }],
          funding: { corporate: String(corporateSpend), personal: String(Math.max(0, totalSpend - corporateSpend)) },
          receipt_compliance: {
            attached: allClaims.filter((c: any) => Boolean(c.receipt_url || c.receipt_name)).length,
            total: allClaims.length,
          },
          largest_expense: largest ? {
            merchant: largest.merchant || largest.title,
            date: largest.expense_date || (largest.created_at || "").slice(0, 10),
            amount: Number(largest.amount),
            currency: "INR",
          } : null,
          cards: [],
        };
      }
    } catch {
      responseData = { totals: { total_spend: "0", pending_approval: "0", reimbursed: "0", corporate_card_spend: "0" }, categories: [] };
    }
  }

  // REPORTS: Real reports grouped from Supabase (STRICTLY ISOLATED BY EMPLOYEE)
  else if (path.startsWith("/reports")) {
    try {
      if (!employeeId) {
        responseData = { reports: [] };
      } else {
        const { data: claims } = await supabase
          .from("expense_claims")
          .select("*")
          .eq("employee_id", employeeId);

        const allClaims = claims || [];

        const reportGroups: Record<string, any[]> = {};
        allClaims.forEach((c: any) => {
          const rName = c.report_name || "General";
          if (!reportGroups[rName]) reportGroups[rName] = [];
          reportGroups[rName].push({
            id: c.id,
            date: c.expense_date || (c.created_at || "").slice(0, 10),
            merchant: c.merchant || c.title,
            category: c.category,
            amount: Number(c.amount) || 0,
            status: normalizeClaimStatus(c.status),
            currency: c.currency || "INR",
          });
        });

        responseData = {
          reports: Object.entries(reportGroups).map(([name, items]) => ({
            name,
            items,
            workflow_stage: "MANAGER_REVIEW",
            can_withdraw: true,
            can_submit: false,
          })),
        };
      }
    } catch {
      responseData = { reports: [] };
    }
  }

  // NEW EXPENSE OPTIONS: Load categories from Supabase policies
  else if (path.startsWith("/new-expense/options")) {
    try {
      const { data: policies } = await supabase.from("expense_policies").select("category");
      const dbCategories = policies?.map((p: any) => p.category) || [];
      responseData = {
        categories: dbCategories.length > 0 ? dbCategories : ["TRAVEL", "MEALS", "SOFTWARE", "HARDWARE", "OFFICE", "HOTEL", "TRAINING", "OTHER"],
        reports: ["Q4 Operations", "Client Visit", "General", "Conference 2026"],
        unlinked_transactions: [],
      };
    } catch {
      responseData = {
        categories: ["TRAVEL", "MEALS", "SOFTWARE", "HARDWARE", "OFFICE", "HOTEL", "TRAINING", "OTHER"],
        reports: ["General"],
        unlinked_transactions: [],
      };
    }
  }

  // NEW EXPENSE SUBMIT: Real Supabase Storage + Database Insertion (ATTACHED TO THIS EMPLOYEE)
  else if (path.startsWith("/new-expense") && init.method === "POST") {
    try {
      if (init.body instanceof FormData) {
        const rawData = init.body.get("data");
        const file = init.body.get("file") as File | null;
        if (typeof rawData === "string") {
          const parsed = JSON.parse(rawData);

          const submitEmployeeId = employeeId || "7881beaf-b8ab-4600-afd8-4543deb2a24b";
          let receiptUrl: string | null = null;
          let receiptName: string | null = null;

          // Real Receipt Upload to Supabase Storage 'receipts' Bucket isolated by employee
          if (file && file.size > 0 && submitEmployeeId) {
            try {
              const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
              const filePath = `${submitEmployeeId}/${Date.now()}-${safeName}`;
              const { error: uploadError } = await supabase.storage
                .from("receipts")
                .upload(filePath, file, { upsert: true });

              if (!uploadError) {
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

          // Category mapping conforming to schema check constraint
          const rawCat = (parsed.category || "OTHER").toUpperCase();
          const validCategories = ["TRAVEL", "MEALS", "SOFTWARE", "HARDWARE", "OFFICE", "TRAINING", "HOTEL", "OTHER"];
          let category = validCategories.includes(rawCat) ? rawCat : "OTHER";
          if (rawCat.includes("FOOD") || rawCat.includes("DIN")) category = "MEALS";
          if (rawCat.includes("HOTEL") || rawCat.includes("STAY")) category = "HOTEL";
          if (rawCat.includes("TRAVEL") || rawCat.includes("FLIGHT") || rawCat.includes("UBER") || rawCat.includes("CAB")) category = "TRAVEL";

          // Payment method mapping
          const rawPm = (parsed.payment_method || "").toUpperCase();
          let paymentMethod = "PERSONAL_CARD";
          if (rawPm.includes("CORPORATE") || rawPm.includes("CARD")) paymentMethod = "CORPORATE_CARD";
          else if (rawPm.includes("UPI")) paymentMethod = "PERSONAL_UPI";
          else if (rawPm.includes("CASH")) paymentMethod = "PERSONAL_CASH";

          const claimId = `CLM-${Date.now().toString().slice(-6)}`;

          const { error: insertError } = await supabase.from("expense_claims").insert({
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
            expense_date: parsed.date || new Date().toISOString().slice(0, 10),
            submitted_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error("Direct Supabase claim insertion error:", insertError);
            throw new Error(insertError.message);
          }

          responseData = { id: claimId, status: "Pending" };
        }
      }
    } catch (err) {
      console.error("New expense submission error:", err);
      responseData = { id: "error", status: "Failed", error: err instanceof Error ? err.message : "Error" };
    }
  } else {
    responseData = {};
  }

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function employeeJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  return (await employeeRequest(path, init)).json() as Promise<T>;
}
