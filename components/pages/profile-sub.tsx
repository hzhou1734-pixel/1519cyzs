'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Wallet,
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
  type LucideIcon,
} from 'lucide-react'
import { posts as seedPosts, type Post } from '@/lib/home-data'
import { profile } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { InfoCard } from '@/components/home/info-card'

type Props = {
  sub: string
  onBack: () => void
  onOpenPost: (id: number) => void
  showToast: (msg: string) => void
}

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  posts: { title: '我的发布', subtitle: '你发布的商业信息' },
  favorites: { title: '我的收藏' },
  likes: { title: '我的点赞' },
  history: { title: '浏览历史' },
  verify: { title: '实名认证' },
  wallet: { title: '我的钱包' },
  service: { title: '客服中心' },
  feedback: { title: '意见反馈' },
  settings: { title: '设置' },
  edit: { title: '编辑资料' },
  vip: { title: '商户会员' },
}

export function ProfileSubPage({ sub, onBack, onOpenPost, showToast }: Props) {
  const head = TITLES[sub] ?? { title: '详情' }
  const isList = ['posts', 'favorites', 'likes', 'history'].includes(sub)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title={head.title} subtitle={head.subtitle} onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        {isList && <PostList sub={sub} onOpenPost={onOpenPost} showToast={showToast} />}
        {sub === 'verify' && <VerifyView showToast={showToast} />}
        {sub === 'wallet' && <WalletView showToast={showToast} />}
        {sub === 'service' && <ServiceView showToast={showToast} />}
        {sub === 'feedback' && <FeedbackView showToast={showToast} onBack={onBack} />}
        {sub === 'settings' && <SettingsView showToast={showToast} />}
        {sub === 'edit' && <EditProfileView showToast={showToast} onBack={onBack} />}
        {sub === 'vip' && <VipView showToast={showToast} />}
      </div>
    </div>
  )
}

/* ------------------------- 列表类子页 ------------------------- */

function PostList({ sub, onOpenPost, showToast }: { sub: string; onOpenPost: (id: number) => void; showToast: (msg: string) => void }) {
  // 依据入口给出不同数据子集，模拟“我的发布/收藏/点赞/浏览”
  const initial = useMemo<Post[]>(() => {
    if (sub === 'posts') return seedPosts.filter((p) => p.username.includes('湖南大学') || p.id % 7 === 1).slice(0, 4)
    if (sub === 'favorites') return seedPosts.filter((p) => p.userFaved)
    if (sub === 'likes') return seedPosts.filter((p) => p.userLiked)
    return seedPosts.slice(0, 6) // history
  }, [sub])

  const [list, setList] = useState<Post[]>(initial)

  const toggleLike = (id: number) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, userLiked: !p.userLiked, likes: p.likes + (p.userLiked ? -1 : 1) } : p)))
  const toggleFav = (id: number) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, userFaved: !p.userFaved, favorites: p.favorites + (p.userFaved ? -1 : 1) } : p)))

  if (list.length === 0) {
    const emptyText: Record<string, string> = {
      favorites: '还没有收藏任何信息，去首页看看吧',
      likes: '还没有点赞任何信息',
      history: '暂无浏览记录',
      posts: '你还没有发布信息',
    }
    return <EmptyState desc={emptyText[sub]} />
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {list.map((post) => (
        <InfoCard
          key={post.id}
          post={post}
          onOpenDetail={onOpenPost}
          onToggleLike={toggleLike}
          onToggleFav={toggleFav}
          onShare={(id) => showToast(`转发帖子 #${id}`)}
        />
      ))}
    </div>
  )
}

/* ------------------------- 实名认证 ------------------------- */

