import { supabase } from "./supabase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function employeeRequest(path: string, init: RequestInit = {}) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Your Employee session has expired. Please sign in again.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/employee${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${data.session.access_token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error("The Employee backend is unavailable. Please try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === "string" ? body.detail : "Employee request failed.");
  }
  return response;
}

export async function employeeJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  return (await employeeRequest(path, init)).json() as Promise<T>;
}
