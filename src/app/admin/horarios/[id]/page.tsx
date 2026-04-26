import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { updateHorario } from '../actions'

export default async function EditarHorarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: h } = await supabase.from('horaris').select('*').eq('id', id).single()

  if (!h) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Editar horario</h1>
      <form action={updateHorario} className="flex flex-col gap-4 max-w-lg">
        <input type="hidden" name="id" value={h.id} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Día de la semana</label>
            <input name="dia_setmana" required defaultValue={h.dia_setmana}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Tipo</label>
            <input name="tipus" defaultValue={h.tipus ?? ''}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Hora inicio</label>
            <input name="hora_inici" type="time" required defaultValue={h.hora_inici}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Hora fin</label>
            <input name="hora_fi" type="time" required defaultValue={h.hora_fi}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Profesor</label>
            <input name="professor" defaultValue={h.professor ?? ''}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Link online</label>
            <input name="link_online" defaultValue={h.link_online ?? ''}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="actiu" defaultChecked={h.actiu}
            className="w-4 h-4 rounded border-zinc-300 text-blue-600" />
          <span className="text-sm text-zinc-700">Activo</span>
        </label>

        <div className="flex gap-3">
          <button type="submit"
            className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Guardar
          </button>
          <a href="/admin/horarios" className="text-sm text-zinc-500 hover:underline self-center">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
