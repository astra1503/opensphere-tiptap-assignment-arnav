'use client'

import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full flex justify-center">
        <TiptapEditor />
      </div>
    </main>
  )
}
