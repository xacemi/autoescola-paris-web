'use client'

import { useTransition } from 'react'

export default function DeleteContacteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm('Segur que vols eliminar aquest contacte?')) {
          startTransition(() => action())
        }
      }}
      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {pending ? 'Eliminant...' : 'Eliminar'}
    </button>
  )
}
