'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Headphones,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Crown,
  Bell,
  Lock,
  Eye,
  Trash2,
  LogOut,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  X,
  Pencil,
  ArrowUpToLine,
  ArrowDownToLine,
  Heart,
  Star,
  MapPin,
  Clock,
  Wallet,
  Smartphone,
  Check,
  Share2,
  UserPlus,
  Receipt,
  QrCode,
  type LucideIcon,
} from 'lucide-react'
import { posts as seedPosts, type Post, formatNumber } from '@/lib/home-data'
import { profile } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  sub: string
  onBack: () => void
  onOpenPost: (id: number, own?: boolean) => void
  showToast: (msg: string) => void
  onLogout: () => void
  onOpenSub: (key: string) => void
}

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  posts: { title: '我的发布', subtitle: '你发布的商业信息' },
  favorites: { title: '我的收藏' },
  likes: { title: '我的点赞' },
  history: { title: '浏览历史' },
  points: { title: '我的积分' },
  invite: { title: '邀请好友' },
  notify: { title: '消息通知' },
  orders: { title: '订单中心' },
  wallet: { title: '我的钱包' },
  service: { title: '客服中心' },
  feedback: { title: '意见反馈' },
  settings: { title: '设置' },
  edit: { title: '编辑资料' },
  vip: { title: '商户会员' },
  password: { title: '修改密码' },
  about: { title: '关于万户优铺' },
}

export function ProfileSubPage({ sub, onBack, onOpenPost, showToast, onLogout, onOpenSub }: Props) {
  const head = TITLES[sub] ?? { title: '详情' }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title={head.title} subtitle={head.subtitle} onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        {sub === 'posts' && <MyPostsView onOpenPost={onOpenPost} showToast={showToast} />}
        {sub === 'favorites' && <MyFavoritesView onOpenPost={onOpenPost} showToast={showToast} />}
        {sub === 'likes' && <MyLikesView onOpenPost={onOpenPost} showToast={showToast} />}
        {sub === 'history' && <MyHistoryView onOpenPost={onOpenPost} showToast={showToast} />}
        {sub === 'points' && <PointsView />}
        {sub === 'invite' && <InviteView showToast={showToast} />}
        {sub === 'notify' && <NotifyView showToast={showToast} />}
        {sub === 'orders' && <OrdersView showToast={showToast} />}
        {sub === 'wallet' && <WalletView showToast={showToast} />}
        {sub === 'service' && <ServiceView showToast={showToast} />}
        {sub === 'feedback' && <FeedbackView showToast={showToast} onBack={onBack} />}
        {sub === 'settings' && <SettingsView showToast={showToast} onLogout={onLogout} onOpenSub={onOpenSub} />}
        {sub === 'edit' && <EditProfileView showToast={showToast} onBack={onBack} />}
        {sub === 'vip' && <VipView showToast={showToast} />}
        {sub === 'password' && <ChangePasswordView showToast={showToast} onBack={onBack} />}
        {sub === 'about' && <AboutView />}
      </div>
    </div>
  )
}

/* ------------------------- 子页内搜索框 ------------------------- */

function SubSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="sticky top-0 z-10 bg-background px-3 py-2.5">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} aria-label="清空" className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ------------------------- 通用缩略图 ------------------------- */

function Thumb({ post }: { post: Post }) {
  if (post.images.length > 0) {
    return (
      <span className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={post.images[0] || '/placeholder.svg'} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
      </span>
    )
  }
  return (
    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[11px] font-medium text-primary">
      {post.catLabel}
    </span>
  )
}

/* ------------------------- 我的发布 ------------------------- */

type MyPost = Post & { status: 'on' | 'off' }

