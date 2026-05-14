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

export default function NotificacionesPage() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [seu, setSeu] = useState('Todas')
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [result, setResult] = useState('')
    const [logs, setLogs] = useState<Log[]>([])

    async function fetchLogs() {
        const res = await fetch('/api/push/logs')
        if (res.ok) {
            const data = await res.json()
            setLogs(data)
        }
    }

    useEffect(() => {
        fetchLogs()
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

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-6">Enviar notificación</h1>

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