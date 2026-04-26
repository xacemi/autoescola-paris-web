import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { deleteHorario } from './actions'

export default async function HorariosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: horaris } = await supabase
    .from('horaris')
    .select('*')
    .order('dia_setmana')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Horarios</h1>
        <Link
          href="/admin/horarios/nuevo"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nuevo horario
        </Link>
      </div>

      {!horaris?.length ? (
        <p className="text-zinc-500 text-sm">No hay horarios todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {horaris.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-zinc-200 px-5 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-medium text-zinc-800">
                  {h.dia_setmana} · {h.hora_inici}–{h.hora_fi}
                  {!h.actiu && <span className="ml-2 text-xs text-zinc-400">(inactivo)</span>}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {[h.tipus, h.professor].filter(Boolean).join(' · ')}
                  {h.link_online && <> · <a href={h.link_online} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Online</a></>}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/horarios/${h.id}`} className="text-sm text-blue-700 hover:underline">
                  Editar
                </Link>
                <form action={deleteHorario}>
                  <input type="hidden" name="id" value={h.id} />
                  <button type="submit" className="text-sm text-red-500 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