function MyPostsView({ onOpenPost, showToast }: { onOpenPost: (id: number, own?: boolean) => void; showToast: (msg: string) => void }) {
  const [query, setQuery] = useState('')
  const [list, setList] = useState<MyPost[]>(() =>
    seedPosts.slice(0, 5).map((p, i) => ({ ...p, status: i === 1 ? 'off' : 'on' })),
  )

  const filtered = useMemo(
    () => list.filter((p) => p.title.includes(query) || p.desc.includes(query)),
    [list, query],
  )

  const toggleShelf = (id: number) =>
    setList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = p.status === 'on' ? 'off' : 'on'
        showToast(next === 'on' ? '信息已上架' : '信息已下架')
        return { ...p, status: next }
      }),
    )
  const remove = (id: number) => {
    setList((prev) => prev.filter((p) => p.id !== id))
    showToast('已删除该信息')
  }

  return (
    <>
      <SubSearch value={query} onChange={setQuery} placeholder="搜索我发布的信息" />
      {filtered.length === 0 ? (
        <EmptyState desc={query ? '没有匹配的信息' : '你还没有发布信息'} />
      ) : (
        <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
          {filtered.map((post) => (
            <div key={post.id} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
              <div onClick={() => onOpenPost(post.id, true)} className="flex cursor-pointer gap-3">
                <Thumb post={post} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="mb-1 flex items-start gap-2">
                    <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">{post.title}</h3>
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        post.status === 'on' ? 'bg-primary-soft text-primary' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {post.status === 'on' ? '上架中' : '已下架'}
                    </span>
                  </div>
                  <p className="mb-1 text-[11px] text-muted-foreground">
                    {post.catLabel} · {post.publishDate}
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {formatNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {formatNumber(post.likes)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <ActionBtn icon={Pencil} label="编辑" onClick={() => showToast('编辑信息')} />
                <ActionBtn
                  icon={post.status === 'on' ? ArrowDownToLine : ArrowUpToLine}
                  label={post.status === 'on' ? '下架' : '上架'}
                  onClick={() => toggleShelf(post.id)}
                />
                <ActionBtn icon={Trash2} label="删除" danger onClick={() => remove(post.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function ActionBtn({ icon: Icon, label, onClick, danger }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
        danger ? 'text-destructive hover:bg-destructive/5' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

/* ------------------------- 我的收藏 ------------------------- */

function MyFavoritesView({ onOpenPost, showToast }: { onOpenPost: (id: number) => void; showToast: (msg: string) => void }) {
  const [query, setQuery] = useState('')
  const [list, setList] = useState<Post[]>(() => {
    const faved = seedPosts.filter((p) => p.userFaved)
    return faved.length > 0 ? faved : seedPosts.slice(2, 6)
  })

  const filtered = useMemo(
    () => list.filter((p) => p.title.includes(query) || p.desc.includes(query)),
    [list, query],
  )

  const unfav = (id: number) => {
    setList((prev) => prev.filter((p) => p.id !== id))
    showToast('已取消收藏')
  }

  return (
    <>
      <SubSearch value={query} onChange={setQuery} placeholder="搜索我收藏的信息" />
      {filtered.length === 0 ? (
        <EmptyState desc={query ? '没有匹配的信息' : '还没有收藏任何信息，去首页看看吧'} />
      ) : (
        <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
          {filtered.map((post) => (
            <CompactCard
              key={post.id}
              post={post}
              onOpen={() => onOpenPost(post.id)}
              actionIcon={Star}
              actionLabel="取消收藏"
              onAction={() => unfav(post.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

/* ------------------------- 我的点赞 ------------------------- */

function MyLikesView({ onOpenPost, showToast }: { onOpenPost: (id: number) => void; showToast: (msg: string) => void }) {
  const [list, setList] = useState<Post[]>(() => {
    const liked = seedPosts.filter((p) => p.userLiked)
    return liked.length > 0 ? liked : seedPosts.slice(0, 4)
  })

  // 取消点赞后���从「我的点赞」列表移除
  const unlike = (id: number) => {
    setList((prev) => prev.filter((p) => p.id !== id))
    showToast('已取消点赞')
  }

  if (list.length === 0) return <EmptyState desc="还没有点赞任何信息" />

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {list.map((post) => (
        <CompactCard
          key={post.id}
          post={post}
          onOpen={() => onOpenPost(post.id)}
          actionIcon={Heart}
          actionLabel="取消点赞"
          onAction={() => unlike(post.id)}
        />
      ))}
    </div>
  )
}

function CompactCard({
  post,
  onOpen,
  actionIcon: ActionIcon,
  actionLabel,
  onAction,
}: {
  post: Post
  onOpen: () => void
  actionIcon: LucideIcon
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md">
      <div onClick={onOpen} className="flex min-w-0 flex-1 cursor-pointer gap-3">
        <Thumb post={post} />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{post.title}</h3>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{post.location}</span>
          </div>
          <div className="mt-auto flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">{post.catLabel}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(post.views)}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-medium text-accent transition-colors hover:bg-accent-soft"
      >
        <ActionIcon className="h-4 w-4" fill="currentColor" />
        {actionLabel}
      </button>
    </div>
  )
}

/* ------------------------- 浏览历史（时间轴） ------------------------- */

function MyHistoryView({ onOpenPost, showToast }: { onOpenPost: (id: number) => void; showToast: (msg: string) => void }) {
  // 为演示分配浏览时间分组
  const initial = useMemo(() => {
    const src = seedPosts.slice(0, 7)
    const buckets = ['今天', '今天', '今天', '昨天', '昨天', '更早', '更早']
    const times = ['14:32', '11:05', '09:18', '20:47', '15:22', '07-16 18:30', '07-14 10:12']
    return src.map((p, i) => ({ ...p, group: buckets[i], viewedAt: times[i] }))
  }, [])

  const [list, setList] = useState(initial)

  const groups = useMemo(() => {
    const order = ['今天', '昨天', '更早']
    return order
      .map((g) => ({ group: g, items: list.filter((it) => it.group === g) }))
      .filter((g) => g.items.length > 0)
  }, [list])

  if (list.length === 0) return <EmptyState desc="暂无浏览记录" />

  return (
    <div className="px-3 py-3">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setList([])
            showToast('已清空浏览历史')
          }}
          className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          清空
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map((g) => (
          <div key={g.group}>
            <div className="mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-[13px] font-bold text-foreground">{g.group}</h2>
            </div>
            <div className="relative pl-4">
              {/* 时间轴竖线 */}
              <span aria-hidden className="absolute bottom-1 left-[3px] top-1 w-px bg-border" />
              <div className="flex flex-col gap-3">
                {g.items.map((post) => (
                  <div key={post.id} className="relative">
                    {/* 时间轴节点 */}
                    <span aria-hidden className="absolute -left-4 top-3 h-1.5 w-1.5 -translate-x-[2px] rounded-full bg-primary ring-2 ring-background" />
                    <div
                      onClick={() => onOpenPost(post.id)}
                      className="flex cursor-pointer gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <Thumb post={post} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{post.title}</h3>
                        <p className="mt-1 text-[11px] text-muted-foreground">{post.catLabel}</p>
                        <p className="mt-auto pt-1 text-[11px] text-muted-foreground">浏览于 {post.viewedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------- 我的积分 ------------------------- */

const POINT_LOGS: { id: number; title: string; date: string; amount: number }[] = [
  { id: 3, title: '积分兑换 · 置顶券', date: '2026-07-18', amount: -100 },
  { id: 4, title: '邀请好友注册', date: '2026-07-16', amount: 50 },
]

function PointsView() {
  const points = 1280

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#16304f] p-5 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(230,126,34,0.7), transparent 45%)' }}
        />
        <p className="relative text-[12px] text-white/70">当前积分</p>
        <p className="relative mt-1 font-mono text-3xl font-bold text-white">{points}</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">积分明细</h2>
        <div className="flex flex-col">
          {POINT_LOGS.map((r, i) => (
            <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i !== POINT_LOGS.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
              </div>
              <span className={`font-mono text-sm font-bold ${r.amount > 0 ? 'text-destructive' : 'text-primary'}`}>
                {r.amount > 0 ? `+${r.amount}` : r.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ------------------------- 邀请好友 ------------------------- */

  const INVITE_RECORDS: { id: number; name: string; date: string; reward: number }[] = [
    { id: 1, name: '王**', date: '2026-07-18', reward: 50 },
    { id: 2, name: '李**', date: '2026-07-15', reward: 50 },
    { id: 3, name: '张**', date: '2026-07-10', reward: 50 },
  ]

function InviteView({ showToast }: { showToast: (msg: string) => void }) {
  const code = 'WHYP8888'
  const invited = INVITE_RECORDS.length
  const earned = INVITE_RECORDS.reduce((s, r) => s + r.reward, 0)
  const [posterOpen, setPosterOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent to-[#c85a12] p-5 text-center shadow-sm">
        <p className="relative text-sm font-bold text-white">邀请好友，双方各得 50 积分</p>
        <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
          <span className="text-[12px] text-white/80">邀请码</span>
          <span className="font-mono text-base font-bold tracking-widest text-white">{code}</span>
          <button
            type="button"
            onClick={() => showToast('邀请码已复制')}
            className="ml-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-accent"
          >
            复制
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-4 shadow-sm">
          <span className="font-mono text-xl font-bold text-primary">{invited}</span>
          <span className="text-[12px] text-muted-foreground">已邀请好友</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-4 shadow-sm">
          <span className="font-mono text-xl font-bold text-accent">{earned}</span>
          <span className="text-[12px] text-muted-foreground">累计获得积分</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPosterOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <Share2 className="h-4 w-4 text-primary" />
          生成海报
        </button>
        <button
          type="button"
          onClick={() => showToast('已唤起微信分享')}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
        >
          <UserPlus className="h-4 w-4" />
          邀请好友
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">邀请记录</h2>
        <div className="flex flex-col">
          {INVITE_RECORDS.map((r, i) => (
            <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i !== INVITE_RECORDS.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                <UserPlus className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
              </div>
              <span className="font-mono text-sm font-bold text-primary">+{r.reward}</span>
            </div>
          ))}
        </div>
      </section>

      {posterOpen && <InvitePoster code={code} onClose={() => setPosterOpen(false)} showToast={showToast} />}
    </div>
  )
}

function InvitePoster({ code, onClose, showToast }: { code: string; onClose: () => void; showToast: (msg: string) => void }) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-black/60 px-6 py-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="邀请海报"
      onClick={onClose}
    >
      <div className="flex shrink-0 justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 w-full" onClick={(e) => e.stopPropagation()}>
        {/* 海报卡片 */}
        <div className="overflow-hidden rounded-2xl bg-card shadow-xl">
          <div className="relative bg-gradient-to-br from-primary to-[#16304f] px-5 pb-6 pt-7 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 85% 12%, rgba(230,126,34,0.8), transparent 45%)' }}
            />
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/40">
              <img src={profile.avatar || '/placeholder.svg'} alt={`${profile.name}的头像`} className="h-full w-full object-cover" />
            </span>
            <p className="relative mt-2 text-sm font-bold text-white">{profile.name}</p>
            <p className="relative mt-0.5 text-[12px] text-white/70">邀请你加入万户优铺</p>
            <p className="relative mt-4 text-lg font-bold leading-snug text-white text-balance">
              高校餐饮商业信息平台
            </p>
            <p className="relative mt-1 text-[12px] text-white/80">注册即得 50 积分，档口转让 · 招商一站搞定</p>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-primary">
              <QrCode className="h-12 w-12" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-muted-foreground">扫码或输入邀请码注册</p>
              <p className="mt-0.5 font-mono text-lg font-bold tracking-widest text-foreground">{code}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">长按识别二维码 · 立即领取奖励</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto grid w-full shrink-0 grid-cols-2 gap-3 pt-5" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => showToast('海报已保存到相册')}
          className="rounded-full bg-white py-2.5 text-sm font-bold text-foreground shadow-sm transition-transform active:scale-95"
        >
          保存到相册
        </button>
        <button
          type="button"
          onClick={() => showToast('已唤起微信分享')}
          className="rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition-transform active:scale-95"
        >
          分享给好友
        </button>
      </div>
    </div>
  )
}

/* ------------------------- 消息通知 ------------------------- */

type Notice = { id: number; type: 'system' | 'interact' | 'order'; title: string; body: string; time: string; unread?: boolean }

const NOTICES: Notice[] = [
  { id: 1, type: 'system', title: '发布审核通过', body: '你发布的「大学城旺铺档口转让」已通过审核，现已对外展示。', time: '10分钟前', unread: true },
  { id: 2, type: 'interact', title: '收到新的咨询', body: '有用户对你发布的档口招商信息发起了电话咨询。', time: '2小时前', unread: true },
  { id: 3, type: 'order', title: '订单支付成功', body: '信息置顶服务（7天）已开通，将优先展示在分类首屏。', time: '昨天', unread: true },
  { id: 4, type: 'system', title: '平台公告', body: '暑期档口招商季开启，认证商户置顶服务限时 8 折。', time: '2天前' },
  { id: 5, type: 'interact', title: '你的信息被收藏', body: '「二手四门冰柜转让」被 3 位用户收藏。', time: '3天前' },
]

const NOTICE_STYLE: Record<Notice['type'], { icon: LucideIcon; label: string }> = {
  system: { icon: Bell, label: '系统通知' },
  interact: { icon: Heart, label: '互动消息' },
  order: { icon: Receipt, label: '订单消息' },
}

function NotifyView({ showToast }: { showToast: (msg: string) => void }) {
  const [notices, setNotices] = useState<Notice[]>(NOTICES)
  const hasUnread = notices.some((n) => n.unread)

  const readAll = () => {
    if (!hasUnread) return
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })))
    showToast('已全部标为已���')
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[12px] text-muted-foreground">共 {notices.length} 条消息</span>
        <button type="button" onClick={readAll} disabled={!hasUnread} className="text-[12px] font-medium text-primary disabled:text-muted-foreground">
          全部已读
        </button>
      </div>
      <div className="flex flex-col gap-2.5 px-3 pb-3">
        {notices.map((n) => {
          const meta = NOTICE_STYLE[n.type]
          const Icon = meta.icon
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setNotices((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))}
              className="flex gap-3 rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-colors hover:bg-muted/50"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-4 w-4" />
                {n.unread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{n.body}</p>
                <span className="mt-1 inline-block text-[11px] text-muted-foreground/70">{meta.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------- 订单中心 ------------------------- */

type Order = {
  id: string
  title: string
  desc: string
  amount: number
  date: string
  status: 'unpaid' | 'paid' | 'closed'
}

const ORDERS: Order[] = [
  { id: 'WH20260720001', title: '信息置顶服务（7天）', desc: '大学城旺铺档口转让', amount: 63, date: '2026-07-20 10:24', status: 'unpaid' },
  { id: 'WH20260708002', title: '商户会员（年度）', desc: '认证商户专属权益', amount: 99, date: '2026-07-08 15:30', status: 'paid' },
  { id: 'WH20260705003', title: '信息置顶服务（3天）', desc: '二手四门冰柜转让', amount: 30, date: '2026-07-05 09:12', status: 'paid' },
  { id: 'WH20260620004', title: '刷新推广服务', desc: '奶茶店转让信息', amount: 10, date: '2026-06-20 20:41', status: 'closed' },
]

const ORDER_TABS: { key: 'all' | Order['status']; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unpaid', label: '待付款' },
  { key: 'paid', label: '已完成' },
  { key: 'closed', label: '已关闭' },
]

const ORDER_STATUS: Record<Order['status'], { label: string; className: string }> = {
  unpaid: { label: '待付款', className: 'text-accent' },
  paid: { label: '已完成', className: 'text-primary' },
  closed: { label: '已关闭', className: 'text-muted-foreground' },
}

function OrdersView({ showToast }: { showToast: (msg: string) => void }) {
  const [tab, setTab] = useState<'all' | Order['status']>('all')
  const [orders, setOrders] = useState<Order[]>(ORDERS)

  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab)

  const pay = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'paid' } : o)))
    showToast('支付成功')
  }

  return (
    <div className="flex flex-col">
      <div className="no-scrollbar sticky top-0 z-10 flex gap-2 overflow-x-auto bg-background px-3 py-2.5">
        {ORDER_TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              type="button"
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="暂无订单" desc="该状态下还没有订单记录" />
      ) : (
        <div className="flex flex-col gap-2.5 px-3 pb-3">
          {filtered.map((o) => {
            const st = ORDER_STATUS[o.status]
            return (
              <div key={o.id} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-[11px] text-muted-foreground">订单���� {o.id}</span>
                  <span className={`text-[12px] font-semibold ${st.className}`}>{st.label}</span>
                </div>
                <div className="flex items-start gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{o.title}</p>
                    <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{o.desc}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{o.date}</p>
                  </div>
                  <span className="shrink-0 font-mono text-base font-bold text-foreground">￥{o.amount}</span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  {o.status === 'unpaid' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: 'closed' } : x)))}
                        className="rounded-full border border-border px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                      >
                        取消订单
                      </button>
                      <button
                        type="button"
                        onClick={() => pay(o.id)}
                        className="rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
                      >
                        立即支付
                      </button>
                    </>
                  )}
                  {o.status === 'paid' && (
                    <button
                      type="button"
                      onClick={() => showToast('发票申请已提交')}
                      className="rounded-full border border-border px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                    >
                      申请发票
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ------------------------- 我的钱包 ------------------------- */

type WalletRecord = { id: number; title: string; date: string; amount: number; type: 'in' | 'out' }

function todayStr() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function WalletView({ showToast }: { showToast: (msg: string) => void }) {
  const [balance, setBalance] = useState(71)
  const [sheet, setSheet] = useState<'recharge' | null>(null)
  const [records, setRecords] = useState<WalletRecord[]>([
    { id: 1, title: '信息置顶服务', date: '2026-07-08', amount: -30, type: 'out' },
    { id: 2, title: '账户充值', date: '2026-07-05', amount: 200, type: 'in' },
    { id: 3, title: '解锁手机号码', date: '2026-06-20', amount: -5, type: 'out' },
  ])

  const handleRecharge = (amount: number, method: string) => {
    setBalance((b) => b + amount)
    setRecords((prev) => [{ id: Date.now(), title: `账户充值（${method}）`, date: todayStr(), amount, type: 'in' }, ...prev])
    setSheet(null)
    showToast(`充值成功 +${amount} 元`)
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#16304f] p-5 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(230,126,34,0.7), transparent 45%)' }}
        />
        <p className="relative text-[12px] text-white/70">账户余额（元）</p>
        <p className="relative mt-1 font-mono text-3xl font-bold text-white">{balance.toFixed(2)}</p>
        <div className="relative mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => setSheet('recharge')}
            className="flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground transition-transform active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            充值
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">交易明细</h2>
        <div className="flex flex-col">
          {records.map((r, i) => (
            <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i !== records.length - 1 ? 'border-b border-border' : ''}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.type === 'in' ? 'bg-destructive/10 text-destructive' : 'bg-primary-soft text-primary'}`}>
                {r.type === 'in' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
              </div>
              <span className={`font-mono text-sm font-bold ${r.type === 'in' ? 'text-destructive' : 'text-primary'}`}>
                {r.amount > 0 ? `+${r.amount}` : r.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      <RechargeSheet open={sheet === 'recharge'} onClose={() => setSheet(null)} onConfirm={handleRecharge} />
    </div>
  )
}

/* ------------------------- 充值面板 ------------------------- */

const RECHARGE_METHODS = [
  { key: '微信支付', icon: Smartphone },
]

function RechargeSheet({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (amount: number, method: string) => void }) {
  const presets = [50, 100, 200, 500, 1000, 2000]
  const [amount, setAmount] = useState<number | null>(100)
  const [custom, setCustom] = useState('')
  const [method, setMethod] = useState(RECHARGE_METHODS[0].key)

  if (!open) return null

  const finalAmount = custom ? Number(custom) : amount ?? 0
  const valid = finalAmount > 0

  return (
    <SheetShell title="账户充值" onClose={onClose}>
      <div className="px-4 py-4">
        <p className="mb-2 text-[12px] font-medium text-muted-foreground">选择充值金额</p>
        <div className="grid grid-cols-3 gap-2.5">
          {presets.map((v) => {
            const active = !custom && amount === v
            return (
              <button
                type="button"
                key={v}
                onClick={() => {
                  setAmount(v)
                  setCustom('')
                }}
                className={`flex flex-col items-center rounded-xl border py-3 transition-colors ${
                  active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-foreground hover:border-primary/40'
                }`}
              >
                <span className="font-mono text-lg font-bold">{v}</span>
                <span className="text-[11px] text-muted-foreground">元</span>
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5">
          <span className="text-sm text-muted-foreground">￥</span>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ''))}
            inputMode="numeric"
            placeholder="其他金额"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <p className="mb-2 mt-4 text-[12px] font-medium text-muted-foreground">支付方式</p>
        <div className="flex flex-col gap-2">
          {RECHARGE_METHODS.map((m) => {
            const Icon = m.icon
            const active = method === m.key
            return (
              <button
                type="button"
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                  active ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="flex-1 text-left text-sm font-medium text-foreground">{m.key}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                  {active && <Check className="h-3 w-3" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <SheetFooter disabled={!valid} label={`确认充值 ￥${finalAmount || 0}`} onClick={() => onConfirm(finalAmount, method)} />
    </SheetShell>
  )
}

/* ------------------------- 底部弹层外壳 ------------------------- */

function SheetShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button type="button" aria-label="关闭" onClick={onClose} className="absolute inset-0 bg-foreground/40" />
      <div className="relative z-10 flex max-h-[85%] flex-col rounded-t-2xl bg-background duration-200 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Wallet className="h-4 w-4 text-primary" />
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function SheetFooter({ disabled, label, onClick }: { disabled: boolean; label: string; onClick: () => void }) {
  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {label}
      </button>
    </div>
  )
}

/* ------------------------- 客服中心 ------------------------- */

const FAQS: { q: string; a: string[] }[] = [
  {
    q: '如何发布档口招商信息？',
    a: [
      '在首页底部点击「发布」按钮进入发布页，选择「档口招商」分类。',
      '依次填写标题、详细���述、所在地区、联系电话，并可上传门���实景图片、添加标签。',
      '信息核对无误后点击「确认发布」，平台将在 1 个工作日内完成审核，通过后即对外展示。',
    ],
  },
  {
    q: '认证商户有哪些权益？',
    a: [
      '认证商户在信息列表中拥有专属「认证」标识，可显著提升用户信任度。',
      '认证账号发布的信息将获得更高的曝光权重，优先展示在分类列表前列。',
      '此外还可享受专属客服一对一对接、批量发布、数据统计等增值服务。',
    ],
  },
  {
    q: '信息置顶收费标准是多少？',
    a: [
      '信息置顶按天计费：普通置顶 10 元/天，分类首屏置顶 30 元/天。',
      '认证商户享 8 折优惠，连续购买 7 天及以上另享 9 折。',
      '费用从账户余额中扣除，可在「我的钱包」中充值后购买。',
    ],
  },
  {
    q: '如何举报虚假信息？',
    a: [
      '进入任意信息详情页，点击右上角菜单中的「举报」按钮。',
      '选择举报类型（虚假信息 / 联系方式失效 / 涉嫌欺诈等）并补充说明。',
      '平台将在 24 小时内核实处理，一经查实将对违规账号采取下架、封禁等措施。',
    ],
  },
]

function ServiceView({ showToast }: { showToast: (msg: string) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="grid grid-cols-2 gap-3">
        <ContactCard icon={Headphones} label="在线客服" desc="9:00 - 21:00" onClick={() => showToast('接入在线客服')} />
        <ContactCard icon={Phone} label="客服热线" desc="400-888-6666" onClick={() => showToast('拨打 400-888-6666')} />
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">常见问题</h2>
        <div className="flex flex-col">
          {FAQS.map((item, i) => {
            const open = expanded === i
            return (
              <div key={i} className={i !== FAQS.length - 1 ? 'border-b border-border' : ''}>
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 text-sm font-medium text-foreground">{item.q}</span>
                  <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                </button>
                {open && (
                  <div className="px-4 pb-4 pl-11 duration-200 animate-in fade-in slide-in-from-top-1">
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                      {item.a.map((p, j) => (
                        <p key={j} className="text-[13px] leading-relaxed text-muted-foreground">
                          {p}
                        </p>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => showToast('感谢你的反馈')}
                        className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                      >
                        问题已解决
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('接入在线客服')}
                        className="rounded-full bg-primary-soft px-3 py-1.5 text-[12px] font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        联系客服
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function ContactCard({ icon: Icon, label, desc, onClick }: { icon: LucideIcon; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground">{desc}</span>
    </button>
  )
}

/* ------------------------- 意见反馈 ------------------------- */

function FeedbackView({ showToast, onBack }: { showToast: (msg: string) => void; onBack: () => void }) {
  const [text, setText] = useState('')
  const [contact, setContact] = useState('')
  const cats = ['功能建议', '信息纠错', '账号问题', '其他']
  const [cat, setCat] = useState(cats[0])

  const submit = () => {
    if (text.trim().length < 5) {
      showToast('请至少输入 5 个字')
      return
    }
    showToast('反馈已提交，感谢你的建议')
    onBack()
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">反馈类型</p>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                cat === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">问题描述</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={200}
          placeholder="请详细描述你遇到的问题或建议…"
          className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        <p className="mt-1 text-right text-[11px] text-muted-foreground">{text.length}/200</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">联系方式（选填）</p>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="手机号或微信，便于我们联系你"
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={submit}
        className="mt-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:brightness-110 active:scale-[0.99]"
      >
        提交反馈
      </button>
    </div>
  )
}

/* ------------------------- 设置 ------------------------- */

function SettingsView({ showToast, onLogout, onOpenSub }: { showToast: (msg: string) => void; onLogout: () => void; onOpenSub: (key: string) => void }) {
  const [push, setPush] = useState(true)
  const [privacy, setPrivacy] = useState(false)

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ToggleRow icon={Bell} label="推送��知" on={push} onToggle={() => setPush((v) => !v)} />
        <ToggleRow icon={Eye} label="隐藏浏览足迹" on={privacy} onToggle={() => setPrivacy((v) => !v)} last />
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <LinkRow icon={Lock} label="修改密码" onClick={() => onOpenSub('password')} />
        <LinkRow icon={Trash2} label="清除缓存" value="12.4 MB" onClick={() => showToast('缓存已清除')} />
        <LinkRow icon={BadgeCheck} label="关于万户优铺" value="v2.0.6" onClick={() => onOpenSub('about')} last />
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-card py-3 text-sm font-bold text-destructive shadow-sm transition-colors hover:bg-destructive/5"
      >
        <LogOut className="h-4 w-4" />
        退出登录
      </button>
    </div>
  )
}

/* ------------------------- 修改密码 ------------------------- */

function ChangePasswordView({ showToast, onBack }: { showToast: (msg: string) => void; onBack: () => void }) {
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)

  const pwdValid = newPwd.length >= 6 && newPwd.length <= 20
  const match = confirm.length > 0 && confirm === newPwd
  const canSubmit = oldPwd.length > 0 && pwdValid && match

  const submit = () => {
    if (!canSubmit) return
    showToast('密码修改成功，请重新登录')
    onBack()
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 px-4 py-4">
        <PwdField label="当前密码" value={oldPwd} onChange={setOldPwd} show={show} placeholder="请输入当前密码" />
        <div>
          <PwdField label="新密码" value={newPwd} onChange={setNewPwd} show={show} placeholder="6-20 位字符" />
          {newPwd.length > 0 && !pwdValid && <p className="mt-1.5 text-[12px] text-destructive">新密码需为 6-20 位</p>}
        </div>
        <div>
          <PwdField label="确认新密码" value={confirm} onChange={setConfirm} show={show} placeholder="请再次输入新密码" />
          {confirm.length > 0 && !match && <p className="mt-1.5 text-[12px] text-destructive">两次输入的密码不一致</p>}
        </div>

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="self-start text-[12px] font-medium text-primary"
        >
          {show ? '隐藏密码' : '显示密码'}
        </button>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="mt-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          确认修改
        </button>
      </div>
    </div>
  )
}

function PwdField({
  label,
  value,
  onChange,
  show,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  placeholder: string
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={20}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
    </div>
  )
}

/* ------------------------- 关于万户优铺 ------------------------- */

function AboutView() {
  const links = ['用户服务协议', '隐私政策', '平台经营资质', '联系我们']
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center px-4 py-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-sm">
          <span className="text-3xl font-bold text-primary-foreground">万</span>
        </span>
        <h2 className="mt-3 text-lg font-bold text-foreground">万户优铺</h2>
        <p className="mt-1 text-[12px] text-muted-foreground">版本 v2.0.6</p>
        <p className="mt-4 max-w-[18rem] text-center text-[13px] leading-relaxed text-muted-foreground">
          万户优铺是专注于高校食堂、企业园区、医院餐厅等场景的餐饮商业信息服务平台，为档口招商、店铺转租、人才招聘、品牌加盟等提供精准对接，致力于打造真实、诚信的商业信息环境。
        </p>
      </div>

      <section className="mx-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {links.map((l, i) => (
          <LinkRow key={l} icon={ShieldCheck} label={l} onClick={() => {}} last={i === links.length - 1} />
        ))}
      </section>

      <p className="mt-6 px-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        © 2026 万户优铺 版权所有
        <br />
        湘ICP备2026000000号
      </p>
    </div>
  )
}

/* ------------------------- 编辑资料 ------------------------- */

function EditProfileView({ showToast, onBack }: { showToast: (msg: string) => void; onBack: () => void }) {
  const [name, setName] = useState(profile.name)
  const [desc, setDesc] = useState(profile.desc)

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <span className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-border">
          <img src={profile.avatar || '/placeholder.svg'} alt="头像" className="h-full w-full object-cover" />
        </span>
        <button type="button" onClick={() => showToast('更换头像')} className="text-xs font-medium text-primary">
          更换头像
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">昵称</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">个人简介</p>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          showToast('资料已保存')
          onBack()
        }}
        className="mt-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:brightness-110 active:scale-[0.99]"
      >
        保存
      </button>
    </div>
  )
}

/* ------------------------- 商户会员 ------------------------- */

function VipView({ showToast }: { showToast: (msg: string) => void }) {
  const rights = [
    { title: '信息置顶', desc: '发布信息享优先展示' },
    { title: '认证标识', desc: '专属商户认证徽章' },
    { title: '专属客服', desc: '一对一商务对接' },
    { title: '数据看板', desc: '曝光与咨询数据分析' },
  ]
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#16304f] p-5 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(230,126,34,0.7), transparent 45%)' }}
        />
        <div className="relative flex items-center gap-2">
          <Crown className="h-6 w-6 text-accent" />
          <p className="text-lg font-bold text-white">商户会员</p>
        </div>
        <p className="relative mt-1 text-[12px] text-white/70">解锁全部经营特权，让信息更有曝光</p>
        <p className="relative mt-4 font-mono text-2xl font-bold text-white">
          ¥99<span className="text-sm font-normal text-white/70">/年</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rights.map((r) => (
          <div key={r.title} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-bold text-foreground">{r.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => showToast('开通商户会员')}
        className="mt-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground shadow-sm shadow-accent/30 transition-colors hover:brightness-105 active:scale-[0.99]"
      >
        立即开通 ¥99/年
      </button>
    </div>
  )
}

/* ------------------------- 通用行组件 ------------------------- */

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 ${last ? '' : 'border-b border-border'}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function LinkRow({ icon: Icon, label, value, onClick, last }: { icon: LucideIcon; label: string; value?: string; onClick: () => void; last?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 ${last ? '' : 'border-b border-border'}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {value && <span className="text-[12px] text-muted-foreground">{value}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}

function ToggleRow({ icon: Icon, label, on, onToggle, last }: { icon: LucideIcon; label: string; on: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${last ? '' : 'border-b border-border'}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted-foreground/30'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${on ? 'left-0.5 translate-x-5' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
