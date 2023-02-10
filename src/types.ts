type Player = 'X' | 'O'
type CellValue = Player | null
type BoardState = CellValue[][]
type Move = {
  player: Player
  row: number
  col: number
}

export type { Player, CellValue, BoardState, Move }
