'use client'

import { useState, useEffect } from 'react'

const SEDES = ['Todas', 'Lleida', 'Mollerussa', 'Online']

type Log = {
    id: string
    title: string
    body: string
    seu: string
    enviades: number
    fallides: number
    created_at: string
}

type Programat = {
    id: string
    title: string
    body: string
    seu: string
    enviar_a: string
    enviat: boolean
    enviades: number
    fallides: number
}

export default function NotificacionesPage() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [seu, setSeu] = useState('Todas')
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [result, setResult] = useState('')
    const [logs, setLogs] = useState<Log[]>([])

    // Programats
    const [progTitle, setProgTitle] = useState('')
    const [progBody, setProgBody] = useState('')
    const [progSeu, setProgSeu] = useState('Todas')
    const [progData, setProgData] = useState('')
    const [progStatus, setProgStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [programats, setProgramats] = useState<Programat[]>([])

    async function fetchLogs() {
        const res = await fetch('/api/push/logs')
        if (res.ok) {
            const data = await res.json()
            setLogs(data)
        }
    }

    async function fetchProgramats() {
        const res = await fetch('/api/push/programats')
        if (res.ok) {
            const data = await res.json()
            setProgramats(data)
        }
    }

    useEffect(() => {
        fetchLogs()
        fetchProgramats()
    }, [])

    async function handleSend() {
        if (!title || !body) return
        setStatus('loading')

        const res = await fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, seu }),
        })

        const data = await res.json()

        if (!res.ok) {
            setResult('Error al enviar')
            setStatus('error')
        } else {
            setResult(`✅ Enviadas: ${data.enviades} · ❌ Fallidas: ${data.fallides}`)
            setStatus('done')
            setTitle('')
            setBody('')
            fetchLogs()
        }
    }

    async function handleProgramar() {
        if (!progTitle || !progBody || !progData) return
        setProgStatus('loading')

        const res = await fetch('/api/push/programats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: progTitle,
                body: progBody,
                seu: progSeu,
                enviar_a: new Date(progData).toISOString(),
            }),
        })

        if (!res.ok) {
            setProgStatus('error')
        } else {
            setProgStatus('done')
            setProgTitle('')
            setProgBody('')
            setProgData('')
            setProgSeu('Todas')
            fetchProgramats()
            setTimeout(() => setProgStatus('idle'), 3000)
        }
    }

    async function handleEsborrarProgramat(id: string) {
        await fetch(`/api/push/programats?id=${id}`, { method: 'DELETE' })
        fetchProgramats()
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-6">Enviar notificación</h1>

            {/* Enviar ara */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm max-w-lg mb-8">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nuevo aviso de la autoescuela"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Mensaje *</label>
                        <textarea value={body} onChange={(e) => setBody(e.target.value)}
                            placeholder="Escribe el mensaje aquí..."
                            rows={4}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Destinatarios</label>
                        <select value={seu} onChange={(e) => setSeu(e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700">
                            {SEDES.map((s) => (
                                <option key={s} value={s}>{s === 'Todas' ? '🌐 Todos los alumnos' : `📍 ${s}`}</option>
                            ))}
                        </select>
                    </div>
                    {result && (
                        <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {result}
                        </p>
                    )}
                    <button onClick={handleSend}
                        disabled={status === 'loading' || !title || !body}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                        {status === 'loading' ? 'Enviando...' : '🔔 Enviar notificación'}
                    </button>
                </div>
            </div>

            {/* Programar missatge */}
            <h2 className="text-lg font-bold text-zinc-800 mb-4">Programar notificación</h2>
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm max-w-lg mb-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Título *</label>
                        <input value={progTitle} onChange={(e) => setProgTitle(e.target.value)}
                            placeholder="Nuevo aviso de la autoescuela"
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Mensaje *</label>
                        <textarea value={progBody} onChange={(e) => setProgBody(e.target.value)}
                            placeholder="Escribe el mensaje aquí..."
                            rows={4}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Destinatarios</label>
                        <select value={progSeu} onChange={(e) => setProgSeu(e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700">
                            {SEDES.map((s) => (
                                <option key={s} value={s}>{s === 'Todas' ? '🌐 Todos los alumnos' : `📍 ${s}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Fecha y Hora de envio *</label>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">(El mensaje se enviará a las 9:00. Si se programa más tarde, se enviará al día siguiente.)</label>
                        <input
                            type="datetime-local"
                            value={progData}
                            onChange={(e) => setProgData(e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {progStatus === 'done' && (
                        <p className="text-sm text-green-600">✅ Notificació programada correctament</p>
                    )}
                    {progStatus === 'error' && (
                        <p className="text-sm text-red-600">Error al programar la notificació</p>
                    )}
                    <button onClick={handleProgramar}
                        disabled={progStatus === 'loading' || !progTitle || !progBody || !progData}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                        {progStatus === 'loading' ? 'Programando...' : '🕐 Programar notificación'}
                    </button>
                </div>
            </div>

            {/* Llista de programats pendents */}
            {programats.filter(p => !p.enviat).length > 0 && (
                <div className="max-w-lg mb-8">
                    <h3 className="text-sm font-semibold text-zinc-600 mb-2">Pendientes de envío</h3>
                    <div className="flex flex-col gap-2">
                        {programats.filter(p => !p.enviat).map((p) => (
                            <div key={p.id} className="bg-purple-50 rounded-xl border border-purple-200 p-4 flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-zinc-800 text-sm">{p.title}</p>
                                    <p className="text-xs text-zinc-500">{p.body}</p>
                                    <p className="text-xs text-purple-600 mt-1">
                                        🕐 {new Date(p.enviar_a).toLocaleString('es-ES')} · 📍 {p.seu}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEsborrarProgramat(p.id)}
                                    className="text-xs text-red-400 hover:text-red-600 whitespace-nowrap">
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Historial */}
            <h2 className="text-lg font-bold text-zinc-800 mb-4">Historial de notificaciones</h2>
            {!logs.length ? (
                <p className="text-sm text-zinc-500">No hay notificaciones enviadas todavía.</p>
            ) : (
                <div className="flex flex-col gap-3 max-w-lg">
                    {logs.map((log) => (
                        <div key={log.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-semibold text-zinc-800 text-sm">{log.title}</p>
                                <span className="text-xs text-zinc-400 whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString('es-ES')}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-2">{log.body}</p>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-zinc-400">📍 {log.seu}</span>
                                <span className="text-xs text-green-600">✅ {log.enviades}</span>
                                <span className="text-xs text-red-500">❌ {log.fallides}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}