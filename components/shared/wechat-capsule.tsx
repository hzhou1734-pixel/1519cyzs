'use client'

import { MoreHorizontal, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 微信小程序标志性的右上角「胶囊按钮」：左侧 ··· 菜单，右侧 ⊙ 关闭。
 * 仅作视觉还原，不承载真实功能（网页原型参考小程序规范）。
 * variant='light' 用于深色导航栏（白色描边），'dark' 用于浅色背景。
 */
export function WechatCapsule({ variant = 'light', className }: { variant?: 'light' | 'dark'; className?: string }) {
  const isLight = variant === 'light'
  return (
    <div
      aria-hidden
      className={cn(
        'flex h-8 items-center rounded-full border backdrop-blur',
        isLight ? 'border-white/25 bg-white/10' : 'border-border bg-card/80',
        className,
      )}
    >
      <span className="flex h-8 w-9 items-center justify-center">
        <MoreHorizontal className={`h-4 w-4 ${isLight ? 'text-white/90' : 'text-foreground/70'}`} strokeWidth={2.4} />
      </span>
      <span className={`h-4 w-px ${isLight ? 'bg-white/25' : 'bg-border'}`} />
      <span className="flex h-8 w-9 items-center justify-center">
        <Circle className={`h-3.5 w-3.5 ${isLight ? 'text-white/90' : 'text-foreground/70'}`} strokeWidth={2.4} />
      </span>
    </div>
  )
}
