# Szymon & Jarret Schedule — Vercel + Upstash Setup

## Project Structure

```
your-repo/
├── index.html          ← the app
├── vercel.json         ← Vercel config
├── api/
│   ├── schedule.js     ← serverless API: saves/loads schedule
│   └── checked.js      ← serverless API: saves/loads checkboxes
```

---

## Step 1 — Add these files to your GitHub repo

Upload everything in this folder to your existing GitHub repo:
- `index.html` (replace existing)
- `vercel.json` (new)
- `api/schedule.js` (new — create an `api` folder first)
- `api/checked.js` (new)

---

## Step 2 — Install Upstash on Vercel

1. Go to: https://vercel.com/integrations/upstash
2. Click **Install**
3. Select your account → click **Add Integration**
4. It redirects you to Upstash — **Sign up free** (or log in)
5. Click **Create Database**
   - Name: `szjr-schedule` (or anything)
   - Region: **US-East-1** (closest to Philadelphia)
   - Type: **Regional**
   - Click **Create**
6. Back in Upstash, click **Connect to Vercel**
7. Select your schedule project → **Connect**

This automatically adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
as environment variables in your Vercel project. No copying needed.

---

## Step 3 — Redeploy

In your Vercel dashboard:
- Go to your project → **Deployments** → click **Redeploy** on the latest deployment

Or just push any change to GitHub — Vercel auto-redeploys.

---

## Step 4 — Done! 🎉

Open your Vercel URL. The sync indicator in the top nav will show **Synced ✓** 
in green when Upstash is connected.

Both you and Jarret can now:
- Open the same URL on any device, anywhere
- Check off tasks and see them sync within seconds
- Edit the schedule and changes appear for both of you

---

## How sync works

- Schedule edits → saved to Upstash Redis key `szjr:schedule`
- Checkbox state → saved to Upstash Redis key `szjr:checked`
- Checkboxes reset weekly (keyed by ISO week number)
- Free Upstash tier: 10,000 requests/day — more than enough

---

## Troubleshooting

**Sync shows "Local only":**
- Check Vercel dashboard → your project → Settings → Environment Variables
- Make sure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present
- Redeploy after adding env vars

**API returns 500:**
- Check Vercel dashboard → Deployments → Functions → View logs
