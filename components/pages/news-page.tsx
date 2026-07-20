'use client'

import { useMemo, useState } from 'react'
import { Eye, Flame } from 'lucide-react'
import { newsCats, newsArticles, type NewsArticle } from '@/lib/app-data'
import { formatNumber } from '@/lib/home-data'
import { PageHeader } from '@/components/shared/page-header'
import { FilterChips } from '@/components/shared/filter-chips'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  showToast: (msg: string) => void
  onOpenArticle: (id: number) => void
}

export function NewsPage({ showToast, onOpenArticle }: Props) {
  const [activeCat, setActiveCat] = useState('rec')

  const filtered = useMemo(
    () => (activeCat === 'rec' ? newsArticles : newsArticles.filter((a) => a.cat === activeCat)),
    [activeCat],
  )

  const [hero, ...rest] = filtered

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="行业资讯" subtitle="政策解读 · 经营干货 · 成功案例" />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur">
          <FilterChips chips={newsCats} active={activeCat} onChange={setActiveCat} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="暂无资讯" desc="该分类下还没有文章" />
        ) : (
          <div className="flex flex-col gap-3 px-3 py-1.5">
            {hero && <HeroCard article={hero} onOpen={() => onOpenArticle(hero.id)} />}
            {rest.map((a) => (
              <ArticleRow key={a.id} article={a} onOpen={() => onOpenArticle(a.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HeroCard({ article, onOpen }: { article: NewsArticle; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      {article.cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={article.cover || '/placeholder.svg'}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {article.hot && (
            <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
              <Flame className="h-3 w-3" />
              热门
            </span>
          )}
        </div>
      )}
      <div className="p-3.5">
        <h3 className="mb-1.5 text-[15px] font-semibold leading-snug text-foreground">{article.title}</h3>
        <p className="mb-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{article.summary}</p>
        <Meta article={article} />
      </div>
    </button>
  )
}

function ArticleRow({ article, onOpen }: { article: NewsArticle; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="mb-1 line-clamp-2 text-[14px] font-semibold leading-snug text-foreground">
          {article.hot && (
            <span className="mr-1 inline-flex items-center gap-0.5 rounded bg-accent-soft px-1 py-0.5 align-middle text-[10px] font-bold text-accent">
              <Flame className="h-2.5 w-2.5" />
              热
            </span>
          )}
          {article.title}
        </h3>
        <p className="mb-auto line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{article.summary}</p>
        <div className="mt-2">
          <Meta article={article} />
        </div>
      </div>
      {article.cover && (
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={article.cover || '/placeholder.svg'}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </button>
  )
}

function Meta({ article }: { article: NewsArticle }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
      <span className="font-medium text-primary">{article.source}</span>
      <span>{article.publishDate}</span>
      <span className="flex items-center gap-0.5">
        <Eye className="h-3 w-3" />
        {formatNumber(article.views)}
      </span>
    </div>
  )
}
