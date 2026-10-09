# Instructions for Person 3: Supabase & Auth Specialist (Database, RLS, Storage)

> **Important**: All work must be based on the latest working branch `devlop-aditya` (NOT `main`). Do NOT edit any application code inside `frontend/` or `backend/`. Your scope is strictly the database schema (`supabase/`), authentication configuration, and storage buckets.

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
git checkout -b feature/supabase-auth
```

---

## Step 2: Prompt to Give to Your AI Assistant
Copy and paste the exact prompt below into your AI tool (Claude, Cursor, Copilot, ChatGPT, etc.):

```text
I am responsible for the Supabase Database, Authentication, and Storage setup for our Finance Management System. Do NOT modify any code in `frontend/` or `backend/`.

Project Context:
- Supabase Project URL: https://gzjucqkeddwoteugddik.supabase.co
- The SQL schema is located in `supabase/schema_and_seed.sql`.

Here are your exact tasks:
1. Database Schema & Tables:
   - Check `supabase/schema_and_seed.sql` to verify that all necessary tables are defined:
     `expense_claims`, `department_budgets`, `profiles`, `employee_cards`, `employee_card_transactions`, `employee_expense_drafts`.
   - Guide me through running this SQL script in the Supabase Dashboard SQL Editor if any tables or columns are missing.

2. Supabase Auth Configuration:
   - Guide me in Supabase Dashboard > Authentication > Providers > Email:
     - Enable Email/Password authentication.
     - Turn OFF "Confirm email" during development so test accounts can log in immediately.
   - Help me set up 3 initial test users in Supabase Auth & public.profiles:
     - admin@payout.finance (Role: ADMIN / FINANCE)
     - manager@payout.finance (Role: MANAGER)
     - employee@payout.finance (Role: EMPLOYEE)

3. Storage Bucket Configuration:
   - In Supabase Dashboard > Storage, guide me to create a bucket named `receipts`.
   - Set up an access policy allowing authenticated users to upload (`INSERT`) and view/download (`SELECT`) invoice documents.

4. Service Role Key Retrieval:
   - Direct me where to find `SUPABASE_SERVICE_ROLE_KEY` in Project Settings > API so I can share it with Aditya for the Render deployment.

5. Critical Rules:
   - Do NOT edit frontend or backend code.
   - Do NOT run git commit or git push without asking me.
```

---

## Step 3: When Finished (Commit & Push)
If any changes or updates were made to the SQL files in `supabase/`, run these commands:

```bash
# Review modified files (only supabase/ files should appear)
git status

# Stage supabase changes
git add supabase/

# Commit with a clean message
git commit -m "feat(supabase): update schema, test users, and storage bucket configuration"

# Push your feature branch to GitHub
git push -u origin feature/supabase-auth
```

Send the `SUPABASE_SERVICE_ROLE_KEY` securely to Aditya so the backend can be deployed to Render!

