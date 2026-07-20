'use client'

import { useRef, useState } from 'react'
import { HomeFeed } from './home-feed'
import { BottomTabBar } from './bottom-tab-bar'
import { IdlePage } from '@/components/pages/idle-page'
import { PublishPage } from '@/components/pages/publish-page'
import { NewsPage } from '@/components/pages/news-page'
import { ProfilePage } from '@/components/pages/profile-page'

/**
 * 应用外壳：管理底部 Tab 切换、全局 Toast，并渲染当前页面。
 * 各页面统一复用首页的设计系统（颜色、圆角、阴影、图标、交互）。
 */
export function HomeApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast({ msg, show: true })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }

  const handleSwitch = (page: string) => {
    // 中间「发布」按钮映射到 publish 页
    setActiveTab(page === 'publish-pre' ? 'publish' : page)
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {activeTab === 'home' && <HomeFeed showToast={showToast} />}
      {activeTab === 'idle' && <IdlePage showToast={showToast} />}
      {activeTab === 'publish' && <PublishPage showToast={showToast} onDone={() => setActiveTab('home')} />}
      {activeTab === 'news' && <NewsPage showToast={showToast} />}
      {activeTab === 'me' && <ProfilePage showToast={showToast} />}

      <BottomTabBar active={activeTab} onSwitch={handleSwitch} />

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
