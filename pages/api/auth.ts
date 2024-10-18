import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_ID = '1864932840'; // Your Telegram ID

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Auth API called');
  
  if (req.method !== 'POST') {
    console.log(`Invalid method: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received auth data:', req.body);

  const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.body;

  if (!id || !auth_date || !hash) {
    console.log('Missing required fields in auth data');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if the user ID matches the allowed ID
  if (id !== ALLOWED_ID) {
    console.log(`User ID ${id} not authorized`);
    return res.status(403).json({ error: 'User not authorized' });
  }

  if (!BOT_TOKEN) {
    console.log('BOT_TOKEN not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Verify the authentication data
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const dataCheckString = Object.keys(req.body)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${req.body[key]}`)
    .join('\n');

  console.log('Data check string:', dataCheckString);

  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  console.log('Calculated HMAC:', hmac);
  console.log('Received hash:', hash);

  if (hmac !== hash) {
    console.log('Invalid authentication data');
    return res.status(401).json({ error: 'Invalid authentication data' });
  }

  // Check if the auth_date is not older than 1 day
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(auth_date) > 86400) {
    console.log('Authentication data is too old');
    return res.status(401).json({ error: 'Authentication data is too old' });
  }

  // If everything is okay, send a success response
  console.log('Authentication successful');
  res.status(200).json({ success: true });
}