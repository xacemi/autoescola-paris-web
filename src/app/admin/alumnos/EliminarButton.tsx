'use client'

export default function EliminarButton({ action }: { action: () => Promise<void> }) {
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