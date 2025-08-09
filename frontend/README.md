## Frontend (Vite + React + Tailwind)

Commands:

```bash
cd frontend
npm install
npm run dev
# build
npm run build
```

Environment:

Create `env.example` as `.env` or `.env.local` and set:

```
VITE_API_URL=http://localhost:3001
```

Vercel deploy:

```bash
vercel --prod
```

This app assumes a Node middleware at `${VITE_API_URL}` with `/api/correct`.


