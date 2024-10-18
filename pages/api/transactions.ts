import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error;
      return res.status(200).json(data)
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' })
    }
  } else if (req.method === 'POST') {
    try {
      const { amount, category, description, type } = req.body
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ amount, category, description, type }])
        .select()

      if (error) throw error;
      return res.status(201).json(data)
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: 'Failed to add transaction' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}