import { createSupabaseServerClient } from '@/lib/supabase-server'
import { logoutAlumne } from './login/actions'
import Link from 'next/link'
import Image from 'next/image'

export default async function AlumnesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si no hi ha usuari, mostrem el contingut sense header (serà el login)
  if (!user) {
    return <>{children}</>
  }

  // Verificar que és alumne
  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('nom, seu')
    .eq('email', user.email!)
    .single()

  // Si no és alumne, mostrem el contingut sense header (serà el login)
  if (!alumne) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <header className="bg-[#0110D6] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Autoescola Paris" width={32} height={32} className="rounded-full" />
            <div>
              <p className="font-bold text-sm leading-tight">Zona Alumnes</p>
              <p className="text-xs text-blue-200">{alumne.nom}</p>
            </div>
          </div>
          <form action={logoutAlumne}>
            <button type="submit" className="text-xs text-blue-200 hover:text-white transition-colors">
              Sortir
            </button>
          </form>
        </div>
        {/* Nav */}
        <nav className="max-w-lg mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {[
            { href: '/alumnes', label: '🏠 Inici' },
            { href: '/alumnes/videos', label: '🎬 Vídeos' },
            { href: '/alumnes/horaris', label: '📅 Horaris' },
            { href: '/alumnes/informacio', label: '📋 Informació' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="whitespace-nowrap text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
