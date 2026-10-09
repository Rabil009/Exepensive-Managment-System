# Instructions for Person 2: Backend Specialist (FastAPI & API Polish)

> **Important**: All work must be based on the latest working branch `devlop-aditya` (NOT `main`). Do NOT edit any files in `frontend/` or `supabase/`. Your scope is strictly the `backend/` folder.

---

## Step 1: Terminal Setup (Git Branch)
Open your terminal in the project root and execute the following commands in order:

```bash
# 1. Fetch the latest branches from GitHub
git fetch origin

# 2. Switch to the verified working branch
git checkout devlop-aditya
git pull origin devlop-aditya

# 3. Create your isolated feature branch
git checkout -b feature/backend-api
```

---

## Step 2: Prompt to Give to Your AI Assistant
Copy and paste the exact prompt below into your AI tool (Claude, Cursor, Copilot, ChatGPT, etc.):

```text
I am responsible for the backend module of this project. My task is strictly limited to the `backend/` directory. Do NOT modify any files inside `frontend/` or `supabase/`.

Project Context:
- The backend is a FastAPI Python application located in `backend/app`.
- The live frontend is running on Vercel at: https://frontend-six-omega-8cs3dcwpjd.vercel.app

Here are your exact tasks:
1. Verify `backend/requirements.txt`:
   Ensure it includes all required production dependencies:
   - fastapi
   - uvicorn
   - supabase
   - httpx
   - pydantic
   - python-dotenv
   - python-multipart
   - pytest (for testing)

2. Update CORS in `backend/app/core/config.py`:
   Ensure `CORS_ORIGINS` allows:
   - "https://frontend-six-omega-8cs3dcwpjd.vercel.app"
   - "http://localhost:3000"
   - "http://127.0.0.1:3000"
   - "*"

3. Review & Harden API Endpoints:
   Review routes in `backend/app/api/`:
   - `finance.py`: Verify `/api/finance/overview` and `/api/finance/claims` handle database query errors gracefully without throwing unhandled 500 exceptions.
   - `approvals.py`: Verify manager approval endpoints accept status updates cleanly.
   - `employee_workspace.py` & `employee_auth.py`: Ensure user tokens and profiles return clean structured JSON errors if records are missing.

4. Run and Verify Test Suite:
   Execute the backend tests using:
   $env:PYTHONPATH="backend"; python -m pytest backend/tests/
   Ensure all tests pass with 0 errors.

5. Critical Rules:
   - Do NOT run git commit or git push without asking me.
   - Do NOT touch frontend code.
```

---

## Step 3: When Finished (Commit & Push)
Once your AI confirms all tests pass and changes are clean, run these commands in your terminal:

```bash
# Review what you changed (only backend/ files should appear)
git status

# Stage backend changes
git add backend/

# Commit with a clean message
git commit -m "feat(backend): standardize CORS, dependencies, and robust API error handling"

# Push your feature branch to GitHub
git push -u origin feature/backend-api
```
Inform Aditya once pushed so it can be deployed on Render.

