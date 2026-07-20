'use client'

import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, Search, X, TrendingUp, Clock, Trash2 } from 'lucide-react'
import { StatusBar } from '@/components/home/status-bar'
import { WechatCapsule } from '@/components/shared/wechat-capsule'
import { InfoCard } from '@/components/home/info-card'
import { posts as seedPosts, type Post } from '@/lib/home-data'

type Props = {
  onBack: () => void
  onOpenPost: (id: number) => void
  showToast: (msg: string) => void
}

const HOT_WORDS = ['校园食堂', '档口转让', '奶茶设备', '品牌加盟', '麻辣烫底料', '面点师傅', '大学城旺铺']

/**
 * 搜索页：自定义搜索头部 + 热门搜索/历史（未输入时）+ 结果列表（复用首页 InfoCard 与数据）。
 * 视觉沿用首页品牌深蓝头部、圆角卡片、标签配色。
 */
export function SearchPage({ onBack, onOpenPost, showToast }: Props) {
  const [keyword, setKeyword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [history, setHistory] = useState<string[]>(['奶茶设备', '湖南大学'])
  const [list, setList] = useState<Post[]>(seedPosts)
  const inputRef = useRef<HTMLInputElement>(null)

  const runSearch = (kw: string) => {
    const q = kw.trim()
    if (!q) return
    setKeyword(q)
    setSubmitted(q)
    setHistory((prev) => [q, ...prev.filter((h) => h !== q)].slice(0, 10))
  }

  const results = useMemo(() => {
    const q = submitted.trim().toLowerCase()
    if (!q) return []
    return list.filter((p) => {
      const haystack = [p.title, p.desc, p.catLabel, p.location, ...p.tags].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [submitted, list])

  const toggleLike = (id: number) =>
    setList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, userLiked: !p.userLiked, likes: p.likes + (p.userLiked ? -1 : 1) } : p)),
    )
  const toggleFav = (id: number) =>
    setList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, userFaved: !p.userFaved, favorites: p.favorites + (p.userFaved ? -1 : 1) } : p,
      ),
    )

  const showResults = submitted.trim().length > 0

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* 搜索头部 */}
      <div className="sticky top-0 z-30">
        <StatusBar />
        <div className="relative overflow-hidden bg-gradient-to-b from-primary to-[#16304f] px-3 pb-4 pt-3">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 88% 0%, rgba(230,126,34,0.6), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
            }}
          />
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="返回"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-card py-2 pl-3 pr-2 shadow-md">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={keyword}
                autoFocus
                onChange={(e) => {
                  setKeyword(e.target.value)
                  if (e.target.value.trim() === '') setSubmitted('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) runSearch(keyword)
                }}
                placeholder="请输入关键词进行搜索"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('')
                    setSubmitted('')
                    inputRef.current?.focus()
                  }}
                  aria-label="清空"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => runSearch(keyword)}
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/30 transition-all hover:brightness-105 active:scale-95"
            >
              搜索
            </button>
            <WechatCapsule variant="light" className="shrink-0" />
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-6">
        {!showResults ? (
          <div className="flex flex-col gap-6 px-4 py-5">
            {/* 热门搜索 */}
            <section>
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-foreground">热门搜索</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {HOT_WORDS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => runSearch(w)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-[13px] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </section>

            {/* 搜索历史 */}
            {history.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">搜索历史</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHistory([])
                      showToast('已清空搜索历史')
                    }}
                    className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    清空
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => runSearch(w)}
                      className="rounded-full bg-muted px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-3 py-3">
            <p className="px-1 text-[13px] text-muted-foreground">
              {'找到 '}
              <span className="font-semibold text-foreground">{results.length}</span>
              {' 条与「'}
              <span className="font-semibold text-primary">{submitted}</span>
              {'」相关的信息'}
            </p>
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
                <Search className="h-10 w-10 opacity-40" />
                <span className="text-sm">未找到相关信息，换个关键词试试</span>
              </div>
            ) : (
              results.map((post) => (
                <InfoCard
                  key={post.id}
                  post={post}
                  onOpenDetail={onOpenPost}
                  onToggleLike={toggleLike}
                  onToggleFav={toggleFav}
                  onShare={(id) => showToast(`转发帖子 #${id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
