import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('games')
      .select()
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const id = nanoid()
    const { error } = await supabase.from('games').insert({ id })

    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ id })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
