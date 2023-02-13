import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { Fetcher, SWRConfig } from 'swr'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const ReactDOM = require('react-dom')
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

const fetcher: Fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 1500,
        fetcher: fetcher,
      }}
    >
      <header>
        <Navbar />
      </header>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
