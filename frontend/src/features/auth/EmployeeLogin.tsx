import { useEffect } from "react";

export default function EmployeeLogin() {
  useEffect(() => {
    const url = new URL(
      import.meta.env.VITE_LOGIN_URL || "http://localhost:3000/",
    );
    url.searchParams.set("portal", "employee");
    window.location.replace(url.href);
  }, []);

  return (
    <div className="aura-loading" role="status">
      Opening Employee sign in...
    </div>
  );
}
