import { Badge } from "../Badge/badge";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={`status-badge status-${status.toLowerCase()}`}>
      {status}
    </Badge>
  );
}
