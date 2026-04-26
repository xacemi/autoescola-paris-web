'use client'

import { deleteNoticia } from './actions'

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteNoticia.bind(null, id)}>
      <button
        type="submit"
        className="text-sm text-red-500 hover:underline"
        onClick={(e) => {
          if (!confirm('¿Eliminar esta noticia?')) e.preventDefault()
        }}
      >
        Eliminar
      </button>
    </form>
  )
}
