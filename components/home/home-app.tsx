'use client'

import { useRef, useState } from 'react'
import { HomeFeed } from './home-feed'
import { BottomTabBar } from './bottom-tab-bar'
import { IdlePage } from '@/components/pages/idle-page'
import { PublishPage } from '@/components/pages/publish-page'
import { PaymentPage } from '@/components/pages/payment-page'
import { NewsPage } from '@/components/pages/news-page'
import { ProfilePage } from '@/components/pages/profile-page'
import { PostDetail } from '@/components/pages/post-detail'
import { IdleDetail } from '@/components/pages/idle-detail'
import { NewsDetail } from '@/components/pages/news-detail'
import { NoticePage } from '@/components/pages/notice-page'
import { ProfileSubPage } from '@/components/pages/profile-sub'
import { SearchPage } from '@/components/pages/search-page'
import { LoginPage } from '@/components/pages/login-page'

type Overlay =
  | { kind: 'post'; id: number; own?: boolean }
  | { kind: 'idle' | 'news'; id: number }
  | { kind: 'notice' }
  | { kind: 'search' }
  | { kind: 'publish' }
  | { kind: 'payment'; amount: number; label: string }
  | { kind: 'sub'; key: string }

/**
 * 应用外壳：管理底部 Tab 切换、覆盖层栈（详情/公告/我的子页）、全局 Toast。
 * 各页面统一复用首页的设计系统（颜色、圆角、阴影、图标、交互）。
 */
export function HomeApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [stack, setStack] = useState<Overlay[]>([])
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const showToast = (msg: string) => {
    setToast({ msg, show: true })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800)
  }

  const push = (o: Overlay) => setStack((s) => [...s, o])
  const pop = () => setStack((s) => s.slice(0, -1))

  const requestLogin = () => setLoginOpen(true)

  const handleSwitch = (page: string) => {
    // 发布以覆盖层形式打开（层级高于底部导航，避免提交栏被遮挡）
    if (page === 'publish-pre') {
      if (!loggedIn) {
        requestLogin()
        return
      }
      push({ kind: 'publish' })
      return
    }
    // 「我的」需登录后才能进入
    if (page === 'me' && !loggedIn) {
      requestLogin()
      return
    }
    setStack([]) // 切换主 Tab 时清空覆盖层
    setActiveTab(page)
  }

  const top = stack[stack.length - 1]

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {activeTab === 'home' && (
        <HomeFeed
          showToast={showToast}
          onOpenPost={(id) => push({ kind: 'post', id })}
          onOpenNotice={() => push({ kind: 'notice' })}
          onOpenSearch={() => push({ kind: 'search' })}
        />
      )}
      {activeTab === 'idle' && <IdlePage onOpenItem={(id) => push({ kind: 'idle', id })} />}
      {activeTab === 'news' && <NewsPage showToast={showToast} onOpenArticle={(id) => push({ kind: 'news', id })} />}
      {activeTab === 'me' && <ProfilePage onOpenSub={(key) => push({ kind: 'sub', key })} />}

      <BottomTabBar active={activeTab} onSwitch={handleSwitch} />

      {/* 覆盖层栈（滑入，返回后保留底层 Tab 滚动位置） */}
      {top && (
        <div className="absolute inset-0 z-40 bg-background duration-300 animate-in slide-in-from-right">
          {top.kind === 'post' && <PostDetail postId={top.id} isOwn={top.own} onBack={pop} showToast={showToast} />}
          {top.kind === 'idle' && <IdleDetail itemId={top.id} onBack={pop} showToast={showToast} />}
          {top.kind === 'news' && (
            <NewsDetail articleId={top.id} onBack={pop} onOpenArticle={(id) => push({ kind: 'news', id })} showToast={showToast} />
          )}
          {top.kind === 'notice' && <NoticePage onBack={pop} showToast={showToast} />}
          {top.kind === 'search' && (
            <SearchPage onBack={pop} onOpenPost={(id) => push({ kind: 'post', id })} showToast={showToast} />
          )}
          {top.kind === 'publish' && (
            <PublishPage
              showToast={showToast}
              onDone={pop}
              onPay={(amount, label) => push({ kind: 'payment', amount, label })}
            />
          )}
          {top.kind === 'payment' && (
            <PaymentPage
              amount={top.amount}
              label={top.label}
              onBack={pop}
              onSuccess={() => setStack((s) => s.slice(0, -2))}
              showToast={showToast}
            />
          )}
          {top.kind === 'sub' && (
            <ProfileSubPage
              sub={top.key}
              onBack={pop}
              onOpenPost={(id, own) => push({ kind: 'post', id, own })}
              showToast={showToast}
              onOpenSub={(key) => push({ kind: 'sub', key })}
              onLogout={() => {
                setLoggedIn(false)
                setStack([])
                setActiveTab('home')
                showToast('已退出登录')
              }}
            />
          )}
        </div>
      )}

      {/* 登录页（最高层级，覆盖底部导航与其它覆盖层） */}
      {loginOpen && (
        <LoginPage
          showToast={showToast}
          onClose={() => setLoginOpen(false)}
          onSuccess={(phone) => {
            setLoggedIn(true)
            setLoginOpen(false)
            setStack([])
            setActiveTab('me')
            showToast(`欢迎回来，${phone.slice(0, 3)}****${phone.slice(7)}`)
          }}
        />
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
