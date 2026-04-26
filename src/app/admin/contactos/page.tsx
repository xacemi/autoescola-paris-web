import { createSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function ContactosPage() {
  console.log('[contactos] === INICIO RENDER ===')
  const supabase = await createSupabaseServerClient()
  const { data: contactes, error } = await supabase
    .from('contactes')
    .select('*')
    .order('data_contacte', { ascending: false })
  console.log('[contactos] data:', JSON.stringify(contactes))
  console.log('[contactos] error:', JSON.stringify(error))

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Contactos recibidos</h1>

      {!contactes?.length ? (
        <p className="text-sm text-zinc-500">No hay mensajes todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {contactes.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-zinc-800">{c.nom}</p>
                  <p className="text-sm text-blue-700">{c.email}</p>
                  {c.telefon && <p className="text-sm text-zinc-500">{c.telefon}</p>}
                </div>
                <p className="text-xs text-zinc-400 whitespace-nowrap">
                  {new Date(c.data_contacte).toLocaleDateString('es-ES')}
                </p>
              </div>
              {c.permis_interes && (
                <p className="mt-3 text-xs text-blue-700 font-medium">Permiso: {c.permis_interes}</p>
              )}
              {c.missatge && (
                <p className="mt-2 text-sm text-zinc-700 border-t border-zinc-100 pt-3">{c.missatge}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
