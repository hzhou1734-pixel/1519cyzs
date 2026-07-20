'use client'

import { useState } from 'react'
import { Megaphone, ChevronRight, Pin, CalendarDays, Share2, ThumbsUp } from 'lucide-react'
import { notices, type Notice } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'

type Props = {
  onBack: () => void
  showToast: (msg: string) => void
}

/**
 * 平台公告：列表 + 详情，内部维护二级导航。
 * 复用首页设计系统（深蓝头部、橙色强调、圆角卡片、lucide 图标）。
 */
export function NoticePage({ onBack, showToast }: Props) {
  const [current, setCurrent] = useState<Notice | null>(null)

  if (current) {
    return <NoticeDetail notice={current} onBack={() => setCurrent(null)} showToast={showToast} />
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="平台公告" onBack={onBack} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <div className="flex flex-col gap-3 px-3 py-3">
          {notices.map((n) => (
            <button
              type="button"
              key={n.id}
              onClick={() => setCurrent(n)}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.995]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                  <Megaphone className="h-3 w-3" />
                  {n.tag}
                </span>
                {n.pinned && (
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    <Pin className="h-2.5 w-2.5" />
                    置顶
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {n.date}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold leading-snug text-foreground">{n.title}</h3>
              <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{n.summary}</p>
              <span className="mt-0.5 flex items-center text-[12px] font-medium text-primary">
                查看详情
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
          <p className="py-2 text-center text-[11px] text-muted-foreground">— 已经到底啦 —</p>
        </div>
      </div>
    </div>
  )
}

function NoticeDetail({ notice, onBack, showToast }: { notice: Notice; onBack: () => void; showToast: (msg: string) => void }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="公告详情" onBack={onBack} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <div className="px-4 py-4">
          <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            <Megaphone className="h-3 w-3" />
            {notice.tag}
          </span>
          <h1 className="mt-3 text-xl font-bold leading-snug text-foreground text-balance">{notice.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-muted-foreground">
            <span>万户优铺官方</span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {notice.date}
            </span>
          </div>

          <div className="my-4 h-px bg-border" />

          <article className="flex flex-col gap-3.5">
            {notice.content.map((p, i) => (
              <p key={i} className="text-[14px] leading-[1.85] text-foreground/90">
                {p}
              </p>
            ))}
          </article>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => showToast('感谢您的支持')}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ThumbsUp className="h-4 w-4" />
              有用
            </button>
            <button
              type="button"
              onClick={() => showToast('分享公告')}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
              分享
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
