export default function AlumnesPendentPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-bold text-zinc-800 mb-2">¡Registro recibido!</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Tu cuenta está pendiente de aprobación por parte de la autoescuela.
          Pronto recibirás un email de confirmación con acceso a la zona de alumnos.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 text-left">
          <p className="text-xs text-blue-700 font-semibold mb-1">📋 ¿Qué pasa ahora?</p>
          <ol className="text-xs text-blue-600 flex flex-col gap-1 list-decimal list-inside">
            <li>La autoescuela revisa tu registro</li>
            <li>Recibirás un email cuando seas aprobado/a</li>
            <li>Podrás acceder a la zona de alumnos</li>
          </ol>
        </div>
        <p className="text-xs text-zinc-400 mt-6">
          Si tienes alguna pregunta contacta con nosotros en{' '}
          <a href="mailto:director@autoescolaparis.com" className="text-[#0110D6]">
            director@autoescolaparis.com
          </a>
        </p>
      </div>
    </div>
  )
}
