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
  function handleCellClick() {
    if (isDisabled) return
    onCellClick(row, col)
  }

  return (
    <div
      role="gridcell"
      className={`} flex aspect-square h-full w-full items-center justify-center
      text-6xl`}
      onClick={handleCellClick}
    >
      <button
        type="button"
        aria-label={`Row ${row + 1} Column ${col + 1}, ${
          value === null ? 'Empty' : `Value ${value}`
        }`}
        aria-disabled={isDisabled || !!value}
        className={`h-full w-full${isDisabled ? ' cursor-not-allowed' : ''}`}
      >
        {value}
      </button>
    </div>
  )
}
