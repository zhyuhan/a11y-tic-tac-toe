import type { CellValue } from '@/types'

type CellProps = {
  row: number
  col: number
  value: CellValue
  onCellClick: (row: number, col: number) => void
}

export default function Cell({ row, col, value, onCellClick }: CellProps) {
  return (
    <button
      className="aspect-square h-full w-full text-6xl"
      disabled={!!value}
      onClick={() => onCellClick(row, col)}
    >
      {value}
    </button>
  )
}
