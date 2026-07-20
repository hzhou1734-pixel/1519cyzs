'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { posts as seedPosts, type Post } from '@/lib/home-data'
import { StatusBar } from './status-bar'
import { SearchBar } from './search-bar'
import { BannerCarousel } from './banner-carousel'
import { StatsBar } from './stats-bar'
import { CategoryNav } from './category-nav'
import { AnnouncementBar } from './announcement-bar'
import { CategoryTabs } from './category-tabs'
import { InfoCard } from './info-card'
import { AdCard } from './ad-card'
import { BottomTabBar } from './bottom-tab-bar'
import { FloatingButtons } from './floating-buttons'

export function HomeApp() {
  const [list, setList] = useState<Post[]>(seedPosts)
  const [activeCat, setActiveCat] = useState('all')
  const [activeTab, setActiveTab] = useState('home')
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false })
  const [showTop, setShowTop] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast({ msg, show: true })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setShowTop(el.scrollTop > 400)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = useMemo(() => {
    let data = activeCat === 'all' ? list : list.filter((d) => d.cat === activeCat)
    data = [...data].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    return data
  }, [list, activeCat])

  const stats = useMemo(() => {
    const totalPosts = filtered.length
    const totalViews = filtered.reduce((s, i) => s + (i.views || 0), 0)
    const totalUsers = Math.floor(totalPosts * 128 + totalViews / 5)
    return { totalUsers, totalPosts, totalViews }
  }, [filtered])

  const toggleLike = (id: number) =>
    setList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, userLiked: !p.userLiked, likes: p.likes + (p.userLiked ? -1 : 1) } : p,
      ),
    )

  const toggleFav = (id: number) =>
    setList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, userFaved: !p.userFaved, favorites: p.favorites + (p.userFaved ? -1 : 1) } : p,
      ),
    )

  const handleNav = (cat: string) => {
    setActiveCat(cat)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* scrollable screen content */}
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-20">
        {/* sticky top search */}
        <div className="sticky top-0 z-30">
          <StatusBar />
          <SearchBar
            cityName="长沙"
            onOpenCity={() => showToast('打开城市选择')}
            onOpenSearch={() => showToast('打开搜索页')}
            onFollow={() => showToast('扫码关注公众号')}
          />
        </div>

        <BannerCarousel onSelect={showToast} />
        <StatsBar totalUsers={stats.totalUsers} totalPosts={stats.totalPosts} totalViews={stats.totalViews} />
        <CategoryNav onNav={handleNav} />
        <AnnouncementBar onOpen={() => showToast('查看平台公告')} />

        <div ref={listRef} className="scroll-mt-14">
          <CategoryTabs active={activeCat} onChange={setActiveCat} />

          <div className="flex flex-col gap-3 px-3 py-1.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                <span className="text-sm">没有找到相关信息</span>
              </div>
            ) : (
              filtered.map((post, idx) => (
                <div key={post.id} className="flex flex-col gap-3">
                  <InfoCard
                    post={post}
                    onOpenDetail={(id) => showToast(`查看详情 #${id}`)}
                    onToggleLike={toggleLike}
                    onToggleFav={toggleFav}
                    onShare={(id) => showToast(`转发帖子 #${id}`)}
                  />
                  {(idx + 1) % 5 === 0 && idx + 1 < filtered.length && (
                    <AdCard position={idx + 1} onClick={(p) => showToast(`广告位 #${p / 5} — 点击跳转广告详情`)} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <FloatingButtons
        showBackToTop={showTop}
        onFollow={() => showToast('扫码关注公众号')}
        onCustomerService={() => showToast('联系在线客服')}
        onCall={() => showToast('拨打客服电话')}
        onBackToTop={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <BottomTabBar active={activeTab} onSwitch={(p) => (p === 'home' ? setActiveTab('home') : showToast(`前往「${labelOf(p)}」`))} />

      {/* toast */}
      <div
        className={`pointer-events-none absolute bottom-28 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div className="whitespace-nowrap rounded-lg bg-foreground/90 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast.msg}
        </div>
      </div>
    </div>
  )
}

function labelOf(page: string) {
  const map: Record<string, string> = {
    idle: '闲置社区',
    'publish-pre': '发布',
    news: '资讯',
    me: '我的',
  }
  return map[page] || page
}
