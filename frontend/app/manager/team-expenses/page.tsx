import { redirect } from "next/navigation";

export default function TeamExpensesRedirect() {
  redirect("/manager?view=Team+Spend+%26+Cost+Centers");
}
