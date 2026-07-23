'use client'

import { catTabs } from '@/lib/home-data'

type Props = {
  active: string
  onChange: (cat: string) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-20 -mt-1.5 bg-background/95 backdrop-blur">
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-3">
        {catTabs.map((t) => {
          const isActive = t.cat === active
          return (
            <button
              type="button"
              key={t.cat}
              onClick={() => onChange(t.cat)}
              className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-sm transition-colors ${
                isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              <span
                className={`absolute bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all ${
                  isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
