'use client'

import { useState } from 'react'
import {
  UtensilsCrossed,
  Store,
  Stethoscope,
  Building2,
  UserPlus,
  ClipboardList,
  House,
  Tag,
  GraduationCap,
  Soup,
  Recycle,
  AlertTriangle,
  X,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { publishCats, publishSubCats } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'

type Props = {
  onBack: () => void
  /** 选择「一级分类 + 二级分类」后进入发布表单 */
  onSelect: (cat: string, subCat: string) => void
}

// 一级分类图标沿用首页宫格导航（保持视觉一致）
const iconMap: Record<string, LucideIcon> = {
  canteen: UtensilsCrossed,
  street: Store,
  hospital: Stethoscope,
  park: Building2,
  recruit: UserPlus,
  biz: ClipboardList,
  shop: House,
  brand: Tag,
  training: GraduationCap,
  sauce: Soup,
  idle: Recycle,
}

// 发布类型列表：首页宫格分类 + 二手闲置
const publishTypeCats = [...publishCats, { cat: 'idle', label: '二手闲置' }]

export function PublishTypePage({ onBack, onSelect }: Props) {
  // 当前展开二级分类弹窗的一级分类
  const [activeCat, setActiveCat] = useState<{ cat: string; label: string } | null>(null)

  const subCats = activeCat ? publishSubCats[activeCat.cat] ?? [] : []

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="发布信息" onBack={onBack} />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {/* 发布提示 */}
        <section className="rounded-xl border border-[#f0d9a0] bg-[#fdf6e3] p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-[#e6a23c]" strokeWidth={2.2} />
            <span className="text-sm font-bold text-[#b8860b]">发布提示</span>
          </div>
          <p className="text-[13px] leading-relaxed text-[#8a6d1f]">
            严禁发布违法违规信息，切勿侵犯他人商标、专利、版权、著作权的文字、文章、图片等知识产权信息，否则一切后果自负，本站信息均为用户自行发布，请仔细辨别真假信息，用户在本站所获取的信息所导致的任何损失，本站均不承担任何责任。
          </p>
        </section>

        {/* 选择发布类型 */}
        <h2 className="mb-3 mt-6 text-center text-base font-bold text-foreground">选择发布类型</h2>
        <div className="grid grid-cols-5 gap-2.5">
          {publishTypeCats.map((c) => {
            const Icon = iconMap[c.cat] ?? UtensilsCrossed
            return (
              <button
                type="button"
                key={c.cat}
                onClick={() => setActiveCat(c)}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-1 py-2.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:scale-95"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-medium text-foreground">{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 二级分类选择弹窗 */}
      {activeCat && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* 遮罩 */}
          <button
            type="button"
            aria-label="关闭"
            onClick={() => setActiveCat(null)}
            className="absolute inset-0 bg-foreground/40"
          />

          {/* 弹层 */}
          <div className="relative z-10 flex max-h-[70%] flex-col rounded-t-2xl bg-card duration-200 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-foreground">
                选择二级分类 · {activeCat.label}
              </span>
              <button
                type="button"
                onClick={() => setActiveCat(null)}
                aria-label="关闭"
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto py-1">
              {subCats.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    onSelect(activeCat.cat, s)
                    setActiveCat(null)
                  }}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm text-foreground transition-colors hover:bg-muted/60"
                >
                  <span>{s}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
