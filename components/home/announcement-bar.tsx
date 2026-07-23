'use client'

import { Megaphone, ChevronRight } from 'lucide-react'
import { announcements } from '@/lib/home-data'

type Props = {
  onOpen: () => void
}

export function AnnouncementBar({ onOpen }: Props) {
  const text = announcements[0]
  return (
    <div className="px-3 py-1.5">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-2.5 overflow-hidden rounded-xl border border-accent/20 bg-accent-soft px-3.5 py-2.5 text-left transition-colors hover:bg-accent/10"
      >
        <Megaphone className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.2} />
        <div className="relative flex-1 overflow-hidden">
          <span className="wp-marquee text-xs font-medium text-foreground">{text}　　　{text}</span>
        </div>
        <span className="flex shrink-0 items-center text-[11px] font-medium text-accent">
          更多
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  )
}
