import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import UploadForm from './UploadForm'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
    { value: 0, label: 'Conceptos y definiciones' },
    { value: 1, label: 'Normas y señales' },
    { value: 2, label: 'Seguridad vial' },
    { value: 3, label: 'Conocimiento del vehículo' },
]

async function eliminarDocument(id: string) {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.from('alumnes_documents').delete().eq('id', id)
    revalidatePath('/admin/documentos')
}

async function toggleActiu(id: string, actiu: boolean) {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.from('alumnes_documents').update({ actiu: !actiu }).eq('id', id)
    revalidatePath('/admin/documentos')
}

async function actualitzarPosicio(id: string, formData: FormData) {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.from('alumnes_documents').update({
        posicio: Number(formData.get('posicio'))
    }).eq('id', id)
    revalidatePath('/admin/documentos')
}

export default async function DocumentosPage() {
    const supabase = await createSupabaseServerClient()
    const { data: documents } = await supabase
        .from('alumnes_documents')
        .select('*')
        .order('categoria', { ascending: true })
        .order('posicio', { ascending: true })

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-6">Documentos y Resúmenes</h1>

            <UploadForm />

            {!documents?.length ? (
                <p className="text-sm text-zinc-500">No hay documentos todavía.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {CATEGORIES.map((cat) => {
                        const docs = documents.filter((d) => d.categoria === cat.value)
                        if (!docs.length) return null
                        return (
                            <div key={cat.value}>
                                <h3 className="text-sm font-bold text-zinc-600 mb-3 uppercase tracking-wide">
                                    {cat.value} — {cat.label}
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {docs.map((d) => (
                                        <div key={d.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm flex items-center gap-4 flex-wrap">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-zinc-800 text-sm">{d.titol}</p>
                                                <p className="text-xs text-blue-500 truncate">{d.url_nextcloud}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.actiu ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                {d.actiu ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <div className="flex gap-2 items-center flex-wrap">
                                                <form action={actualitzarPosicio.bind(null, d.id)} className="flex gap-1 items-center">
                                                    <input
                                                        name="posicio"
                                                        type="number"
                                                        defaultValue={d.posicio}
                                                        className="w-14 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button type="submit"
                                                        className="bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors border border-zinc-200">
                                                        💾
                                                    </button>
                                                </form>
                                                <form action={toggleActiu.bind(null, d.id, d.actiu)}>
                                                    <button type="submit"
                                                        className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors border ${d.actiu
                                                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                                                : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                                            }`}>
                                                        {d.actiu ? '⏸️ Desactivar' : '▶️ Activar'}
                                                    </button>
                                                </form>
                                                <form action={eliminarDocument.bind(null, d.id)}>
                                                    <button type="submit"
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-200">
                                                        🗑️ Eliminar
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