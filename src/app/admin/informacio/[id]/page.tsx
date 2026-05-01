import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function actualitzarInformacio(id: string, formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  await supabase.from('alumnes_informacio').update({
    titol: formData.get('titol'),
    contingut: formData.get('contingut'),
    ordre: Number(formData.get('ordre')) || 0,
    actiu: formData.get('actiu') === 'on',
  }).eq('id', id)
  revalidatePath('/admin/informacio')
  redirect('/admin/informacio')
}

export default async function EditInformacioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: item } = await supabase.from('alumnes_informacio').select('*').eq('id', id).single()

  if (!item) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Editar informació</h1>

      <form action={actualitzarInformacio.bind(null, id)} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Títol *</label>
          <input name="titol" required defaultValue={item.titol}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Contingut *</label>
          <textarea name="contingut" required rows={8} defaultValue={item.contingut}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Ordre</label>
          <input name="ordre" type="number" defaultValue={item.ordre} min={0}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex items-center gap-2">
          <input name="actiu" type="checkbox" id="actiu" defaultChecked={item.actiu} className="w-4 h-4 accent-blue-600" />
          <label htmlFor="actiu" className="text-sm text-zinc-700">Visible per als alumnes</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
            Guardar canvis
          </button>
          <a href="/admin/informacio" className="text-sm text-zinc-500 hover:text-zinc-700 py-2">Cancel·lar</a>
        </div>
      </form>
    </div>
  )
}
