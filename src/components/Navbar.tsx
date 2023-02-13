import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()

  const isActive = (path: string) => router.pathname === path

  return (
    <nav>
      <ul className="flex gap-2 bg-stone-200 px-4 py-3">
        <li
          className={`rounded-md px-3 py-2 hover:bg-stone-300${
            isActive('/') ? ' underline' : ''
          }`}
        >
          <Link href="/">Home</Link>
        </li>
      </ul>
    </nav>
  )
}
