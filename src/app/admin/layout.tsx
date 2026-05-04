import Link from 'next/link'
import { logout } from './login/actions'

const navItems = [
  { href: '/admin', label: 'Inicio', emoji: '🏠' },
  { href: '/admin/noticias', label: 'Noticias', emoji: '📰' },
  { href: '/admin/horarios', label: 'Horarios', emoji: '📅' },
  { href: '/admin/contactos', label: 'Contactos', emoji: '📞' },
  { href: '/admin/alumnos', label: 'Alumnos', emoji: '👥' },
  { href: '/admin/informacio', label: 'Información', emoji: '📋' },
  { href: '/admin/enlaces', label: 'Enlaces', emoji: '🔗' },
  { href: '/admin/precios', label: 'Precios', emoji: '💰' },
  { href: '/admin/videos', label: 'Vídeos', emoji: '🎬' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">

      {/* HEADER MÒBIL */}
      <header className="md:hidden bg-blue-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div>
          <p className="font-bold text-sm leading-tight">Autoescuela Paris</p>
          <p className="text-xs text-blue-200">Panel de administración</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xs text-blue-200 hover:text-white border border-blue-500 px-3 py-1.5 rounded-lg transition-colors">
            🏠 Inicio
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-blue-200 hover:text-white border border-blue-500 px-3 py-1.5 rounded-lg transition-colors">
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="flex">

        {/* MENÚ LATERAL — només escriptori */}
        <aside className="hidden md:flex w-56 bg-blue-700 text-white flex-col min-h-screen sticky top-0">
          <div className="px-6 py-5 border-b border-blue-600">
            <p className="font-bold text-lg leading-tight">Autoescuela Paris</p>
            <p className="text-xs text-blue-200 mt-0.5">Panel de administración</p>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="px-3 py-4 border-t border-blue-600">
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-600 hover:text-white transition-colors text-left"
            >
              Cerrar sesión
            </button>
          </form>
        </aside>

        {/* CONTINGUT PRINCIPAL */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
