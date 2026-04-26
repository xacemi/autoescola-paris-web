import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import NoticiaForm from '../NoticiaForm'
import { updateNoticia } from '../actions'

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: noticia } = await supabase
    .from('noticies')
    .select('id, titol, contingut, publicada')
    .eq('id', id)
    .single()

  if (!noticia) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Editar noticia</h1>
      <NoticiaForm action={updateNoticia} noticia={noticia} />
    </div>
  )
}
