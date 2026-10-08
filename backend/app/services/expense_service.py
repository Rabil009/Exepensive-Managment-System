import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator
from uuid import uuid4

from app.schemas.expense import ExpenseInput, ExpenseRecord


DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data"


class ExpenseStore:
    """Local development storage for the Employee New Expense flow."""

    def __init__(self, database_path: Path | None = None, receipts_dir: Path | None = None):
        self.database_path = database_path or Path(
            os.getenv("EMPLOYEE_DB_PATH", str(DEFAULT_DATA_DIR / "employee.sqlite3"))
        )
        self.receipts_dir = receipts_dir or Path(
            os.getenv("EMPLOYEE_RECEIPTS_DIR", str(DEFAULT_DATA_DIR / "receipts"))
        )
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self.receipts_dir.mkdir(parents=True, exist_ok=True)
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS employee_expenses (
                    id TEXT PRIMARY KEY,
                    status TEXT NOT NULL CHECK (status IN ('Draft', 'Pending')),
                    payload TEXT NOT NULL,
                    receipt_name TEXT,
                    receipt_path TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    submitted_at TEXT
                )
                """
            )

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(self.database_path, timeout=10)
        connection.row_factory = sqlite3.Row
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).isoformat()

    @staticmethod
    def _record(row: sqlite3.Row) -> ExpenseRecord:
        return ExpenseRecord.model_validate(
            {
                **json.loads(row["payload"]),
                "id": row["id"],
                "status": row["status"],
                "receipt_name": row["receipt_name"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "submitted_at": row["submitted_at"],
            }
        )

    def create_draft(self, expense: ExpenseInput) -> ExpenseRecord:
        expense_id = str(uuid4())
        now = self._now()
        with self._connect() as connection:
            connection.execute(
                "INSERT INTO employee_expenses (id, status, payload, created_at, updated_at) "
                "VALUES (?, 'Draft', ?, ?, ?)",
                (expense_id, json.dumps(expense.model_dump(mode="json")), now, now),
            )
        return self.get(expense_id)

    def get(self, expense_id: str) -> ExpenseRecord | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM employee_expenses WHERE id = ?", (expense_id,)
            ).fetchone()
        return self._record(row) if row else None

    def list(self, status: str | None, limit: int, offset: int) -> list[ExpenseRecord]:
        query = "SELECT * FROM employee_expenses"
        parameters: list[str | int] = []
        if status:
            query += " WHERE status = ?"
            parameters.append(status)
        query += " ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?"
        parameters.extend((limit, offset))
        with self._connect() as connection:
            rows = connection.execute(query, parameters).fetchall()
        return [self._record(row) for row in rows]

    def update_draft(self, expense_id: str, expense: ExpenseInput) -> ExpenseRecord | None:
        with self._connect() as connection:
            cursor = connection.execute(
                "UPDATE employee_expenses SET payload = ?, updated_at = ? "
                "WHERE id = ? AND status = 'Draft'",
                (json.dumps(expense.model_dump(mode="json")), self._now(), expense_id),
            )
        return self.get(expense_id) if cursor.rowcount else None

    def submit(self, expense_id: str) -> ExpenseRecord | None:
        with self._connect() as connection:
            cursor = connection.execute(
                "UPDATE employee_expenses SET status = 'Pending', submitted_at = ?, updated_at = ? "
                "WHERE id = ? AND status = 'Draft'",
                (self._now(), self._now(), expense_id),
            )
        return self.get(expense_id) if cursor.rowcount else None

    def delete_draft(self, expense_id: str) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT receipt_path FROM employee_expenses WHERE id = ? AND status = 'Draft'",
                (expense_id,),
            ).fetchone()
            if not row:
                return False
            connection.execute(
                "DELETE FROM employee_expenses WHERE id = ? AND status = 'Draft'",
                (expense_id,),
            )
        if row["receipt_path"]:
            (self.receipts_dir / row["receipt_path"]).unlink(missing_ok=True)
        return True

    def attach_receipt(self, expense_id: str, name: str, content: bytes, suffix: str) -> ExpenseRecord | None:
        current = self.get(expense_id)
        if not current or current.status != "Draft":
            return None
        filename = f"{uuid4().hex}{suffix}"
        path = self.receipts_dir / filename
        path.write_bytes(content)
        with self._connect() as connection:
            previous = connection.execute(
                "SELECT receipt_path FROM employee_expenses WHERE id = ? AND status = 'Draft'",
                (expense_id,),
            ).fetchone()
            cursor = connection.execute(
                "UPDATE employee_expenses SET receipt_name = ?, receipt_path = ?, updated_at = ? "
                "WHERE id = ? AND status = 'Draft'",
                (name, filename, self._now(), expense_id),
            )
        if not cursor.rowcount:
            path.unlink(missing_ok=True)
            return None
        if previous and previous["receipt_path"]:
            (self.receipts_dir / previous["receipt_path"]).unlink(missing_ok=True)
        return self.get(expense_id)

    def receipt(self, expense_id: str) -> tuple[Path, str] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT receipt_path, receipt_name FROM employee_expenses WHERE id = ?",
                (expense_id,),
            ).fetchone()
        if not row or not row["receipt_path"]:
            return None
        path = self.receipts_dir / row["receipt_path"]
        return (path, row["receipt_name"]) if path.is_file() else None
