'use client'

import { useActionState } from 'react'

type Noticia = { id: string; titol: string; contingut: string; publicada: boolean }
type Action = (state: unknown, formData: FormData) => Promise<{ error: string } | undefined>

export default function NoticiaForm({ action, noticia }: { action: Action; noticia?: Noticia }) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {noticia && <input type="hidden" name="id" value={noticia.id} />}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Título</label>
        <input
          name="titol"
          required
          defaultValue={noticia?.titol ?? ''}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Contenido</label>
        <textarea
          name="contingut"
          required
          rows={6}
          defaultValue={noticia?.contingut ?? ''}
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="publicada"
          defaultChecked={noticia?.publicada ?? false}
          className="w-4 h-4 rounded border-zinc-300 text-blue-600"
        />
        <span className="text-sm text-zinc-700">Publicar en la web</span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar'}
        </button>
        <a href="/admin/noticias" className="text-sm text-zinc-500 hover:underline self-center">
          Cancelar
        </a>
      </div>
    </form>
  )
}
