import NoticiaForm from '../NoticiaForm'
import { createNoticia } from '../actions'

export default function NuevaNoticiaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Nueva noticia</h1>
      <NoticiaForm action={createNoticia} />
    </div>
  )
}
