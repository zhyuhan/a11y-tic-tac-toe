import type { BoardState, Move, Player } from '@/types'
import { supabase } from './supabaseClient'

function makeMove(boardState: BoardState, move: Move) {
  const newBoardState = [...boardState]
  newBoardState[move.row][move.col] = move.player
  return newBoardState
}

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

function checkDraw(boardState: BoardState) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!boardState[i][j]) {
        return false
      }
    }
  }
  return true
}

function moveToString(move: Move) {
  return `${move.player}${move.row + 1}${move.col + 1}`
}

function moveFromString(move: string) {
  return {
    player: move[0] as 'X' | 'O',
    row: parseInt(move[1]) - 1,
    col: parseInt(move[2]) - 1,
  }
}

async function commitMove({
  id,
  num,
  move,
}: {
  id: string
  num: number
  move: Move
}) {
  const { error } = await supabase.from('moves').insert({
    game_id: id,
    move_num: num,
    move: moveToString(move),
  })

  if (error) {
    throw new Error(error.message)
  }
}

async function fetchMoves(id: string) {
  const { data, error } = await supabase
    .from('moves')
    .select('move')
    .eq('game_id', id)
    .order('move_num', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

async function commitWinner({
  id,
  winner,
}: {
  id: string
  winner: Player | 'draw'
}) {
  const { error } = await supabase.from('games').update({ winner }).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

function generateBoardStateFromMoves(moves: Move[]) {
  const boardState: BoardState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]

  moves.forEach((move) => {
    boardState[move.row][move.col] = move.player
  })

  return boardState
}

export {
  checkDraw,
  checkWin,
  commitMove,
  commitWinner,
  fetchMoves,
  generateBoardStateFromMoves,
  makeMove,
  moveFromString,
}
