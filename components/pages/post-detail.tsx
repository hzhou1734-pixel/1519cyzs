'use client'

import { useState } from 'react'
import {
  MapPin,
  BadgeCheck,
  Pin,
  Heart,
  Star,
  Eye,
  Share2,
  Phone,
  MessageCircle,
  Clock,
} from 'lucide-react'
import { posts, formatNumber, type Post } from '@/lib/home-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

const TAG_COLORS = [
  'bg-primary-soft text-primary',
  'bg-accent-soft text-accent',
  'bg-teal-50 text-teal-700',
  'bg-sky-50 text-sky-700',
  'bg-amber-50 text-amber-700',
]

type Props = {
  postId: number
  onBack: () => void
  showToast: (msg: string) => void
  /** 是否为当前用户自己发布的信息（自己的信息不显示关注按钮） */
  isOwn?: boolean
}

export function PostDetail({ postId, onBack, showToast, isOwn = false }: Props) {
  const source = posts.find((p) => p.id === postId)
  const [post, setPost] = useState<Post | undefined>(source)

  if (!post) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <PageHeader title="信息详情" onBack={onBack} />
        <EmptyState title="信息不存在" desc="该信息可能已被删除或下架" />
      </div>
    )
  }

  const toggleLike = () =>
    setPost((p) => (p ? { ...p, userLiked: !p.userLiked, likes: p.likes + (p.userLiked ? -1 : 1) } : p))
  const toggleFav = () =>
    setPost((p) => (p ? { ...p, userFaved: !p.userFaved, favorites: p.favorites + (p.userFaved ? -1 : 1) } : p))

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="信息详情" onBack={onBack} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        {/* 发布者 */}
        <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3.5">
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
            <img
              src={`/images/avatar${((post.id - 1) % 6) + 1}.png`}
              alt={`${post.username}的头像`}
              className="h-full w-full object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[15px] font-semibold text-foreground">{post.username}</span>
              {post.verified && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  <BadgeCheck className="h-3 w-3" />
                  平台认证
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.publishDate} 发布 · {post.time}
            </span>
          </div>
          {!isOwn && (
            <button
              type="button"
              onClick={() => showToast(`已关注 ${post.username}`)}
              className="shrink-0 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              关注
            </button>
          )}
        </div>

        {/* 正文 */}
        <div className="bg-card px-4 py-4">
          <h1 className="mb-2.5 flex flex-wrap items-center gap-2 text-lg font-bold leading-snug text-foreground text-pretty">
            <span>{post.title}</span>
            {post.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent">
                <Pin className="h-2.5 w-2.5" />
                置顶
              </span>
            )}
          </h1>

          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{post.catLabel}</span>
            {post.tags.map((t, i) => (
              <span
                key={i}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
              >
                {t}
              </span>
            ))}
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{post.desc}</p>

          {/* 图集 */}
          {post.images.length > 0 && (
            <div className="mt-4 flex flex-col gap-2.5">
              {post.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-muted">
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`${post.title}配图${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 位置 */}
          <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2.5 text-[13px] text-foreground/80">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            {post.location}
          </div>
        </div>

        {/* 数据统计 */}
        <div className="mt-2 flex items-center justify-around bg-card py-3.5 text-center">
          <Stat icon={Heart} label="点赞" value={post.likes} active={post.userLiked} activeColor="text-destructive" />
          <Stat icon={Star} label="收藏" value={post.favorites} active={post.userFaved} activeColor="text-accent" />
          <Stat icon={Eye} label="浏览" value={post.views} />
          <Stat icon={Share2} label="转发" value={post.shares} />
        </div>

        {/* 安全提示 */}
        <div className="mx-4 mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          温馨提示：交易请核实对方资质，切勿在未见面、未核验的情况下支付定金，谨防诈骗。
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
        <ActionIcon icon={Heart} label={String(formatNumber(post.likes))} active={post.userLiked} activeColor="text-destructive" onClick={toggleLike} />
        <ActionIcon icon={Star} label={String(formatNumber(post.favorites))} active={post.userFaved} activeColor="text-accent" onClick={toggleFav} />
        <button
          type="button"
          onClick={() => showToast('发起在线咨询')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
        >
          <MessageCircle className="h-4 w-4" />
          在线咨询
        </button>
        <button
          type="button"
          onClick={() => showToast(`拨打电话 ${post.phone}`)}
          className="flex flex-[1.2] items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Phone className="h-4 w-4" />
          {post.phone}
        </button>
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  active,
  activeColor,
}: {
  icon: typeof Heart
  label: string
  value: number
  active?: boolean
  activeColor?: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className={`h-5 w-5 ${active ? activeColor : 'text-muted-foreground'}`} fill={active ? 'currentColor' : 'none'} />
      <span className="text-sm font-semibold text-foreground">{formatNumber(value)}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

function ActionIcon({
  icon: Icon,
  label,
  active,
  activeColor,
  onClick,
}: {
  icon: typeof Heart
  label: string
  active?: boolean
  activeColor?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-12 shrink-0 flex-col items-center gap-0.5 text-[10px] transition-colors ${
        active ? activeColor : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-5 w-5" fill={active ? 'currentColor' : 'none'} />
      {label}
    </button>
  )
}
