// api/schedule.js
const KEY = 'szjr:schedule';

async function redis(method, ...args) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    const res = await fetch(`${url}/${method}/${args.map(encodeURIComponent).join('/')}`, {
          headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'GET') {
        const result = await redis('get', KEY);
        const data = result.result ? JSON.parse(result.result) : null;
        res.status(200).json(data);
        return;
  }

  if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        await redis('set', KEY, body);
        res.status(200).json({ ok: true });
        return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
