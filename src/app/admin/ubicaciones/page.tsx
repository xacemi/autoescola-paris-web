import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { deleteUbicacio } from './actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const CATEGORIES: Record<string, string> = {
  examens: '🚦 Zonas de Examen',
  pistes: '🏁 Pistas de Prácticas',
  oficines: '🏢 Oficinas',
}

export default async function UbicacionsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: ubicacions } = await supabase
    .from('ubicacions')
    .select('*')
    .order('categoria')
    .order('ordre')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Ubicaciones</h1>
        <Link
          href="/admin/ubicaciones/nueva"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nueva ubicación
        </Link>
      </div>

      {!ubicacions?.length ? (
        <p className="text-zinc-500 text-sm">No hay ubicaciones todavía.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(CATEGORIES).map(([key, label]) => {
            const llocs = ubicacions.filter((u) => u.categoria === key)
            if (!llocs.length) return null
            return (
              <div key={key}>
                <h2 className="text-sm font-bold text-zinc-600 mb-2">{label}</h2>
                <div className="flex flex-col gap-2">
                  {llocs.map((u) => (
                    <div key={u.id} className="bg-white rounded-xl border border-zinc-200 px-5 py-4 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="font-medium text-zinc-800">{u.label}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {u.adreca && <span>{u.adreca} · </span>}
                          <span className={u.actiu ? 'text-green-600' : 'text-zinc-400'}>
                            {u.actiu ? 'Activa' : 'Inactiva'}
                          </span>
                          {' · '}ordre {u.ordre}
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <a href={u.url_maps} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                          Maps
                        </a>
                        <Link href={`/admin/ubicaciones/${u.id}`} className="text-sm text-blue-700 hover:underline">
                          Editar
                        </Link>
                        <form action={deleteUbicacio}>
                          <input type="hidden" name="id" value={u.id} />
                          <button type="submit" className="text-sm text-red-500 hover:underline">
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}