import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import DeleteButton from './DeleteButton'

export default async function NoticiasPage() {
  const supabase = await createSupabaseServerClient()
  const { data: noticies } = await supabase
    .from('noticies')
    .select('id, titol, publicada, data_publicacio')
    .order('data_publicacio', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Noticias</h1>
        <Link
          href="/admin/noticias/nueva"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nueva noticia
        </Link>
      </div>

      {!noticies?.length ? (
        <p className="text-zinc-500 text-sm">No hay noticias todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {noticies.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-xl border border-zinc-200 px-5 py-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-medium text-zinc-800">{n.titol}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {new Date(n.data_publicacio).toLocaleDateString('es-ES')}
                  {' · '}
                  <span className={n.publicada ? 'text-green-600' : 'text-zinc-400'}>
                    {n.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/noticias/${n.id}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton id={n.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
