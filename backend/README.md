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
