'use client'

import {
  BadgeCheck,
  ChevronRight,
  FileText,
  Star,
  Heart,
  History,
  Wallet,
  Headphones,
  MessageSquare,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { profile, myToolMenu, type MenuItem } from '@/lib/app-data'
import { formatNumber } from '@/lib/home-data'
import { StatusBar } from '@/components/home/status-bar'
import { WechatCapsule } from '@/components/shared/wechat-capsule'

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Star,
  Heart,
  History,
  Wallet,
  Headphones,
  MessageSquare,
  Settings,
  BadgeCheck,
}

type Props = {
  onOpenSub: (key: string) => void
}

export function ProfilePage({ onOpenSub }: Props) {
  const { stats } = profile

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* 顶部品牌区（沿用首页深蓝渐变） */}
      <div className="sticky top-0 z-30">
        <StatusBar />
        <div className="relative overflow-hidden bg-gradient-to-b from-primary to-[#16304f] px-4 pb-6 pt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 88% 0%, rgba(230,126,34,0.6), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
            }}
          />
          <div className="relative flex items-center justify-center">
            <h1 className="text-lg font-bold tracking-wide text-white">我的</h1>
            <div className="absolute right-0">
              <WechatCapsule variant="light" />
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-3">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
              <img src={profile.avatar || '/placeholder.svg'} alt={`${profile.name}的头像`} className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-base font-bold text-white">{profile.name}</span>
                {profile.verified && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                    <BadgeCheck className="h-3 w-3" />
                    {profile.vipLevel}
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-[12px] text-white/70">{profile.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenSub('edit')}
              className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              编辑资料
            </button>
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <div className="flex flex-col gap-3 px-3 py-3">
          {/* 数据统计卡 */}
          <div className="grid grid-cols-4 rounded-xl border border-border bg-card py-4 shadow-sm">
            <StatCell label="发布" value={stats.posts} onClick={() => onOpenSub('posts')} />
            <StatCell label="收藏" value={stats.favorites} onClick={() => onOpenSub('favorites')} />
            <StatCell label="点赞" value={stats.likes} onClick={() => onOpenSub('likes')} />
            <StatCell label="浏览" value={stats.views} onClick={() => onOpenSub('history')} />
          </div>

          {/* 更多工具 */}
          <MenuGroup title="更多工具" items={myToolMenu} onItem={(m) => onOpenSub(m.key)} />

          <p className="py-2 text-center text-[11px] text-muted-foreground">万户优铺 · 高校餐饮商业信息平台</p>
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-0.5 transition-colors hover:text-primary">
      <span className="font-mono text-lg font-bold text-primary">{formatNumber(value)}</span>
      <span className="text-[12px] text-muted-foreground">{label}</span>
    </button>
  )
}

function MenuGroup({ title, items, onItem }: { title: string; items: MenuItem[]; onItem: (m: MenuItem) => void }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <h2 className="px-4 pb-1 pt-3 text-[12px] font-semibold text-muted-foreground">{title}</h2>
      <div className="flex flex-col">
        {items.map((m, i) => {
          const Icon = iconMap[m.icon] ?? FileText
          return (
            <button
              type="button"
              key={m.key}
              onClick={() => onItem(m)}
              className={`flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60 ${
                i !== items.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{m.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
