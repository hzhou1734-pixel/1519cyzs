'use client'

type Chip = { cat: string; label: string }

type Props = {
  chips: Chip[]
  active: string
  onChange: (cat: string) => void
}

/** 统一的横向筛选标签栏（药丸样式），供闲置社区、资讯等列表页复用。 */
export function FilterChips({ chips, active, onChange }: Props) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2.5">
      {chips.map((c) => {
        const isActive = c.cat === active
        return (
          <button
            type="button"
            key={c.cat}
            onClick={() => onChange(c.cat)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
