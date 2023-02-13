import type { CellValue } from '@/types'

type CellProps = {
  row: number
  col: number
  value: CellValue
  isDisabled: boolean
  onCellClick: (row: number, col: number) => void
}

export default function Cell({
  row,
  col,
  value,
  isDisabled,
  onCellClick,
}: CellProps) {
  return (
    <button
      aria-label={`Cell at row ${row + 1} column ${col + 1}`}
      className={`aspect-square h-full w-full text-6xl${
        isDisabled ? ' cursor-not-allowed' : ''
      }`}
      disabled={isDisabled || !!value}
      onClick={() => onCellClick(row, col)}
    >
      {value}
    </button>
  )
}
