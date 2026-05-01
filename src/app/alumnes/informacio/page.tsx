export default function InformacioPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-zinc-800">📋 Informació</h1>
                <p className="text-sm text-zinc-500 mt-1">Informació important per als alumnes</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-zinc-500 text-sm">Pròximament...</p>
            </div>
        </div>
    )
}