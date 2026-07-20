'use client'

import { MapPin, ChevronDown, Search } from 'lucide-react'

type Props = {
  cityName: string
  onOpenCity: () => void
  onOpenSearch: () => void
  onFollow: () => void
}

export function SearchBar({ cityName, onOpenCity, onOpenSearch, onFollow }: Props) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary to-[#16304f] px-3 pb-4 pt-3">
      {/* subtle geometric texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 88% 0%, rgba(230,126,34,0.6), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
        }}
      />

      {/* 标题栏 */}
      <div className="relative mb-3 flex items-center justify-center">
        <h1 className="text-lg font-bold tracking-wide text-white">万户优铺</h1>
      </div>

      {/* 搜索行 */}
      <div className="relative flex items-center gap-2.5">
        <div
          onClick={onOpenSearch}
          className="flex flex-1 cursor-pointer items-center gap-2 rounded-full bg-card py-2.5 pl-3 pr-4 shadow-md transition-shadow hover:shadow-lg"
        >
          <button
            type="button"
            id="cityLocator"
            onClick={(e) => {
              e.stopPropagation()
              onOpenCity()
            }}
            className="flex shrink-0 items-center gap-0.5 border-r border-border pr-2.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-accent" strokeWidth={2.4} />
            <span id="currentCityName">{cityName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm text-muted-foreground">请输入关键词进行搜索</span>
        </div>
        <button
          type="button"
          onClick={onFollow}
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-md shadow-accent/30 transition-all hover:brightness-105 active:scale-95"
        >
          关注
        </button>
      </div>
    </div>
  )
}
