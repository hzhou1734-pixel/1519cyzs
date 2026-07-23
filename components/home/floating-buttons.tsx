'use client'

import { Headphones, Phone, ArrowUp } from 'lucide-react'

type Props = {
  showBackToTop: boolean
  onCustomerService: () => void
  onCall: () => void
  onBackToTop: () => void
}

export function FloatingButtons({ showBackToTop, onCustomerService, onCall, onBackToTop }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-30 w-full">
      {/* 左侧：客服 / 电话 */}
      <div className="pointer-events-auto absolute bottom-24 left-3 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={onCustomerService}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-lg ring-1 ring-border transition-transform hover:scale-105 active:scale-95"
          title="客服"
        >
          <Headphones className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onCall}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary shadow-lg ring-1 ring-border transition-transform hover:scale-105 active:scale-95"
          title="电话"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>

      {/* 右侧：回到顶部（位置保留不变） */}
      <div className="pointer-events-auto absolute bottom-24 right-3">
        <button
          type="button"
          onClick={onBackToTop}
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 ${
            showBackToTop ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
          }`}
          title="回到顶部"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