function VerifyView({ showToast }: { showToast: (msg: string) => void }) {
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-4 py-6 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <p className="text-base font-bold text-foreground">你已完成实名认证</p>
        <p className="text-[12px] text-muted-foreground">认证商户 · {profile.name}</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Row label="真实姓名" value="陈**" />
        <Row label="证件类型" value="身份证" />
        <Row label="证件号码" value="4301**********1234" />
        <Row label="认证时间" value="2026-06-15" last />
      </section>

      <button
        type="button"
        onClick={() => showToast('已提交商户资质审核')}
        className="mt-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:brightness-110 active:scale-[0.99]"
      >
        升级企业商户认证
      </button>
    </div>
  )
}

/* ------------------------- 我的钱包 ------------------------- */

function WalletView({ showToast }: { showToast: (msg: string) => void }) {
  const records = [
    { id: 1, title: '信息置顶服务', date: '2026-07-08', amount: -30, type: 'out' as const },
    { id: 2, title: '账户充值', date: '2026-07-05', amount: 200, type: 'in' as const },
    { id: 3, title: '会员开通', date: '2026-06-20', amount: -99, type: 'out' as const },
  ]
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#16304f] p-5 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(230,126,34,0.7), transparent 45%)' }}
        />
        <p className="relative text-[12px] text-white/70">账户余额（元）</p>
        <p className="relative mt-1 font-mono text-3xl font-bold text-white">71.00</p>
        <div className="relative mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => showToast('去充值')}
            className="flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            充值
          </button>
          <button
            type="button"
            onClick={() => showToast('提现申请已提交')}
            className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
          >
            提现
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">交易明细</h2>
        <div className="flex flex-col">
          {records.map((r, i) => (
            <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${i !== records.length - 1 ? 'border-b border-border' : ''}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.type === 'in' ? 'bg-primary-soft text-primary' : 'bg-accent-soft text-accent'}`}>
                {r.type === 'in' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
              </div>
              <span className={`font-mono text-sm font-bold ${r.type === 'in' ? 'text-primary' : 'text-foreground'}`}>
                {r.amount > 0 ? `+${r.amount}` : r.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ------------------------- 客服中心 ------------------------- */

function ServiceView({ showToast }: { showToast: (msg: string) => void }) {
  const faqs = [
    '如何发布档口招商信息？',
    '认证商户有哪些权益？',
    '信息置顶收费标准是多少？',
    '如何举报虚假信息？',
  ]
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <div className="grid grid-cols-2 gap-3">
        <ContactCard icon={Headphones} label="在线客服" desc="9:00 - 21:00" onClick={() => showToast('接入在线客服')} />
        <ContactCard icon={Phone} label="客服热线" desc="400-888-6666" onClick={() => showToast('拨打 400-888-6666')} />
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">常见问题</h2>
        <div className="flex flex-col">
          {faqs.map((q, i) => (
            <button
              type="button"
              key={i}
              onClick={() => showToast(q)}
              className={`flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 ${i !== faqs.length - 1 ? 'border-b border-border' : ''}`}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1 text-sm text-foreground">{q}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
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

function SettingsView({ showToast }: { showToast: (msg: string) => void }) {
  const [push, setPush] = useState(true)
  const [privacy, setPrivacy] = useState(false)

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ToggleRow icon={Bell} label="推送通知" on={push} onToggle={() => setPush((v) => !v)} />
        <ToggleRow icon={Eye} label="隐藏浏览足迹" on={privacy} onToggle={() => setPrivacy((v) => !v)} last />
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <LinkRow icon={Lock} label="修改密码" onClick={() => showToast('修改密码')} />
        <LinkRow icon={Trash2} label="清除缓存" value="12.4 MB" onClick={() => showToast('缓存已清除')} />
        <LinkRow icon={BadgeCheck} label="关于万户优铺" value="v2.0.6" onClick={() => showToast('关于万户优铺 v2.0.6')} last />
      </section>

      <button
        type="button"
        onClick={() => showToast('已退出登录')}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-card py-3 text-sm font-bold text-destructive shadow-sm transition-colors hover:bg-destructive/5"
      >
        <LogOut className="h-4 w-4" />
        退出登录
      </button>
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
