'use client'

type Props = {
  position: number
  onClick: (position: number) => void
}

export function AdCard({ position, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(position)}
      className="relative block w-full overflow-hidden rounded-xl border border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <img src="/images/ad-banner.png" alt="广告" className="h-24 w-full object-cover" />
      <span className="absolute left-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
        广告
      </span>
      <span className="absolute inset-y-0 left-4 flex flex-col justify-center gap-1 text-left">
        <span className="text-sm font-bold text-primary">精选推荐</span>
        <span className="text-[11px] font-medium text-accent">立即了解 ›</span>
      </span>
    </button>
  )
}
