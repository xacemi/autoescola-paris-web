import { createSupabaseServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AlumnesHomePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: alumne } = await supabase
    .from('alumnes_autoritzats')
    .select('nom, seu, data_registre')
    .eq('email', user!.email!)
    .single()

  return (
    <div className="flex flex-col gap-6">
      {/* Bienvenida */}
      <div className="bg-[#0110D6] rounded-2xl p-6 text-white">
        <p className="text-sm text-blue-200 mb-1">Bienvenido/a,</p>
        <h1 className="text-xl font-bold">{alumne?.nom}</h1>
        <p className="text-xs text-blue-200 mt-1">📍 {alumne?.seu}</p>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/alumnes/videos', emoji: '🎬', label: 'Vídeos de clases', desc: 'Repeticiones en línea' },
          { href: '/alumnes/horaris', emoji: '📅', label: 'Horarios', desc: 'Confirma asistencia' },
          { href: '/alumnes/informacio', emoji: '📋', label: 'Información', desc: 'Examen y documentación' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 hover:border-[#0110D6] transition-all flex flex-col gap-2">
            <span className="text-3xl">{item.emoji}</span>
            <p className="font-bold text-[#1F2937] text-sm">{item.label}</p>
            <p className="text-xs text-zinc-400">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
