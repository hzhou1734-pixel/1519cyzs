'use client'

import { MapPin, BadgeCheck, Pin, Heart, Star, Eye, Share2 } from 'lucide-react'
import type { Post } from '@/lib/home-data'

type Props = {
  post: Post
  onOpenDetail: (id: number) => void
  onToggleLike: (id: number) => void
  onToggleFav: (id: number) => void
  onShare: (id: number) => void
}

// 标签多彩配色（与整体品牌色协调）
const TAG_COLORS = [
  'bg-primary-soft text-primary',
  'bg-accent-soft text-accent',
  'bg-teal-50 text-teal-700',
  'bg-sky-50 text-sky-700',
  'bg-amber-50 text-amber-700',
]

export function InfoCard({ post, onOpenDetail, onToggleLike, onToggleFav, onShare }: Props) {
  return (
    <div
      onClick={() => onOpenDetail(post.id)}
      className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.995]"
    >
      {/* header */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <img
            src={`/images/avatar${((post.id - 1) % 6) + 1}.png`}
            alt={`${post.username}的头像`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-foreground">{post.username}</span>
            {post.verified && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <BadgeCheck className="h-3 w-3" />
                平台认证
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{post.publishDate}</span>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">{post.catLabel}</span>
      </div>

      {/* title */}
      <h3 className="mb-1.5 flex flex-wrap items-center gap-2 text-[15px] font-semibold leading-snug text-foreground">
        <span>{post.title}</span>
        {post.pinned && (
          <span className="inline-flex items-center gap-0.5 rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent">
            <Pin className="h-2.5 w-2.5" />
            置顶
          </span>
        )}
      </h3>

      {/* desc */}
      <p className="mb-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{post.desc}</p>

      {/* tags */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {post.tags.map((t, i) => (
          <span
            key={i}
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* location */}
      <div className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        {post.location}
      </div>

      {/* images */}
      {post.images.length > 0 && (
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {post.images.map((img, i) => (
            <div
              key={i}
              className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted"
            >
              <img
                src={img || '/placeholder.svg'}
                alt={`${post.title}配图${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex items-center gap-6 border-t border-border pt-3 text-[12px] text-muted-foreground">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike(post.id)
          }}
          className={`flex items-center gap-1 transition-colors ${post.userLiked ? 'font-semibold text-destructive' : 'hover:text-foreground'}`}
        >
          <Heart className="h-4 w-4" fill={post.userLiked ? 'currentColor' : 'none'} />
          {post.likes}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFav(post.id)
          }}
          className={`flex items-center gap-1 transition-colors ${post.userFaved ? 'font-semibold text-accent' : 'hover:text-foreground'}`}
        >
          <Star className="h-4 w-4" fill={post.userFaved ? 'currentColor' : 'none'} />
          {post.favorites}
        </button>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {post.views}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onShare(post.id)
          }}
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          转发 {post.shares}
        </button>
      </div>

      {/* detail button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpenDetail(post.id)
        }}
        className="mt-3 w-full rounded-lg bg-primary-soft py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        查看详情
      </button>
    </div>
  )
}
