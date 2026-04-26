import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updatePreu } from '../actions'

export default async function EditarPrecioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: p } = await supabase.from('preus_permisos').select('*').eq('id', id).single()

  if (!p) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Editar precio</h1>
      <form action={updatePreu} className="flex flex-col gap-4 max-w-lg">
        <input type="hidden" name="id" value={p.id} />

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Tipo de permiso</label>
          <input name="tipus_permis" required defaultValue={p.tipus_permis}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Descripción</label>
          <input name="descripcio" defaultValue={p.descripcio ?? ''}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Precio matrícula (€)</label>
            <input name="preu_matricula" type="number" step="0.01" min="0" defaultValue={p.preu_matricula ?? ''}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Precio clase práctica (€)</label>
            <input name="preu_classe_practica" type="number" step="0.01" min="0" defaultValue={p.preu_classe_practica ?? ''}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Precio total aproximado (€)</label>
          <input name="preu_total_aproximat" type="number" step="0.01" min="0" defaultValue={p.preu_total_aproximat ?? ''}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Incluye</label>
          <input name="inclou" defaultValue={p.inclou ?? ''}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="actiu" defaultChecked={p.actiu}
            className="w-4 h-4 rounded border-zinc-300 text-blue-600" />
          <span className="text-sm text-zinc-700">Activo</span>
        </label>

        <div className="flex gap-3">
          <button type="submit"
            className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Guardar
          </button>
          <a href="/admin/precios" className="text-sm text-zinc-500 hover:underline self-center">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
