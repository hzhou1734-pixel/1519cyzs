'use client'

import { formatNumber } from '@/lib/home-data'

type Props = {
  totalUsers: number
  totalPosts: number
  totalViews: number
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 text-xs text-muted-foreground">
      {label}：
      <span className="font-mono text-sm font-bold text-primary">{formatNumber(value)}</span>
    </span>
  )
}

export function StatsBar({ totalUsers, totalPosts, totalViews }: Props) {
  return (
    <div className="px-3 py-1.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Stat label="用户量" value={totalUsers} />
        <Stat label="发布量" value={totalPosts} />
        <Stat label="浏览量" value={totalViews} />
      </div>
    </div>
  )
}
