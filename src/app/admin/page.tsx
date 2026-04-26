import Link from 'next/link'

const sections = [
  { href: '/admin/noticias', label: 'Noticias', desc: 'Crear y editar noticias publicadas en la web' },
  { href: '/admin/horarios', label: 'Horarios', desc: 'Gestionar los horarios de clases' },
  { href: '/admin/contactos', label: 'Contactos', desc: 'Ver los mensajes recibidos' },
  { href: '/admin/precios', label: 'Precios', desc: 'Actualizar los precios de los servicios' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-1">Bienvenido</h1>
      <p className="text-sm text-zinc-500 mb-8">Selecciona una sección para gestionar el contenido.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-1">{s.label}</h2>
            <p className="text-sm text-zinc-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
