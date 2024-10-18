import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_ID = '1864932840'; // Your Telegram ID

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.body;

  // Check if the user ID matches the allowed ID
  if (id !== ALLOWED_ID) {
    return res.status(403).json({ error: 'User not authorized' });
  }

  // Verify the authentication data
  const secret = crypto.createHash('sha256').update(BOT_TOKEN!).digest();
  const dataCheckString = Object.keys(req.body)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${req.body[key]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (hmac !== hash) {
    return res.status(401).json({ error: 'Invalid authentication data' });
  }

  // Check if the auth_date is not older than 1 day
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(auth_date) > 86400) {
    return res.status(401).json({ error: 'Authentication data is too old' });
  }

  // If everything is okay, send a success response
  res.status(200).json({ success: true });
}