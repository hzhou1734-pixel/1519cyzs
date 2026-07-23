'use client'

import { X, Phone, PhoneCall } from 'lucide-react'

function WechatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8.69 4C4.98 4 2 6.52 2 9.63c0 1.79 1 3.38 2.56 4.42l-.64 1.93 2.25-1.13c.8.22 1.64.34 2.52.34.22 0 .43 0 .64-.03a4.9 4.9 0 0 1-.2-1.38c0-2.87 2.79-5.2 6.23-5.2.23 0 .45.02.67.04C15.09 5.5 12.2 4 8.69 4Zm-2.2 3.2a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72Zm4.55 0a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72Z" />
      <path d="M22 14.13c0-2.6-2.5-4.7-5.58-4.7-3.16 0-5.72 2.1-5.72 4.7 0 2.6 2.56 4.7 5.72 4.7.66 0 1.3-.09 1.9-.26l1.9.96-.54-1.63C21.16 17.03 22 15.67 22 14.13Zm-7.4-1.1a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44Zm3.66 0a.72.72 0 1 1 0-1.44.72.72 0 0 1 0 1.44Z" />
    </svg>
  )
}

/* ------------------------- 二维码弹窗 ------------------------- */

type QrDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle: string
  image: string
  imageAlt: string
  tip: string
  /** 图标风格：微信绿 / 品牌主色 */
  tone?: 'wechat' | 'primary'
}

export function QrDialog({ open, onClose, title, subtitle, image, imageAlt, tip, tone = 'primary' }: QrDialogProps) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8">
      {/* 遮罩 */}
      <button type="button" aria-label="关闭" onClick={onClose} className="absolute inset-0 bg-foreground/50 duration-200 animate-in fade-in" />
      {/* 卡片 */}
      <div className="relative w-full max-w-xs rounded-2xl bg-card p-6 shadow-2xl duration-200 animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {tone === 'wechat' ? (
              <WechatIcon className="h-5 w-5 text-[#07c160]" />
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            )}
            <h2 className="text-base font-bold text-foreground">{title}</h2>
          </div>
          <p className="mt-1 text-center text-[12px] text-muted-foreground">{subtitle}</p>

          <div className="mt-4 rounded-2xl border border-border bg-white p-3 shadow-sm">
            <img src={image || '/placeholder.svg'} alt={imageAlt} className="h-44 w-44 object-contain" />
          </div>

          <p className="mt-4 text-center text-[12px] font-medium text-foreground">{tip}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------- 电话客服弹窗 ------------------------- */

type CallDialogProps = {
  open: boolean
  onClose: () => void
  phone: string
  hours?: string
}

export function CallDialog({ open, onClose, phone, hours = '工作时间 9:00 - 21:00' }: CallDialogProps) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <button type="button" aria-label="关闭" onClick={onClose} className="absolute inset-0 bg-foreground/50 duration-200 animate-in fade-in" />
      {/* 底部动作面板 */}
      <div className="relative w-full rounded-t-2xl bg-card px-4 pb-6 pt-5 shadow-2xl duration-300 animate-in slide-in-from-bottom">
        <div className="flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Phone className="h-6 w-6" />
          </span>
          <h2 className="mt-3 text-base font-bold text-foreground">电话客服</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{hours}</p>
          <p className="mt-3 font-mono text-2xl font-bold tracking-wide text-primary">{phone}</p>
        </div>

        <a
          href={`tel:${phone.replace(/[^0-9]/g, '')}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
        >
          <PhoneCall className="h-4 w-4" />
          一键拨号
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-2.5 w-full rounded-xl bg-muted py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70"
        >
          取消
        </button>
      </div>
    </div>
  )
}
