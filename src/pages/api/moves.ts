import { supabase } from '@/lib/supabaseClient'
import type { NextApiRequest, NextApiResponse } from 'next'

type MoveData = {
  id: string
  move: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { body } = req

    if (!body) {
      return res.status(400).json({ error: 'Missing body' })
    }

    const { id, move } = body

    // check if game is already over
    const { data } = await supabase.from('games').select('winner').eq('id', id)

    if (!data) {
      return res.status(404).json({ error: 'Game not found' })
    }

    if (data[0].winner) {
      return res.status(400).json({ error: 'Game is already over' })
    }

    const { error } = await supabase.from('moves').insert({ id, move })

    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
