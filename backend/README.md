# Employee New Expense API

This first backend slice supports local Employee expense drafts, receipt uploads,
submission, listing, and draft deletion. It does not change the Employee UI and
does not connect to Finance or Manager flows.

Authentication is a later phase. To avoid exposing unauthenticated expense data,
these routes require both `ENVIRONMENT=development` and
`EMPLOYEE_DEMO_API_ENABLED=true`. They return HTTP 503 otherwise. Data is stored in
`backend/data/` by default and is local to this development machine.

From `backend/`:

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The API is documented at `http://127.0.0.1:8000/docs`. The Employee routes are:

- `POST /api/employee/expenses/drafts` — create a draft.
- `GET /api/employee/expenses` — list drafts and submitted expenses.
- `GET /api/employee/expenses/{id}` — read one expense.
- `PUT /api/employee/expenses/{id}` — replace a draft's fields.
- `POST /api/employee/expenses/{id}/receipt` — attach a PDF, PNG, JPG, or HEIC (25 MB max).
- `GET /api/employee/expenses/{id}/receipt` — download its receipt.
- `POST /api/employee/expenses/{id}/submit` — submit a complete draft.
- `DELETE /api/employee/expenses/{id}` — discard a draft.

Run focused tests with `.venv/Scripts/python.exe -m pytest -q tests/test_expenses.py`.

## Supabase Employee New Expense

The New Expense page now calls `POST /api/employee/new-expense` on Save Draft or
Submit Expense. The route writes drafts to `employee_expense_drafts`, submitted
expenses to `expense_claims`, and optional receipt files to the private Supabase
`receipts` bucket. `GET /api/employee/new-expense/{id}` reloads an owned draft;
`DELETE /api/employee/new-expense/{id}` discards it. The previous SQLite demo
routes above remain separate.
`GET /api/employee/new-expense/options` lists real Employee report names and
unlinked card transactions. `GET /api/employee/new-expense/receipts/{id}`
downloads an owned receipt from the private bucket. A linked transaction must
belong to the Employee and match the expense amount and INR currency.

Every Supabase request needs a valid Employee Supabase access token in the
`Authorization: Bearer <token>` header. The backend verifies the user and
Employee profile, then forwards the same token so Supabase row security checks
the owner. A publishable key is sufficient; do not put a service role key in
the browser. On the existing Payout login page, selecting Employee Portal uses
Supabase Auth email/password. It checks the `profiles` table for the Employee
role before opening Employee pages. The existing login form sends Employee
email/password to `POST /api/auth/employee/login`. The backend checks Supabase
Auth and the Employee profile before returning a session. Account creation uses
`/api/auth/employee/signup`.
New Employee accounts must confirm their email if Supabase requires it. Save Draft and Submit Expense
then use that session to write to Supabase.

Run the Supabase route tests with
`.venv/Scripts/python.exe -m pytest -q tests/test_supabase_new_expense.py`.

## Employee Workspace API

All routes below require `Authorization: Bearer <employee Supabase access token>`.
The backend verifies the user and Employee role; Supabase row security limits
reads and writes to that Employee's records.

- `GET /api/employee/overview` returns owned claims, drafts, and summary totals.
- `GET /api/employee/analytics?month=YYYY-MM` returns monthly spend, category,
  daily trend, funding, receipt compliance, and assigned card metrics.
- `GET /api/employee/reports` groups owned claims and drafts by report name.
- `POST /api/employee/reports/action` withdraws a fully submitted report or
  resubmits a fully withdrawn one. Body: `{"name":"Trip","action":"withdraw"}`.
- `GET /api/employee/cards` returns assigned cards, card transactions, card
  requests, and monthly card/category limit usage.
- `PATCH /api/employee/cards/{id}` updates an assigned card's app controls.
- `POST /api/employee/cards/requests` stores a limit increase or virtual card
  request. It does **not** change an issuer limit or issue a real card.

Card and transaction tables start empty. Only an issuer/admin integration can
provision cards and transactions; the Employee cannot fabricate those records.
The existing Finance and Manager APIs are separate.

Run focused tests with
`.venv/Scripts/python.exe -m pytest -q tests/test_employee_workspace.py`.
