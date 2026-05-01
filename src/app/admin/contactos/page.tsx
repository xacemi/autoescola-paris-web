import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import DeleteContacteButton from './DeleteContacteButton'

export const dynamic = 'force-dynamic'

async function eliminarContacte(id: string) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('contactes').delete().eq('id', id)
  revalidatePath('/admin/contactos')
}

export default async function ContactosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: contactes } = await supabase
    .from('contactes')
    .select('*')
    .order('data_contacte', { ascending: false })

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

              {/* Botons d'acció */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100">
                <a
                  href={`mailto:${c.email}?subject=Re: Autoescola Paris&body=Hola ${c.nom},%0A%0A`}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Respondre
                </a>

                {c.telefon && (
                  <a
                    href={`tel:${c.telefon}`}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Trucar
                  </a>
                )}

                <div className="ml-auto">
                  <DeleteContacteButton action={eliminarContacte.bind(null, c.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
