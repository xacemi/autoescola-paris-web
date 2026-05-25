import Link from 'next/link'

const sections = [
  { href: '/admin/noticias', label: 'Noticias', emoji: '📰', desc: 'Crear y editar noticias publicadas en la web' },
  { href: '/admin/horarios', label: 'Horarios', emoji: '📅', desc: 'Gestionar los horarios de clases' },
  { href: '/admin/contactos', label: 'Contactos', emoji: '📞', desc: 'Ver los mensajes recibidos' },
  { href: '/admin/alumnos', label: 'Alumnos', emoji: '👥', desc: 'Gestionar y aprobar alumnos' },
  { href: '/admin/informacio', label: 'Información', emoji: '📋', desc: 'Gestionar documentación e información' },
  { href: '/admin/enlaces', label: 'Enlaces', emoji: '🔗', desc: 'Links útiles para los alumnos' },
  { href: '/admin/precios', label: 'Precios', emoji: '💰', desc: 'Actualizar los precios de los servicios' },
  { href: '/admin/documentos', label: 'Documentos y Resúmenes', emoji: '📄', desc: 'Gestionar documentos PDF per als alumnes' },
  { href: '/admin/notificaciones', label: 'Notificaciones', emoji: '🔔', desc: 'Enviar notificaciones push als alumnes' },
  { href: '/admin/videos', label: 'Vídeos', emoji: '🎬', desc: 'Gestionar vídeos de clases' },
  { href: '/admin/ubicaciones', label: 'Ubicaciones', emoji: '🗺️', desc: 'Gestionar las zonas de examen, pistas i oficinas' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-1">Bienvenido</h1>
      <p className="text-sm text-zinc-500 mb-6">Selecciona una sección para gestionar el contenido.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col gap-2"
          >
            <span className="text-3xl">{s.emoji}</span>
            <h2 className="text-sm font-bold text-zinc-800">{s.label}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
