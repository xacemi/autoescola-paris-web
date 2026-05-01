'use client'

import { useTransition } from 'react'

export default function DeleteVideoButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm('Segur que vols eliminar aquest vídeo?')) {
          startTransition(() => action())
        }
      }}
      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
    >
      {pending ? 'Eliminant...' : 'Eliminar'}
    </button>
  )
}
