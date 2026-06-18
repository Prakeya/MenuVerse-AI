Running MenuVerse locally

Prerequisites
- Node.js (>=18 recommended)
- npm

Start local backend (localmenu)

Open a terminal and run:

```bash
cd /home/prakeya-shakthivel/Downloads/localmenu
npm install
npm run dev -- -p 3004
```

Start frontend (MenuVerse-AI)

```bash
cd /home/prakeya-shakthivel/Hackathon/MenuVerse-AI
npm install
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3004 npm run dev -- --hostname 127.0.0.1 --port 3003
```

Verification URLs
- Backend menu mock: http://127.0.0.1:3004/api/menu/rest_1
- Frontend API proxy: http://127.0.0.1:3003/api/menu/rest_1
- Diner menu page: http://127.0.0.1:3003/menu/rest_1
- Admin menu studio: http://127.0.0.1:3003/dashboard/menu

Debug helpers
- `Test API` buttons in the UI call `api.getMenu('rest_1')` and log results to console.
- API normalization lives in `lib/api.ts` and always returns `MenuItem[]`.
- SWR hook `hooks/useMenu.ts` returns `items: MenuItem[]` and logs network results.

Notes
- The primary brand accent is #F2A93B (MenuVerse Gold). Use only this as the main accent.
- The backend is a local Next.js app (`localmenu`) used for demo/mock data.
