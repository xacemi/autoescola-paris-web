import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
    { value: 0, label: 'Conceptos y definiciones' },
    { value: 1, label: 'Normas y señales' },
    { value: 2, label: 'Seguridad vial' },
    { value: 3, label: 'Conocimiento del vehículo' },
]

async function afegirDocument(formData: FormData) {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.from('alumnes_documents').insert({
        titol: formData.get('titol'),
        categoria: Number(formData.get('categoria')),
        url_nextcloud: formData.get('url_nextcloud'),
        posicio: Number(formData.get('posicio')) || 0,
        actiu: true,
    })
    revalidatePath('/admin/documentos')
}

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

            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mb-8">
                <h2 className="text-base font-bold text-zinc-800 mb-4">Añadir documento</h2>
                <form action={afegirDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
                        <input name="titol" required placeholder="Resumen tema 1"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Posición</label>
                        <input name="posicio" type="number" placeholder="1"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">URL del PDF (Nextcloud) *</label>
                        <input name="url_nextcloud" type="url" required placeholder="https://nuvol.xaviercastello.com/s/..."
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Categoría *</label>
                        <select name="categoria" required
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700">
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-3">
                        <button type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
                            + Añadir documento
                        </button>
                    </div>
                </form>
            </div>

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
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-blue-600">{d.posicio}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-zinc-800 text-sm">{d.titol}</p>
                                                <p className="text-xs text-blue-500 truncate">{d.url_nextcloud}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.actiu ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                {d.actiu ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <div className="flex gap-2">
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