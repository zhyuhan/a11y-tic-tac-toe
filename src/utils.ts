import type { BoardState } from './types'

function checkWin(boardState: BoardState) {
  // check rows
  for (let i = 0; i < 3; i++) {
    if (
      boardState[i][0] &&
      boardState[i][0] === boardState[i][1] &&
      boardState[i][0] === boardState[i][2]
    ) {
      return boardState[i][0]
    }
  }
  // check columns
  for (let i = 0; i < 3; i++) {
    if (
      boardState[0][i] &&
      boardState[0][i] === boardState[1][i] &&
      boardState[0][i] === boardState[2][i]
    ) {
      return boardState[0][i]
    }
  }
  // check diagonals
  if (boardState[1][1]) {
    if (
      boardState[0][0] === boardState[1][1] &&
      boardState[0][0] === boardState[2][2]
    ) {
      return boardState[1][1]
    }
    if (
      boardState[0][2] === boardState[1][1] &&
      boardState[0][2] === boardState[2][0]
    ) {
      return boardState[1][1]
    }
  }
  return null
}

export { checkWin }
