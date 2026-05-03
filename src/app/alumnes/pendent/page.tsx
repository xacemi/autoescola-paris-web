export default function AlumnesPendentPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-bold text-zinc-800 mb-2">Registre rebut!</h1>
        <p className="text-sm text-zinc-500 mb-6">
          El teu compte està pendent d&apos;aprovació per part de l&apos;autoescola. 
          Aviat rebràs un email de confirmació amb accés a la zona d&apos;alumnes.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 text-left">
          <p className="text-xs text-blue-700 font-semibold mb-1">📋 Què passa ara?</p>
          <ol className="text-xs text-blue-600 flex flex-col gap-1 list-decimal list-inside">
            <li>L&apos;autoescola revisa el teu registre</li>
            <li>Rebràs un email quan siguis aprovat/da</li>
            <li>Podràs accedir a la zona d&apos;alumnes</li>
          </ol>
        </div>
        <p className="text-xs text-zinc-400 mt-6">
          Si tens alguna pregunta contacta amb nosaltres a{' '}
          <a href="mailto:director@autoescolaparis.com" className="text-[#0110D6]">
            director@autoescolaparis.com
          </a>
        </p>
      </div>
    </div>
  )
}
