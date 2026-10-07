import { redirect } from "next/navigation";

export default function PoliciesRedirect() {
  redirect("/manager?view=Corporate+Policies");
}
