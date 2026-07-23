'use client'

import { useMemo, useState } from 'react'
import { MapPin, Flame } from 'lucide-react'
import { idleCats, idleItems, type IdleItem } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { FilterChips } from '@/components/shared/filter-chips'
import { SearchInput } from '@/components/shared/search-input'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  onOpenItem: (id: number) => void
}

export function IdlePage({ onOpenItem }: Props) {
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const byCat = activeCat === 'all' ? idleItems : idleItems.filter((i) => i.cat === activeCat)
    const q = query.trim().toLowerCase()
    if (!q) return byCat
    return byCat.filter((i) => i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q))
  }, [activeCat, query])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="闲置社区" />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur">
          <SearchInput value={query} onChange={setQuery} placeholder="搜索闲置物品、地点" />
          <FilterChips chips={idleCats} active={activeCat} onChange={setActiveCat} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={query ? '未找到相关物品' : '暂无闲置物品'} desc={query ? '换个关键词试试吧' : '该分类下还没有物品，换个分类看看吧'} />
        ) : (
          <div className="grid grid-cols-2 gap-3 px-3 py-1.5">
            {filtered.map((item) => (
              <IdleCard key={item.id} item={item} onOpen={() => onOpenItem(item.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function IdleCard({ item, onOpen }: { item: IdleItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute left-1.5 top-1.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {item.cond}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">{item.title}</h3>

        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-base font-bold text-accent">¥{item.price}</span>
          {item.original && (
            <span className="font-mono text-[11px] text-muted-foreground line-through">¥{item.original}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex min-w-0 items-center gap-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-accent">
            <Flame className="h-3 w-3" />
            {item.wants}
          </span>
        </div>
      </div>
    </button>
  )
}
