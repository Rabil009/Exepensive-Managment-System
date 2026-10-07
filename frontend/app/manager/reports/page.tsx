import { redirect } from "next/navigation";

export default function ReportsRedirect() {
  redirect("/manager?view=Reports+%26+Audits");
}
