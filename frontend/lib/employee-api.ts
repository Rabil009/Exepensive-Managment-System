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

export function fileToDataUrl(file: File | Blob): Promise<string> {
  if (typeof FileReader !== "undefined") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
  return file.arrayBuffer().then((buf) => {
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const mime = (file as any).type || "application/octet-stream";
    return `data:${mime};base64,${btoa(binary)}`;
  });
}

export async function employeeRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { data: sessionData } = await supabase.auth.getSession();
  let token = sessionData?.session?.access_token || "";
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("payout_employee_token") || "";
  }
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

        const pendingClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Pending"
        );
        const approvedClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Approved"
        );
        const reimbursedClaims = claims.filter(
          (c: any) => normalizeClaimStatus(c.status) === "Reimbursed"
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

        const draftsList = (rawDrafts || []).map((d: any) => ({
          id: d.id,
          date: d.expense_date || (d.updated_at || "").slice(0, 10),
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
        }));

        const claimsList = claims.map((c: any) => ({
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
          receiptUrl: c.receipt_url || null,
          employee_name: c.employee_name || null,
          currency: c.currency || "INR",
          report: c.report_name || "General",
          paymentMethod: (c.payment_method || "")
            .toUpperCase()
            .includes("CORPORATE")
            ? "Corporate Card"
            : "Personal (Out-of-Pocket)",
          attendees: c.attendees || [],
          manager_remark: c.manager_remark || null,
          finance_remark: c.finance_remark || null,
        }));

        responseData = {
          expenses: [...claimsList, ...draftsList].sort((a: any, b: any) =>
            (b.date || "").localeCompare(a.date || "")
          ),
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

          // Sort cards: PHYSICAL card is always primary at index 0
          cards.sort((a: any, b: any) => {
            if (a.kind === "PHYSICAL" && b.kind !== "PHYSICAL") return -1;
            if (b.kind === "PHYSICAL" && a.kind !== "PHYSICAL") return 1;
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });

          // Fetch card transactions
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
          const requests = dbReqs || [];

          // Fetch corporate card expense claims for this employee
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
          const { data: dbClaims } = await claimsQuery;
          const corporateClaims = (dbClaims || []).filter(
            (c: any) =>
              (c.payment_method || "").toUpperCase().includes("CORPORATE") &&
              !normalizeClaimStatus(c.status).toLowerCase().includes("reject")
          );

          // Check if there is an approved limit increase request for this employee
          const approvedLimitReq = requests.find(
            (r: any) =>
              (r.status || "").toUpperCase() === "APPROVED" &&
              r.request_type === "LIMIT_INCREASE"
          );

          const primaryCard = cards[0];
          let cardLimit = Number(primaryCard?.monthly_limit) || 100000;
          if (
            approvedLimitReq &&
            Number(approvedLimitReq.requested_limit) > cardLimit
          ) {
            cardLimit = Number(approvedLimitReq.requested_limit);
            if (primaryCard) {
              primaryCard.monthly_limit = String(cardLimit);
            }
          }

          // Calculate category spending dynamically
          let softwareSpent = 0;
          let travelSpent = 0;
          let mealsSpent = 0;
          let officeSpent = 0;

          const categorizeAmount = (cat: string, amt: number) => {
            const c = (cat || "").toUpperCase();
            if (
              c.includes("SOFTWARE") ||
              c.includes("CLOUD") ||
              c.includes("SAAS") ||
              c.includes("TECH") ||
              c.includes("IT")
            ) {
              softwareSpent += amt;
            } else if (
              c.includes("TRAVEL") ||
              c.includes("TRANSIT") ||
              c.includes("FLIGHT") ||
              c.includes("CAB") ||
              c.includes("UBER") ||
              c.includes("HOTEL") ||
              c.includes("LODGING")
            ) {
              travelSpent += amt;
            } else if (
              c.includes("MEAL") ||
              c.includes("FOOD") ||
              c.includes("DINING") ||
              c.includes("BEVERAGE")
            ) {
              mealsSpent += amt;
            } else if (
              c.includes("OFFICE") ||
              c.includes("EQUIPMENT") ||
              c.includes("HARDWARE") ||
              c.includes("SUPPLIES") ||
              c.includes("FURNITURE")
            ) {
              officeSpent += amt;
            } else {
              softwareSpent += amt;
            }
          };

          // Tally from card transactions
          transactions
            .filter((t: any) => t.status !== "DECLINED")
            .forEach((t: any) => {
              categorizeAmount(
                t.category || t.purpose || "",
                Number(t.amount) || 0
              );
            });

          // Tally from corporate card claims (deduplicating if any ID overlaps)
          const txnIds = new Set(transactions.map((t: any) => t.id));
          corporateClaims.forEach((c: any) => {
            if (!txnIds.has(c.id)) {
              categorizeAmount(c.category || "", Number(c.amount) || 0);
            }
          });

          const totalSpent =
            softwareSpent + travelSpent + mealsSpent + officeSpent;

          // Standard 4 category limits matching SpendingLimits component
          const softwareLimit = Math.round(cardLimit * 0.35);
          const travelLimit = Math.round(cardLimit * 0.35);
          const mealsLimit = Math.round(cardLimit * 0.15);
          const officeLimit = Math.round(cardLimit * 0.15);

          const categories = [
            {
              category: "SOFTWARE",
              name: "Software & Cloud",
              spent: String(softwareSpent),
              limit: String(softwareLimit),
              remaining: String(Math.max(0, softwareLimit - softwareSpent)),
            },
            {
              category: "TRAVEL",
              name: "Travel & Transit",
              spent: String(travelSpent),
              limit: String(travelLimit),
              remaining: String(Math.max(0, travelLimit - travelSpent)),
            },
            {
              category: "MEALS",
              name: "Meals & Dining",
              spent: String(mealsSpent),
              limit: String(mealsLimit),
              remaining: String(Math.max(0, mealsLimit - mealsSpent)),
            },
            {
              category: "OFFICE",
              name: "Office & Equipment",
              spent: String(officeSpent),
              limit: String(officeLimit),
              remaining: String(Math.max(0, officeLimit - officeSpent)),
            },
          ];

          // Map corporate claims to transactions list for card transactions display
          const mappedClaimTransactions = corporateClaims
            .filter((c: any) => !txnIds.has(c.id))
            .map((c: any) => ({
              id: c.id,
              card_id: primaryCard?.id || "",
              transaction_date:
                c.expense_date || (c.created_at || "").slice(0, 10),
              merchant: c.merchant || c.title || "Corporate Expense",
              purpose: c.description || c.title || "Business Expense",
              amount: String(c.amount || 0),
              currency: c.currency || "INR",
              status:
                normalizeClaimStatus(c.status) === "Rejected"
                  ? "DECLINED"
                  : "SETTLED",
              category: c.category || "SOFTWARE",
            }));

          const allTransactions = [...transactions, ...mappedClaimTransactions];
          allTransactions.sort((a: any, b: any) =>
            (b.transaction_date || "").localeCompare(a.transaction_date || "")
          );

          responseData = {
            cards,
            transactions: allTransactions,
            requests,
            usage: {
              month: new Date().toISOString().slice(0, 7),
              cards: cards.map((c: any) => {
                const cLimit = Number(c.monthly_limit) || 100000;
                return {
                  id: c.id,
                  spent: String(totalSpent),
                  limit: String(cLimit),
                  remaining: String(Math.max(0, cLimit - totalSpent)),
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

        const approval_counts = {
          approved: targetClaims.filter((c: any) =>
            ["APPROVED", "MANAGER_APPROVED", "FINANCE_APPROVED", "PAID", "DISBURSED"].includes(
              (c.status || "").toUpperCase()
            )
          ).length,
          rejected: targetClaims.filter((c: any) =>
            (c.status || "").toUpperCase().includes("REJECT")
          ).length,
          pending: targetClaims.filter((c: any) =>
            ["SUBMITTED", "PENDING", "AWAITING"].includes((c.status || "").toUpperCase())
          ).length,
        };

        responseData = {
          month: monthParam,
          currency: "INR",
          approval_counts,
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
                description: c.description || "",
                category: c.category,
                amount: Number(c.amount) || 0,
                status: normalizeClaimStatus(c.status),
                currency: c.currency || "INR",
                receipt: c.receipt_name || null,
                receiptUrl: c.receipt_url || null,
                employee_name: c.employee_name || null,
                paymentMethod: (c.payment_method || "")
                  .toUpperCase()
                  .includes("CORPORATE")
                  ? "Corporate Card"
                  : "Personal (Out-of-Pocket)",
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
        unlinked_transactions: [],
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
        unlinked_transactions: [],
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
          let submitEmployeeId = employeeId;
          if (!submitEmployeeId || submitEmployeeId.includes("@")) {
            // Find an existing UUID from profiles or previous claims
            const { data: matched } = await supabase
              .from("expense_claims")
              .select("employee_id")
              .ilike("employee_name", employeeName)
              .limit(1)
              .maybeSingle();

            submitEmployeeId =
              matched?.employee_id ||
              (authUser?.id as string) ||
              "b8ce7a2d-e91a-47f4-92ba-adb7d0bf5c4d";
          }

          const action = init.body.get("action");
          const effectiveEmpId =
            submitEmployeeId ||
            authUser?.id ||
            "7881beaf-b8ab-4600-afd8-4543deb2a24b";

          let receiptUrl: string | null = null;
          let receiptName: string | null = null;

          if (file && file.size > 0) {
            receiptName = file.name;
            try {
              // Guaranteed data URL fallback
              const dataUrl = await fileToDataUrl(file);
              receiptUrl = dataUrl;

              // Upload to storage bucket under employee folder to satisfy RLS
              const fileExt = file.name.split('.').pop() || 'png';
              const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
              const filePath = `${effectiveEmpId}/${Date.now()}_${cleanName}`;
              const { error: uploadError } = await supabase.storage
                .from("receipts")
                .upload(filePath, file, { contentType: file.type || "image/png", upsert: true });

              if (!uploadError) {
                const { data: publicData } = supabase.storage.from("receipts").getPublicUrl(filePath);
                if (publicData?.publicUrl) {
                  receiptUrl = publicData.publicUrl;
                }
              }
            } catch (convErr) {
              console.warn("Receipt upload notice:", convErr);
            }
          }

          if (action === "Draft") {
            const { data: existingDraft } = await supabase
              .from("employee_expense_drafts")
              .select("receipt_name,receipt_content_type,receipt_size_bytes")
              .eq("id", parsed.id)
              .eq("employee_id", effectiveEmpId)
              .maybeSingle();
            const draftRow = {
              id: parsed.id,
              employee_id: effectiveEmpId,
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

          let finalEmpName = employeeName;
          if (!finalEmpName || finalEmpName === "Employee") {
            if (authUser?.user_metadata?.name) {
              finalEmpName = authUser.user_metadata.name;
            } else if (typeof window !== "undefined") {
              finalEmpName =
                localStorage.getItem("payout_user_name") ||
                localStorage.getItem("payout_user_email")?.split("@")[0] ||
                "Employee";
            }
          }

          const nowIso = new Date().toISOString();

          const { error: insertError } = await supabase
            .from("expense_claims")
            .insert({
              id: claimId,
              employee_id: effectiveEmpId,
              employee_name: finalEmpName,
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
              receipt_content_type: file?.type || null,
              receipt_size_bytes: file?.size || null,
              expense_date: parsed.date || nowIso.slice(0, 10),
              submitted_at: nowIso,
              created_at: nowIso,
            });

          if (insertError) {
            console.error("Direct Supabase claim insertion error:", insertError);
            throw new Error(insertError.message);
          }

          // Delete from drafts if it was previously saved
          await supabase
            .from("employee_expense_drafts")
            .delete()
            .eq("id", claimId)
            .eq("employee_id", effectiveEmpId);

          // Also sync to FastAPI backend if available
          if (apiUrl) {
            try {
              const fd = new FormData();
              fd.set("action", "Submit");
              fd.set("data", JSON.stringify({
                id: claimId,
                merchant: parsed.merchant,
                date: parsed.date,
                amount: String(parsed.amount || "0"),
                category,
                report: parsed.report,
                payment_method: paymentMethod,
                purpose: parsed.purpose,
                attendees: parsed.attendees || [],
                receipt_name: receiptName,
                receipt_url: receiptUrl,
              }));
              if (file) fd.set("file", file);
              await fetch(`${apiUrl}/api/employee/new-expense`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
              });
            } catch {}
          }

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
  }

  // RECEIPT DOWNLOAD: Serve receipt directly from Supabase
  else if (path.startsWith("/new-expense/receipts/")) {
    const expenseId = path.replace("/new-expense/receipts/", "");
    try {
      const { data } = await supabase
        .from("expense_claims")
        .select("receipt_url, receipt_name, receipt_content_type")
        .eq("id", expenseId)
        .maybeSingle();

      if (data?.receipt_url && data.receipt_url.startsWith("data:")) {
        const parts = data.receipt_url.split(",");
        const header = parts[0];
        const base64 = parts[1];
        const mime = header.split(";")[0].replace("data:", "") || "application/octet-stream";
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new Response(bytes, {
          status: 200,
          headers: {
            "Content-Type": mime,
            "Content-Disposition": `attachment; filename="${data.receipt_name || "receipt"}"`,
          },
        });
      } else if (data?.receipt_url && data.receipt_url.startsWith("http")) {
        const fetchRes = await fetch(data.receipt_url);
        if (fetchRes.ok) return fetchRes;
      }
    } catch (err) {
      console.warn("Receipt fetch error:", err);
    }
    return new Response(new Uint8Array(0), { status: 404 });
  }

  // CLAIM UPDATE / ATTACH RECEIPT: Patch existing claim with receipt
  else if (path.startsWith("/new-expense/claims/") && init.method === "PATCH") {
    const expenseId = path.replace("/new-expense/claims/", "");
    try {
      if (init.body instanceof FormData) {
        const file = init.body.get("file") as File | null;
        const report = init.body.get("report") as string | null;
        const patch: Record<string, any> = {};

        if (report) {
          patch.report_name = report;
        }

        if (file && file.size > 0) {
          patch.receipt_name = file.name;
          patch.receipt_content_type = file.type || null;
          patch.receipt_size_bytes = file.size;

          try {
            patch.receipt_url = await fileToDataUrl(file);
          } catch (b64Err) {
            console.warn("Patch receipt base64 error:", b64Err);
          }
        }

        if (Object.keys(patch).length > 0) {
          await supabase.from("expense_claims").update(patch).eq("id", expenseId);
        }

        responseData = { id: expenseId, status: "Updated" };
      }
    } catch (err) {
      responseData = { id: expenseId, status: "Error", error: String(err) };
    }
  } else {
    responseData = {};
  }

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function employeeJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  return (await employeeRequest(path, init)).json() as Promise<T>;
}
