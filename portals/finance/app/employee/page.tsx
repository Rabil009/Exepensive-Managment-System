import { redirect } from "next/navigation";

export default function EmployeePortalPage() {
  redirect(
    process.env.EMPLOYEE_PORTAL_URL ||
      "http://127.0.0.1:5173/employee/dashboard",
  );
}
