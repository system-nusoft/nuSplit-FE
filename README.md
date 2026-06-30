# nuSplit — Frontend

Next.js 15 frontend for nuSplit, a group bill-splitting app.

## Local development

### Prerequisites

- Node.js 20+
- nuSplit backend running (see `nuSplit-BE`)

### Setup

```bash
# Install dependencies
npm install

# Copy env
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL to point at your backend

# Start dev server
npm run dev
```

App is available at `http://localhost:3000`.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g. `https://nusplit-be.onrender.com/api`) |

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
4. Deploy — Vercel auto-detects Next.js.

## Pages

| Route | Description |
|---|---|
| `/login` | Sign in |
| `/signup` | Create account |
| `/verify-email` | Email OTP verification |
| `/onboarding` | Set display name + phone |
| `/groups` | My groups list |
| `/groups/[id]` | Group detail: members + expenses |
| `/groups/[id]/add-expense` | Add expense with split method |
| `/invite/[token]` | Accept group invite |
