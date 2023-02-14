import { DbGame } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export default function Home() {
  const router = useRouter()

  const { data: games, isLoading } = useSWR<DbGame[]>('/api/games')

  function handleCreateGame() {
    fetch('/api/games', { method: 'POST' })
      .then((response) => response.json())
      .then(({ id }) => {
        router.push(`/games/${id}`)
      })
  }

  return (
    <>
      <Head>
        <title>A11y Tic Tac Toe</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        id="content"
        className="mx-auto flex max-w-screen-md flex-col items-center justify-center gap-8 py-12"
      >
        <h1 className="sr-only">A11y Tic Tac Toe</h1>

        <button
          type="button"
          className="rounded-sm bg-stone-200 px-2 py-2 hover:bg-stone-300"
          onClick={handleCreateGame}
        >
          New game
        </button>

        {!isLoading && games?.length === 0 ? (
          <p className="text-center">No games yet. Create one!</p>
        ) : (
          games && (
            <table className="table-auto">
              <caption className="py-2 text-lg font-medium">Past games</caption>
              <thead>
                <tr>
                  <th className="px-4 py-1">ID</th>
                  <th className="px-4 py-1">Time created</th>
                  <th className="px-4 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {games?.map(({ id, created_at, winner }) => (
                  <tr key={id}>
                    <td className="px-4 py-1">
                      <Link href={`/games/${id}`} className="underline">
                        {id}
                      </Link>
                    </td>
                    <td className="px-4 py-1">
                      {formatDistanceToNow(new Date(created_at))} ago
                    </td>
                    <td className="px-4 py-1 text-center">
                      {winner === 'X'
                        ? 'X won'
                        : winner === 'O'
                        ? 'O won'
                        : winner === 'draw'
                        ? 'Draw'
                        : 'In progress'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </main>
    </>
  )
}
