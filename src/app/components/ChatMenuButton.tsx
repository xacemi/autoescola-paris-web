'use client'

export default function ChatMenuButton() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(new CustomEvent('openChat'))
      }
      className="bg-white rounded-2xl py-4 px-2 flex flex-col items-center gap-2 shadow-md hover:shadow-lg border-2 border-transparent hover:border-[#F59E0B] active:scale-95 transition-all"
    >
      <span className="text-2xl leading-none">💬</span>
      <span className="text-xs font-semibold text-[#1F2937] text-center leading-tight">
        Hablar con IA
      </span>
    </button>
  )
}
