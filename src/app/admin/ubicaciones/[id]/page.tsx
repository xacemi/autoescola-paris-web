import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateUbicacio } from '../actions'

const CATEGORIES = [
  { value: 'examens', label: '🚦 Zonas de Examen' },
  { value: 'pistes', label: '🏁 Pistas de Prácticas' },
  { value: 'oficines', label: '🏢 Oficinas' },
]

export default async function EditarUbicacioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: u } = await supabase.from('ubicacions').select('*').eq('id', id).single()

  if (!u) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Editar ubicación</h1>
      <form action={updateUbicacio} className="flex flex-col gap-4 max-w-lg">
        <input type="hidden" name="id" value={u.id} />
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Categoría *</label>
          <select name="categoria" required defaultValue={u.categoria}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Nombre *</label>
          <input name="label" required defaultValue={u.label}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Dirección</label>
          <input name="adreca" defaultValue={u.adreca ?? ''}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">URL Google Maps *</label>
          <input name="url_maps" required defaultValue={u.url_maps}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Orden</label>
          <input name="ordre" type="number" defaultValue={u.ordre} min={0}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="actiu" defaultChecked={u.actiu}
            className="w-4 h-4 rounded border-zinc-300 text-blue-600" />
          <span className="text-sm text-zinc-700">Activa</span>
        </label>
        <div className="flex gap-3">
          <button type="submit"
            className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Guardar
          </button>
          <a href="/admin/ubicaciones" className="text-sm text-zinc-500 hover:underline self-center">Cancelar</a>
        </div>
      </form>
    </div>
  )
}