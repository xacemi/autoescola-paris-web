import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { enviarContacte } from './actions'
import BackToTop from './components/BackToTop'
import ChatWidget from './components/ChatWidget'
import ChatMenuButton from './components/ChatMenuButton'

type YoutubeVideo = { id: string; title: string; published: string }

const YOUTUBE_CHANNEL_ID = 'UC8W-T-w7D81UYO--OB4cIvw'

async function fetchYouTubeVideos(): Promise<YoutubeVideo[]> {
  try {
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 3600 } }
    )
    if (!rssRes.ok) return []
    const xml = await rssRes.text()

    return xml
      .split('<entry>')
      .slice(1, 5)
      .map((e) => ({
        id: e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '',
        title: (e.match(/<title>([^<]+)<\/title>/)?.[1] ?? '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        published: e.match(/<published>([^<]+)<\/published>/)?.[1] ?? '',
      }))
      .filter((v) => v.id)
  } catch {
    return []
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ enviat?: string }>
}) {
  const params = await searchParams
  const enviat = params.enviat === '1'

  const supabase = await createSupabaseServerClient()

  const [{ data: noticies }, { data: permisos }, { data: horaris }, videos] = await Promise.all([
    supabase
      .from('noticies')
      .select('id, titol, contingut, data_publicacio')
      .eq('publicada', true)
      .order('data_publicacio', { ascending: false })
      .limit(3),
    supabase
      .from('preus_permisos')
      .select('id, tipus_permis, descripcio, preu_total_aproximat')
      .eq('actiu', true)
      .order('tipus_permis'),
    supabase
      .from('horaris')
      .select('id, dia_setmana, hora_inici, hora_fi, tipus')
      .eq('actiu', true)
      .order('dia_setmana'),
    fetchYouTubeVideos(),
  ])

  return (
    <main className="flex flex-col min-h-screen bg-[#F4F6FB] text-[#1F2937]">

      {/* ── HEADER ── */}
      <header className="bg-[#0110D6] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#inici" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Autoescola Paris"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-base">Autoescola Paris</span>
          </a>
          <a
            href="#contacto"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            Contacto
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        id="inici"
        className="relative text-white pt-12 pb-10 px-4 text-center"
        style={{ backgroundImage: "url('/images/Oficinas.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0110D6]/60" />
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            <Image
              src="/logo.png"
              alt="Autoescola Paris"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Autoescola Paris</h1>
            <p className="text-[#F59E0B] font-semibold text-sm tracking-widest uppercase mt-1">
              Lleida · Mollerussa · Desde 1961
            </p>
          </div>
        </div>
      </section>

      {/* ── MENÚ PRINCIPAL ── */}
      <section className="px-4 py-6 -mt-1 bg-[#0110D6]">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3 pb-2">
          {[
            { emoji: '🚗', label: 'Permisos',      href: '#permisos' },
            { emoji: '📅', label: 'Horarios',      href: '#horarios' },
            { emoji: '📰', label: 'Noticias',      href: '#noticias' },
            { emoji: '📍', label: 'Contacto',      href: '#contacto' },
            { emoji: '🎬', label: 'Vídeos',        href: '#videos'   },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl py-4 px-2 flex flex-col items-center gap-2 shadow-md hover:shadow-lg border-2 border-transparent hover:border-[#F59E0B] active:scale-95 transition-all"
            >
              <span className="text-2xl leading-none">{item.emoji}</span>
              <span className="text-xs font-semibold text-[#1F2937] text-center leading-tight">
                {item.label}
              </span>
            </a>
          ))}
          <ChatMenuButton />
        </div>
      </section>

      {/* ── PERMISOS ── */}
      <section id="permisos" className="relative py-16 px-4" style={{ backgroundImage: "url('/images/Alumnos.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2 text-center">
            Permisos de conducción
          </h2>
          <p className="text-zinc-500 text-center mb-10 text-sm">
            Elige el carnet que necesitas y empieza hoy
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'A1', title: 'Carnet A1', desc: 'Moto 125cc · desde 16 años',      img: '/images/A1-ofertas.jpg', href: 'https://go.autoescolaparis.com/landing-page-3/'    },
              { code: 'A2', title: 'Carnet A2', desc: 'Moto 35 kW · desde 18 años',      img: '/images/A2-ofertas.jpg', href: 'https://go.autoescolaparis.com/landing-page-3-3/'  },
              { code: 'B',  title: 'Carnet B',  desc: 'Coche · desde 18 años',            img: '/images/B-ofertas.jpg',  href: 'https://go.autoescolaparis.com/oferta-permiso-b/'  },
              { code: 'C',  title: 'Carnet C',  desc: 'Camión rígido · desde 21 años',   img: '/images/C-ofertas.jpg',  href: 'https://go.autoescolaparis.com/landing-page-c/'    },
            ].map((p) => (
              <a
                key={p.code}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl border-2 border-zinc-100 hover:border-[#0110D6] shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden"
              >
                <div className="relative w-full h-[180px] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3 flex flex-col items-center text-center flex-1">
                  <h3 className="font-bold text-[#1F2937] text-sm mb-0.5">{p.title}</h3>
                  <p className="text-xs text-zinc-500 mb-3 leading-snug flex-1">{p.desc}</p>
                  <span className="bg-[#F59E0B] text-white text-xs font-bold px-3 py-1.5 rounded-full w-full text-center group-hover:bg-[#D97706] transition-colors">
                    Más información
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── HORARIOS ── */}
      <section id="horarios" className="relative py-16 px-4" style={{ backgroundImage: "url('/images/ConsultaTeorico.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#0110D6]/60" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Horarios de clase
          </h2>
          <p className="text-white/80 text-center mb-10 text-sm">
            Clases online y presenciales adaptadas a tu agenda
          </p>

          {horaris && horaris.length > 0 ? (
            <div className="flex flex-col gap-3">
              {horaris.map((h) => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl border border-purple-100 px-5 py-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0110D6] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {h.dia_setmana?.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] text-sm">{h.dia_setmana}</p>
                      {h.tipus && <p className="text-xs text-zinc-500">{h.tipus}</p>}
                    </div>
                  </div>
                  <span className="text-[#0110D6] font-bold text-sm tabular-nums">
                    {h.hora_inici} – {h.hora_fi}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/60 text-sm">Próximamente nuevos horarios.</p>
          )}
        </div>
      </section>

      {/* ── NOTICIAS ── */}
      <section id="noticias" className="relative py-16 px-4" style={{ backgroundImage: "url('/images/Cuenta.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2 text-center">
            Noticias
          </h2>
          <p className="text-zinc-500 text-center mb-10 text-sm">Lo último de Autoescola Paris</p>

          {noticies && noticies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticies.map((n) => (
                <article
                  key={n.id}
                  className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-[#F59E0B] font-semibold uppercase tracking-wide mb-2">
                    {new Date(n.data_publicacio).toLocaleDateString('ca-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="font-bold text-[#1F2937] mb-2 leading-snug">{n.titol}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-3">{n.contingut}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-400 text-sm">No hay noticias publicadas todavía.</p>
          )}
        </div>
      </section>

      {/* ── VÍDEOS ── */}
      <section id="videos" className="relative py-16 px-4" style={{ backgroundImage: "url('/images/Matricula%20On%20line.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#0110D6]/60" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Vídeos
          </h2>
          <p className="text-white/80 text-center mb-10 text-sm">
            Últimos vídeos de nuestro canal de YouTube
          </p>
          {videos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block relative aspect-video overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-[#1F2937] text-sm leading-snug line-clamp-2">
                      {v.title}
                    </h3>
                    {v.published && (
                      <p className="text-xs text-zinc-400">
                        {new Date(v.published).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    )}
                    <a
                      href={`https://www.youtube.com/watch?v=${v.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors text-center"
                    >
                      Ver en YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/70 text-sm mb-6">
              Visita nuestro canal para ver todos los vídeos
            </p>
          )}
          <div className="text-center mt-8">
            <a
              href="https://www.youtube.com/@ParisAutoescola"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#0110D6] font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Ver todos los vídeos
            </a>
          </div>
        </div>
      </section>

{/* ── CONTACTO ── */}
      <section id="contacto" className="relative py-16 px-4" style={{ backgroundImage: "url('/images/Ubicaciones.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2 text-center">
            Contacto
          </h2>
          <p className="text-zinc-500 text-center mb-10 text-sm">
            Estamos en dos ubicaciones para atenderte mejor
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Formulari */}
            <div>
              {enviat ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-bold text-lg">¡Mensaje enviado!</p>
                  <p className="text-green-600 text-sm">Nos pondremos en contacto contigo pronto.</p>
                  <a href="/" className="text-sm text-[#0110D6] hover:underline mt-1">Volver al inicio</a>
                </div>
              ) : (
                <form
                  action={enviarContacte}
                  className="flex flex-col gap-4 bg-white rounded-2xl p-6 shadow-sm border border-purple-100"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="nom"
                        required
                        placeholder="Tu nombre"
                        className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="tu@email.com"
                        className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Teléfono</label>
                      <input
                        name="telefon"
                        type="tel"
                        placeholder="600 000 000"
                        className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">Permiso de interés</label>
                      <select
                        name="permis_interes"
                        className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent text-[#1F2937]"
                      >
                        <option value="">Sin preferencia</option>
                        {permisos?.map((p) => (
                          <option key={p.id} value={p.tipus_permis}>
                            {p.tipus_permis}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="missatge"
                      required
                      rows={4}
                      placeholder="¿En qué podemos ayudarte?"
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0110D6] focus:border-transparent placeholder:text-zinc-400 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>

            {/* Dades de contacte */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0110D6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#1F2937]">Sede Lleida</p>
                    <p className="text-xs text-zinc-500">Oficina principal</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-zinc-600">
                  <p>📍 Rambla d&apos;Aragó, 35, 1er · 25003 Lleida</p>
                  <p>📞 <a href="tel:+34973269438" className="text-[#0110D6] hover:underline font-medium">973 269 438</a></p>
                  <p>💬 <a href="https://wa.me/34644499294" className="text-[#0110D6] hover:underline font-medium">644 499 294</a></p>
                  <p>✉️ <a href="mailto:info@autoescolaparis.com" className="text-[#0110D6] hover:underline">info@autoescolaparis.com</a></p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#1F2937]">Sede Mollerussa</p>
                    <p className="text-xs text-zinc-500">Segunda sede</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm text-zinc-600">
                  <p>📍 Domènec Cardenal, 1 · 25230 Mollerussa</p>
                  <p>📞 <a href="tel:+34973712392" className="text-[#0110D6] hover:underline font-medium">973 712 392</a></p>
                  <p>💬 <a href="https://wa.me/34640706623" className="text-[#0110D6] hover:underline font-medium">640 706 623</a></p>
                  <p>✉️ <a href="mailto:mollerussa@autoescolaparis.com" className="text-[#0110D6] hover:underline">mollerussa@autoescolaparis.com</a></p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-purple-100">
                <p className="font-semibold text-[#1F2937] mb-2 text-sm">Horario de atención</p>
                <p className="text-sm text-zinc-600">Lunes – Viernes: 10:00–13:00 / 16:00–20:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0110D6] text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/logo.png" alt="Autoescola Paris" width={36} height={36} className="rounded-full" />
                <span className="font-bold">Autoescola Paris</span>
              </div>
              <p className="text-purple-200 text-sm mb-4">
                Formació vial de qualitat a Lleida i Mollerussa.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/ParisAutoescola/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 bg-white/10 hover:bg-[#F59E0B] rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/autoescolaparis"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 bg-white/10 hover:bg-[#F59E0B] rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@autoescolaparis"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 bg-white/10 hover:bg-[#F59E0B] rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">Lleida</p>
              <div className="flex flex-col gap-1.5 text-sm text-purple-200">
                <p>📍 Rambla d&apos;Aragó, 35, 1er</p>
                <a href="tel:+34973269438" className="hover:text-[#F59E0B] transition-colors">📞 973 269 438</a>
                <a href="https://wa.me/34644499294" className="hover:text-[#F59E0B] transition-colors">💬 644 499 294</a>
                <a href="mailto:info@autoescolaparis.com" className="hover:text-[#F59E0B] transition-colors">✉️ info@autoescolaparis.com</a>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">Mollerussa</p>
              <div className="flex flex-col gap-1.5 text-sm text-purple-200">
                <p>📍 Domènec Cardenal, 1</p>
                <a href="tel:+34973712392" className="hover:text-[#F59E0B] transition-colors">📞 973 712 392</a>
                <a href="https://wa.me/34640706623" className="hover:text-[#F59E0B] transition-colors">💬 640 706 623</a>
                <a href="mailto:mollerussa@autoescolaparis.com" className="hover:text-[#F59E0B] transition-colors">✉️ mollerussa@autoescolaparis.com</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center text-xs text-purple-300">
            © {new Date().getFullYear()} Autoescola Paris · Tots els drets reservats
          </div>
        </div>
      </footer>

      <BackToTop />
      <ChatWidget />

    </main>
  )
}
