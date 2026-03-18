// api/schedule.js
const KEY = 'szjr:schedule';
const ALLOWED_ORIGIN = 'https://our-schedule.vercel.app';

async function redis(method, ...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const res = await fetch(`${url}/${method}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigin = (origin === ALLOWED_ORIGIN || origin === 'http://localhost:3000') ? origin : ALLOWED_ORIGIN;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-Match');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'GET') {
    const result = await redis('get', KEY);
    const data = result.result ? JSON.parse(result.result) : null;
    res.status(200).json(data);
    return;
  }

  if (req.method === 'POST') {
    const clientVersion = parseInt(req.headers['if-match'] || '0', 10);
    // Read current version from Redis to check for conflicts
    const current = await redis('get', KEY);
    const currentData = current.result ? JSON.parse(current.result) : null;
    const serverVersion = currentData?._version || 0;

    // If client sent a version and it doesn't match, return 409 Conflict
    if (clientVersion > 0 && serverVersion > 0 && clientVersion !== serverVersion) {
      res.status(409).json({ error: 'Conflict', serverVersion, clientVersion });
      return;
    }

    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await redis('set', KEY, body);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
