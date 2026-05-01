'use client'

import { useTransition } from 'react'

interface Props {
  horariId: string
  assisteix: boolean
  action: () => Promise<void>
}

export default function AssistenciaButton({ assisteix, action }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => action())}
      className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${
        assisteix
          ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
          : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
      }`}
    >
      {pending ? '...' : assisteix ? '✗ Eliminar assistència' : '✓ Asistiré a la clase'}
    </button>
  )
}
