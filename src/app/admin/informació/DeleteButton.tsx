'use client'

import { useTransition } from 'react'

export default function DeleteInformacioButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm('Segur que vols eliminar aquest element?')) {
          startTransition(() => action())
        }
      }}
      className="text-sm text-red-500 hover:underline disabled:opacity-50"
    >
      {pending ? '...' : 'Eliminar'}
    </button>
  )
}
