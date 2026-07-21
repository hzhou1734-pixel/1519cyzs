'use client'

import { useMemo, useState } from 'react'
import { Search, MapPin, Check, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { regions } from '@/lib/app-data'

type Props = {
  currentCity: string
  onSelect: (city: string) => void
  onClose: () => void
}

const HOT_CITIES = ['长沙市', '武汉市', '广州市', '深圳市', '南昌市', '株洲市']

export function CitySelectPage({ currentCity, onSelect, onClose }: Props) {
  const [keyword, setKeyword] = useState('')

  // 按省份分组的城市列表
  const grouped = useMemo(
    () =>
      regions.map((p) => ({
        province: p.name,
        cities: (p.children ?? []).map((c) => c.name),
      })),
    [],
  )

  const filtered = useMemo(() => {
    const kw = keyword.trim()
    if (!kw) return grouped
    return grouped
      .map((g) => ({ province: g.province, cities: g.cities.filter((c) => c.includes(kw) || g.province.includes(kw)) }))
      .filter((g) => g.cities.length > 0)
  }, [grouped, keyword])

  const pick = (city: string) => {
    onSelect(city)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background duration-300 animate-in slide-in-from-right">
      <PageHeader title="选择城市" onBack={onClose} />

      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        {/* 搜索框 */}
        <div className="sticky top-0 z-10 bg-background px-3 py-3">
          <div className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="输入城市名称查询"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {keyword && (
              <button type="button" onClick={() => setKeyword('')} aria-label="清空" className="shrink-0 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 当前定位 */}
        {!keyword && (
          <section className="px-3 pb-1">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">当前定位</p>
            <button
              type="button"
              onClick={() => pick(currentCity)}
              className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary-soft px-4 py-2.5 text-sm font-semibold text-primary"
            >
              <MapPin className="h-4 w-4 text-accent" strokeWidth={2.4} />
              {currentCity}
            </button>
          </section>
        )}

        {/* 热门城市 */}
        {!keyword && (
          <section className="px-3 py-3">
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">热门城市</p>
            <div className="grid grid-cols-3 gap-2.5">
              {HOT_CITIES.map((c) => {
                const active = c === currentCity
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => pick(c)}
                    className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      active ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-card text-foreground hover:border-primary/50'
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* 全部城市（按省分组） */}
        <section className="px-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">未找到相关城市</div>
          ) : (
            filtered.map((g) => (
              <div key={g.province} className="mb-2">
                <p className="bg-muted/60 px-2 py-1.5 text-[12px] font-semibold text-muted-foreground">{g.province}</p>
                <ul>
                  {g.cities.map((c) => {
                    const active = c === currentCity
                    return (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => pick(c)}
                          className="flex w-full items-center justify-between border-b border-border px-2 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted/40"
                        >
                          {c}
                          {active && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}
