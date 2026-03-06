# Signavo

AI-powered presence engine for real estate professionals in Hampton Roads, VA.

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ABakker30/signavo.git
cd signavo
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack
- **Next.js** — React framework
- **TypeScript** — Type safety
- **TailwindCSS** — Styling
- **Supabase** — Auth, Database, Storage

## Project Structure
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architecture documentation.

## Deployment
Deployed via Vercel with automatic deploys from the `main` branch.

## License
ISC
