'use client'

import { useRef, useState } from 'react'
import { HomeFeed } from './home-feed'
import { BottomTabBar } from './bottom-tab-bar'
import { IdlePage } from '@/components/pages/idle-page'
import { PublishPage } from '@/components/pages/publish-page'
import { NewsPage } from '@/components/pages/news-page'
import { ProfilePage } from '@/components/pages/profile-page'
import { PostDetail } from '@/components/pages/post-detail'
import { IdleDetail } from '@/components/pages/idle-detail'
import { NewsDetail } from '@/components/pages/news-detail'

type Detail = { type: 'post' | 'idle' | 'news'; id: number }

/**
 * 应用外壳：管理底部 Tab 切换、详情页覆盖层、全局 Toast，并渲染当前页面。
 * 各页面统一复用首页的设计系统（颜色、圆角、阴影、图标、交互）。
 */
export function HomeApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [detail, setDetail] = useState<Detail | null>(null)
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast({ msg, show: true })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }

  const openDetail = (d: Detail) => setDetail(d)
  const closeDetail = () => setDetail(null)

  const handleSwitch = (page: string) => {
    // 中间「发布」按钮映射到 publish 页
    setActiveTab(page === 'publish-pre' ? 'publish' : page)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {activeTab === 'home' && <HomeFeed showToast={showToast} onOpenPost={(id) => openDetail({ type: 'post', id })} />}
      {activeTab === 'idle' && <IdlePage showToast={showToast} onOpenItem={(id) => openDetail({ type: 'idle', id })} />}
      {activeTab === 'publish' && <PublishPage showToast={showToast} onDone={() => setActiveTab('home')} />}
      {activeTab === 'news' && <NewsPage showToast={showToast} onOpenArticle={(id) => openDetail({ type: 'news', id })} />}
      {activeTab === 'me' && <ProfilePage showToast={showToast} />}

      <BottomTabBar active={activeTab} onSwitch={handleSwitch} />

      {/* 详情页覆盖层（滑入，返回后保留列表滚动位置） */}
      {detail && (
        <div className="absolute inset-0 z-40 bg-background duration-300 animate-in slide-in-from-right">
          {detail.type === 'post' && <PostDetail postId={detail.id} onBack={closeDetail} showToast={showToast} />}
          {detail.type === 'idle' && <IdleDetail itemId={detail.id} onBack={closeDetail} showToast={showToast} />}
          {detail.type === 'news' && (
            <NewsDetail
              articleId={detail.id}
              onBack={closeDetail}
              onOpenArticle={(id) => openDetail({ type: 'news', id })}
              showToast={showToast}
            />
          )}
        </div>
      )}

      {/* 全局 Toast */}
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
