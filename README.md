# The Writing Gym

Deliberate practice for essays, Substack, and longform nonfiction. Short reps, real scoring criteria, and AI feedback that tells you exactly what to fix.

**Solo app — single user, no auth, no accounts.**

---

## What it is

- **Daily Drill** — AI-generated essay prompts (Argument, Hot Take, Pattern, Essay Lede, Nut Graf, Counter). 100–250 words. Pass threshold 50/100. Just reps.
- **Skill Tracks** — 24 tracks across nonfiction, grammar, and fiction. Each exercise has 3 rounds × 5 prompt variants. Pass threshold increases each round (50 → 65 → 75).
- **Practice Mode** — Infinite AI-generated prompts for any track. Same craft skills, fresh material every time.
- **Projects** — Multi-phase writing projects for longer-form work.
- **Grammar check** — Live LanguageTool integration while you write.
- **Coach feedback** — Cloudflare AI (Llama 3.3 70B) scores against real criteria and gives specific notes.

---

## Stack

- **Next.js 16** (App Router)
- **Drizzle ORM** + **PostgreSQL**
- **Cloudflare AI** — Llama 3.3 70B for feedback and prompt generation
- **LanguageTool** — grammar checking (public API, no key required)

---

## Environment variables

Create a `.env.local` file:

```env
# Cloudflare AI
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# PostgreSQL
DATABASE_URL=postgresql://writeapp:your_password@your_host:5432/writeapp?sslmode=disable
```

---

## Local development

```bash
npm install
npm run db:push      # create tables in postgres
npm run dev          # starts on http://localhost:3000
```

---

## Deploying to a NUC / self-hosted Linux server

### 1. Prerequisites on the server

```bash
# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (process manager)
sudo npm install -g pm2
```

### 2. Clone and install

```bash
git clone https://github.com/xybernetex/write-app.git
cd write-app
npm install
```

### 3. Environment

```bash
cp .env .env.local
nano .env.local   # fill in CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, DATABASE_URL
```

### 4. Database

The PostgreSQL server is expected at the host specified in `DATABASE_URL`. Tables are created automatically:

```bash
npm run db:push
```

### 5. Build and start

```bash
npm run build
pm2 start "npm start" --name writing-gym
pm2 save
pm2 startup   # follow the printed command to enable autostart on reboot
```

App runs on port 3000. To expose it on port 80/443, put nginx in front:

```nginx
server {
    listen 80;
    server_name your_nuc_ip_or_hostname;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Updating

```bash
cd write-app
git pull
npm install
npm run build
pm2 restart writing-gym
```

---

## Database schema

Four tables, all auto-created by `npm run db:push`:

| Table | Purpose |
|---|---|
| `users` | Single row — solo user preferences (feedback tone) |
| `submissions` | Every submission with score, feedback, criteria results |
| `progress` | Best score and completion status per exercise |
| `project_progress` | Progress through multi-phase projects |

---

## Feedback tone

Go to Settings to switch between Coach (direct, specific) and other tone options. Stored in the `users` table against the solo user ID.
