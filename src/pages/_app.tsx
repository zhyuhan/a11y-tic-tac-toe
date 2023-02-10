import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const ReactDOM = require('react-dom')
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
