type Player = 'X' | 'O'
type CellValue = Player | null
type BoardState = CellValue[][]
type Move = {
  player: Player
  row: number
  col: number
}

type DbGame = {
  id: string
  created_at: string
  winner?: Player
}

export type { BoardState, CellValue, DbGame, Move, Player }
