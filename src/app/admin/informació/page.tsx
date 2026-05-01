import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { eliminarInformacio } from './actions'
import DeleteInformacioButton from './DeleteInformacioButton'

export const dynamic = 'force-dynamic'

export default async function InformacioAdminPage() {
  const supabase = await createSupabaseServerClient()
  const { data: items } = await supabase
    .from('alumnes_informacio')
    .select('*')
    .order('ordre', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Informació alumnes</h1>
        <Link href="/admin/informacio/nova" className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
          + Nova entrada
        </Link>
      </div>

      {!items?.length ? (
        <p className="text-zinc-500 text-sm">No hi ha entrades encara.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-zinc-200 px-5 py-4 flex items-start justify-between shadow-sm gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-zinc-400">#{item.ordre}</span>
                  <p className="font-medium text-zinc-800">{item.titol}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.actiu ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {item.actiu ? 'Visible' : 'Ocult'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">{item.contingut}</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <DeleteInformacioButton action={eliminarInformacio.bind(null, item.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
