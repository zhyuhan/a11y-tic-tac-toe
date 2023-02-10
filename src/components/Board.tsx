import Cell from './Cell'
import type { Player, BoardState, Move } from '@/types'

type BoardProps = {
  player: Player
  state: BoardState
  isDisabled: boolean
  onMove: (move: Move) => void
}

export default function Board({
  player,
  state,
  isDisabled,
  onMove,
}: BoardProps) {
  const numRows = 3
  const numCols = 3

  function handleCellClick(row: number, col: number) {
    if (isDisabled) return
    onMove({ player, row, col })
  }

  return (
    <div className="h-96 w-96 divide-y divide-gray-900 border border-gray-900">
      {Array.from({ length: numRows }).map((_, row) => (
        <div className="flex divide-x divide-gray-900" key={`r${row + 1}`}>
          {Array.from({ length: numCols }).map((_, col) => (
            <Cell
              row={row}
              col={col}
              value={state[row][col]}
              onCellClick={handleCellClick}
              key={`c${col + 1}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
