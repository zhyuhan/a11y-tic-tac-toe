import Board from '@/components/Board'
import {
  checkDraw,
  checkWin,
  commitMove,
  commitWinner,
  fetchMoves,
  generateBoardStateFromMoves,
  makeMove,
  moveFromString,
} from '@/lib/game'
import { supabase } from '@/lib/supabaseClient'
import { BoardState, Move, Player } from '@/types'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

type GameProps = {
  id: string
  prevMoves: Move[]
}

export default function Game({ id, prevMoves }: GameProps) {
  const [boardState, setBoardState] = useState<BoardState>(
    generateBoardStateFromMoves(prevMoves)
  )
  const [history, setHistory] = useState<Move[]>(prevMoves)
  const [currentMove, setCurrentMove] = useState(prevMoves.length)
  const [playingAs, setPlayingAs] = useState<Player | null>(null)
  const player = currentMove % 2 === 0 ? 'X' : 'O'

  useEffect(() => {
    const rtChannel = supabase
      .channel('any')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `game_id=eq.${id}`,
        },
        (payload) => {
          const { move } = payload.new
          const newMove = moveFromString(move)
          if (newMove.player === playingAs) return
          setBoardState((oldState) => makeMove(oldState, newMove))
          setHistory((oldHistory) => [...oldHistory, newMove])
          setCurrentMove((oldMove) => oldMove + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(rtChannel)
    }
  }, [id, playingAs])

  const winner = checkWin(boardState)
  const isDraw = checkDraw(boardState)

  if (winner) {
    commitWinner({ id, winner })
  } else if (isDraw) {
    commitWinner({ id, winner: 'draw' })
  }

  async function handleMove(move: Move) {
    const newBoardState = makeMove(boardState, move)
    setBoardState(newBoardState)
    setHistory([...history, move])
    await commitMove({ id, num: currentMove, move })
    setCurrentMove(currentMove + 1)
  }

  return (
    <>
      <Head>
        <title>Game {id}</title>
      </Head>
      <main className="relative mx-auto flex max-w-screen-md flex-col items-center gap-4 px-4 py-16">
        <h1 className="sr-only">Game {id}</h1>

        {!!winner && (
          <h2 className="absolute top-4 text-2xl">🎉 ${winner} wins! 🎉</h2>
        )}
        {isDraw && <h2 className="absolute top-4 text-2xl">🤝 Draw! 🤝</h2>}

        <div className="grid md:grid-cols-10 md:grid-rows-5">
          <div className="flex items-center md:col-span-6 md:row-span-5">
            <Board
              player={player}
              state={boardState}
              isDisabled={playingAs !== player || !!winner}
              onMove={handleMove}
            />
          </div>

          <div className="col-span-3 flex items-center justify-center md:col-start-8">
            {!isDraw && !winner && (
              <button
                type="button"
                className="block rounded-sm bg-stone-200 px-2 py-1 disabled:bg-white"
                aria-pressed={playingAs === 'X'}
                disabled={playingAs === 'X'}
                onClick={() => setPlayingAs('X')}
              >
                {playingAs === 'X' ? 'Playing as X' : 'Play as X'}
              </button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center md:col-span-3 md:col-start-8 md:row-span-3 md:row-start-2">
            <h2 className="text-lg font-medium">History</h2>
            <ol className="list-decimal">
              {history.map((move, index) => (
                <li key={index} className="py-1">
                  {move.player} played row {move.row + 1} column {move.col + 1}
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-3 flex items-center justify-center md:col-start-8 md:row-start-5">
            {!isDraw && !winner && (
              <button
                type="button"
                className="block rounded-sm bg-stone-100 px-2 py-1 disabled:bg-white"
                aria-pressed={playingAs === 'O'}
                disabled={playingAs === 'O'}
                onClick={() => setPlayingAs('O')}
              >
                {playingAs === 'O' ? 'Playing as O' : 'Play as O'}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string

  const moves = await fetchMoves(id)

  return {
    props: {
      id,
      prevMoves: moves.map(({ move }) => moveFromString(move)),
    },
  }
}
