import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { deletePreu } from './actions'

export default async function PreciosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: preus } = await supabase
    .from('preus_permisos')
    .select('*')
    .order('tipus_permis')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Precios</h1>
        <Link
          href="/admin/precios/nuevo"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nuevo precio
        </Link>
      </div>

      {!preus?.length ? (
        <p className="text-zinc-500 text-sm">No hay precios todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {preus.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-zinc-200 px-5 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-medium text-zinc-800">
                  {p.tipus_permis}
                  {!p.actiu && <span className="ml-2 text-xs text-zinc-400">(inactivo)</span>}
                </p>
                <p className="text-sm text-blue-700 font-semibold mt-0.5">
                  {p.preu_total_aproximat != null ? `${Number(p.preu_total_aproximat).toFixed(2)} €` : '—'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {[
                    p.preu_matricula != null ? `Matrícula: ${Number(p.preu_matricula).toFixed(2)} €` : null,
                    p.preu_classe_practica != null ? `Clase práctica: ${Number(p.preu_classe_practica).toFixed(2)} €` : null,
                  ].filter(Boolean).join(' · ')}
                </p>
                {p.descripcio && <p className="text-xs text-zinc-400">{p.descripcio}</p>}
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/precios/${p.id}`} className="text-sm text-blue-700 hover:underline">
                  Editar
                </Link>
                <form action={deletePreu}>
                  <input type="hidden" name="id" value={p.id} />
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
