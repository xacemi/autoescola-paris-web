import Link from 'next/link'
import { logout } from './login/actions'

const navItems = [
  { href: '/admin', label: 'Inicio' },
  { href: '/admin/noticias', label: 'Noticias' },
  { href: '/admin/horarios', label: 'Horarios' },
  { href: '/admin/contactos', label: 'Contactos' },
  { href: '/admin/precios', label: 'Precios' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-zinc-100">
      <aside className="w-56 bg-blue-700 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-blue-600">
          <p className="font-bold text-lg leading-tight">Autoescuela Paris</p>
          <p className="text-xs text-blue-200 mt-0.5">Panel de administración</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
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

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
