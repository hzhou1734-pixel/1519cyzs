'use client'

import { useEffect, useState } from 'react'
import { banners } from '@/lib/home-data'

export function BannerCarousel() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="px-3 pb-1.5 pt-3">
      <div className="relative aspect-[5/2] overflow-hidden rounded-xl shadow-md shadow-primary/10">
        {banners.map((b, i) => (
          <button
            type="button"
            key={b.id}
            onClick={() => onSelect(b.toast)}
            aria-label={b.title}
            className={`absolute inset-0 h-full w-full text-left transition-opacity duration-700 ${
              i === idx ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <img src={b.img || '/placeholder.svg'} alt={b.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-1.5 p-5">
              <span className="w-fit rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                精选活动
              </span>
              <h3 className="text-balance text-lg font-bold leading-tight text-white drop-shadow">{b.title}</h3>
              <p className="text-xs font-medium text-white/85">{b.subtitle}</p>
            </div>
          </button>
        ))}

        <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {banners.map((b, i) => (
            <button
              type="button"
              key={b.id}
              onClick={() => setIdx(i)}
              aria-label={`切换到第${i + 1}张`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
