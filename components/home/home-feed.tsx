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
import { FloatingButtons } from './floating-buttons'
import { CitySelectPage } from './city-select-page'
import { QrDialog, CallDialog } from './home-modals'

type Props = {
  showToast: (msg: string) => void
  onOpenPost: (id: number) => void
  onOpenNotice: () => void
  onOpenSearch: () => void
}

/**
 * 首页内容（客户已确认，视觉与交互保持不变）。
 * 从原 HomeApp 抽离，便于与其他 Tab 页面共用统一外壳。
 */
export function HomeFeed({ showToast, onOpenPost, onOpenNotice, onOpenSearch }: Props) {
  const [list, setList] = useState<Post[]>(seedPosts)
  const [activeCat, setActiveCat] = useState('all')
  const [showTop, setShowTop] = useState(false)
  const [city, setCity] = useState('长沙市')
  const [cityOpen, setCityOpen] = useState(false)
  const [followOpen, setFollowOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <div className="sticky top-0 z-30">
          <StatusBar />
          <SearchBar
            cityName={city}
            onOpenCity={() => setCityOpen(true)}
            onOpenSearch={onOpenSearch}
            onFollow={() => setFollowOpen(true)}
          />
        </div>

        <BannerCarousel />
        <StatsBar totalUsers={stats.totalUsers} totalPosts={stats.totalPosts} totalViews={stats.totalViews} />
        <CategoryNav onNav={handleNav} />
        <AnnouncementBar onOpen={onOpenNotice} />

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
                    onOpenDetail={onOpenPost}
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
        onCustomerService={() => setServiceOpen(true)}
        onCall={() => setCallOpen(true)}
        onBackToTop={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 城市选择页 */}
      {cityOpen && <CitySelectPage currentCity={city} onSelect={setCity} onClose={() => setCityOpen(false)} />}

      {/* 关注公众号弹窗 */}
      <QrDialog
        open={followOpen}
        onClose={() => setFollowOpen(false)}
        title="关注公众号"
        subtitle="扫码关注「万户优铺」公众号，获取最新商铺资讯"
        image="/images/official-account-qr.png"
        imageAlt="万户优铺公众号二维码"
        tip="微信扫一扫 · 关注公众号"
        tone="primary"
      />

      {/* 在线客服（微信）弹窗 */}
      <QrDialog
        open={serviceOpen}
        onClose={() => setServiceOpen(false)}
        title="微信客服"
        subtitle="扫码添加客服微信，1 对 1 为你解答"
        image="/images/service-wechat-qr.png"
        imageAlt="客服微信二维码"
        tip="微信扫一扫 · 添加在线客服"
        tone="wechat"
      />

      {/* 电话客服弹窗 */}
      <CallDialog open={callOpen} onClose={() => setCallOpen(false)} phone="400-888-6666" />
    </div>
  )
}
