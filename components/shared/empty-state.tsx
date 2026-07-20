'use client'

import { Inbox, type LucideIcon } from 'lucide-react'

type Props = {
  icon?: LucideIcon
  title?: string
  desc?: string
}

/** 统一空状态：卡片留白 + 图标 + 说明文案，供各列表页复用。 */
export function EmptyState({ icon: Icon = Inbox, title = '暂无内容', desc }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <span className="text-sm font-medium text-foreground">{title}</span>
      {desc && <span className="max-w-[240px] text-center text-xs leading-relaxed">{desc}</span>}
    </div>
  )
}
