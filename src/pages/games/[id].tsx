import Head from 'next/head'
import { useRouter } from 'next/router'
import Board from '@/components/Board'
import { checkWin } from '@/utils'
import type { BoardState, Move } from '@/types'
import { useState } from 'react'

export default function Game() {
  const router = useRouter()
  const { id } = router.query

  const [boardState, setBoardState] = useState<BoardState>(
    Array.from({ length: 3 }).map(() =>
      Array.from({ length: 3 }).map(() => null)
    )
  )
  const [history, setHistory] = useState<Move[]>([])
  const [currentMove, setCurrentMove] = useState(0)
  const player = currentMove % 2 === 0 ? 'X' : 'O'

  const winner = checkWin(boardState)

  function handleMove(move: Move) {
    const { player, row, col } = move
    const newBoardState = [...boardState]
    newBoardState[row][col] = player
    setBoardState(newBoardState)
    setHistory([...history, move])
    setCurrentMove(currentMove + 1)
  }

  return (
    <>
      <Head>
        <title>Game {id}</title>
      </Head>
      <main className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 py-16">
        <Board
          player={player}
          state={boardState}
          isDisabled={!!winner}
          onMove={handleMove}
        />
        {!!winner && <h2 className="text-2xl">{winner} wins!</h2>}
      </main>
    </>
  )
}
