# Employee Backend

The Employee backend uses the connected Supabase project for authentication,
expenses, cards, analytics, and reports. The local SQLite expense demo has been
removed. Finance and Manager APIs are separate.

From `backend/`:

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The API is documented at `http://127.0.0.1:8000/docs`.

## Authentication

The existing Payout login form sends Employee email/password to
`POST /api/auth/employee/login`. The backend checks Supabase Auth and the
Employee profile before returning a session. Account creation uses
`POST /api/auth/employee/signup`; confirmed accounts can sign in. The
`GET /api/auth/employee/me` route verifies an existing session.

## New Expense

The New Expense page calls `POST /api/employee/new-expense` on Save Draft or
Submit Expense. Drafts are stored in `employee_expense_drafts`, submitted
expenses in `expense_claims`, and optional receipts in the private `receipts`
bucket. `GET /api/employee/new-expense/{id}` reloads an owned draft;
`DELETE /api/employee/new-expense/{id}` discards it.

`GET /api/employee/new-expense/options` lists report names and unlinked card
transactions. `GET /api/employee/new-expense/receipts/{id}` downloads an owned
receipt. A linked transaction must belong to the Employee and match the
expense amount and INR currency.

## Workspace

All Employee data routes require `Authorization: Bearer <Supabase access token>`.
The backend verifies the Employee role. Supabase row security restricts each
read and write to that Employee's records.

- `GET /api/employee/overview` returns claims, drafts, and summary totals.
- `GET /api/employee/analytics?month=YYYY-MM` returns monthly spend, category,
  daily and weekly trends, funding, and receipt compliance.
- `GET /api/employee/reports` groups expenses and returns workflow status.
- `POST /api/employee/reports/action` withdraws a fully submitted report or
  resubmits a withdrawn report. Body: `{"name":"Trip","action":"withdraw"}`.
- `GET /api/employee/cards` returns assigned cards, transactions, requests,
  and monthly card/category limit usage.
- `PATCH /api/employee/cards/{id}` updates assigned card controls.
- `POST /api/employee/cards/requests` stores a limit increase or virtual card
  request. It does not change an issuer limit or issue a real card.

Card and transaction tables start empty. Only an issuer/admin integration can
provision those records; Employees cannot fabricate them.

Run tests with `.venv/Scripts/python.exe -m pytest -q tests`.
