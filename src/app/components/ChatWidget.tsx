'use client'
import { useState, useRef, useEffect, FormEvent } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME = '¡Hola! Soy París, el asistente virtual de la Autoescola Paris. ¿En qué puedo ayudarte hoy? 😊'

export default function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(embedded)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('openChat', handler)
    return () => window.removeEventListener('openChat', handler)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(e?: FormEvent) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://app.autoescolaparis.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok || !res.body) throw new Error('fetch failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        }
        return updated
      })
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <>
      {/* Floating button — només si no és embedded */}
      {!embedded && (
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Obrir chat amb IA"
          className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      )}

      {/* Chat window */}
      <div
        className={
          embedded
            ? 'fixed inset-0 flex flex-col bg-white'
            : `fixed z-40 flex flex-col bg-white shadow-2xl border border-zinc-200 overflow-hidden transition-all duration-300
              ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
              bottom-0 left-0 right-0 h-[100dvh] rounded-none
              sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 sm:h-[520px] sm:rounded-2xl`
        }
      >
        {/* Header */}
        <div className="bg-[#0110D6] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F59E0B] rounded-full flex items-center justify-center font-bold text-base shadow">
              P
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">París · Asistente IA</p>
              <p className="text-xs text-blue-200 mt-0.5">Autoescola Paris</p>
            </div>
          </div>
          {!embedded && (
            <button
              onClick={() => setOpen(false)}
              aria-label="Tancar chat"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-zinc-100 text-zinc-800 rounded-2xl rounded-bl-sm px-3 py-2 text-sm leading-relaxed">
              {WELCOME}
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user'
                    ? 'bg-[#0110D6] text-white rounded-br-sm'
                    : 'bg-zinc-100 text-zinc-800 rounded-bl-sm'
                  }`}
              >
                {m.content || (
                  <span className="inline-flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={send}
          className="flex gap-2 p-3 border-t border-zinc-100 flex-shrink-0 bg-white"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={loading}
            className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent placeholder:text-zinc-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="w-10 h-10 flex-shrink-0 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}