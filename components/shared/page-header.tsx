'use client'

import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { StatusBar } from '@/components/home/status-bar'

type Props = {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: ReactNode
}

/**
 * 统一的子页面头部：沿用首页搜索区的品牌深蓝渐变与纹理，保证视觉一致。
 */
export function PageHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <div className="sticky top-0 z-30">
      <StatusBar />
      <div className="relative overflow-hidden bg-gradient-to-b from-primary to-[#16304f] px-3 pb-4 pt-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 88% 0%, rgba(230,126,34,0.6), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
          }}
        />
        <div className="relative flex items-center justify-center">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="返回"
              className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold tracking-wide text-white">{title}</h1>
            {subtitle && <p className="mt-0.5 text-[11px] text-white/70">{subtitle}</p>}
          </div>
          {right && <div className="absolute right-0 flex items-center">{right}</div>}
        </div>
      </div>
    </div>
  )
}
