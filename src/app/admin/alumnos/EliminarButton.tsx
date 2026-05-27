'use client'

import { useState } from 'react'

export function InvitacioButton({ action }: { action: () => Promise<void> }) {
  const [enviat, setEnviat] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await action()
    setEnviat(true)
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors border ${
        enviat
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
      } disabled:opacity-50`}
    >
      {loading ? '...' : enviat ? '✅ Enviado' : '✉️ Enviar invitación'}
    </button>
  )
}

export function EliminarButton({ action }: { action: () => Promise<void> }) {
  async function handleClick() {
    if (!confirm('¿Estás seguro de que quieres eliminar este alumno? Esta acción no se puede deshacer.')) return
    await action()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200"
    >
      🗑️ Eliminar
    </button>
  )
}