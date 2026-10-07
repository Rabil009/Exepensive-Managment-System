import { redirect } from "next/navigation";

export default function LoginPage() {
  const url = new URL(process.env.LOGIN_URL || "http://localhost:3000/");
  url.searchParams.set("portal", "employee");
  redirect(url.href);
}
