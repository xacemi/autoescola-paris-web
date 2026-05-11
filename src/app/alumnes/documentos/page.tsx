'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Document = {
    id: string
    titol: string
    url_nextcloud: string
    categoria: number
    posicio: number
}

const CATEGORIES = [
    { value: 0, label: 'Conceptos y definiciones', emoji: '📖' },
    { value: 1, label: 'Normas y señales', emoji: '🚦' },
    { value: 2, label: 'Seguridad vial', emoji: '🛡️' },
    { value: 3, label: 'Conocimiento del vehículo', emoji: '🚗' },
]

export default function AlumnesDocumentosPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [selected, setSelected] = useState<Document | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        supabase
            .from('alumnes_documents')
            .select('*')
            .eq('actiu', true)
            .order('categoria', { ascending: true })
            .order('posicio', { ascending: true })
            .then(({ data }) => {
                setDocuments(data ?? [])
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div>
                <h1 className="text-xl font-bold text-zinc-800">📄 Documentos y Resúmenes</h1>
                <p className="text-sm text-zinc-500 mt-1">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-zinc-800">📄 Documentos y Resúmenes</h1>
                <p className="text-sm text-zinc-500 mt-1">Consulta los documentos de repaso sin descargarlos</p>
            </div>

            {/* Visor PDF */}
            {selected && (
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
                        <p className="font-bold text-sm text-zinc-800">{selected.titol}</p>
                        <button
                            onClick={() => setSelected(null)}
                            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            ✕ Cerrar
                        </button>
                    </div>
                    <iframe
                        src={selected.url_nextcloud}
                        className="w-full"
                        style={{ height: '70vh' }}
                        title={selected.titol}
                    />
                </div>
            )}

            {!documents.length ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
                    <p className="text-4xl mb-3">📄</p>
                    <p className="text-zinc-500 text-sm">Aún no hay documentos disponibles.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {CATEGORIES.map((cat) => {
                        const docs = documents.filter((d) => d.categoria === cat.value)
                        if (!docs.length) return null
                        return (
                            <div key={cat.value}>
                                <h2 className="text-sm font-bold text-zinc-600 mb-3 flex items-center gap-2">
                                    <span>{cat.emoji}</span>
                                    <span className="uppercase tracking-wide">{cat.label}</span>
                                </h2>
                                <div className="flex flex-col gap-2">
                                    {docs.map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => setSelected(selected?.id === d.id ? null : d)}
                                            className={`bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3 text-left transition-all hover:border-[#0110D6] ${selected?.id === d.id ? 'border-[#0110D6]' : 'border-zinc-100'
                                                }`}
                                        >
                                            <span className="text-2xl">📄</span>
                                            <p className="text-sm font-semibold text-zinc-700 flex-1">{d.titol}</p>
                                            <span className="text-zinc-300 text-xs">
                                                {selected?.id === d.id ? '▲' : '▼'}
                                            </span>
                                        </button>
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