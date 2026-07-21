'use client'

import { useState } from 'react'
import { MapPin, ShieldCheck, Phone, Lock, Store } from 'lucide-react'
import { idleItems, type IdleItem } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  itemId: number
  onBack: () => void
  showToast: (msg: string) => void
}

// 解锁卖家手机号的费用（元）
const UNLOCK_FEE = 2
// 卖家手机号（解锁后展示）
const SELLER_PHONE = '138 8888 6666'

// 依据成色给出一段合理的补充描述（原型数据无长描述，按语义生成）
function buildDesc(item: IdleItem) {
  return `${item.title}，成色${item.cond}，功能完好可正常使用。因店铺调整/升级设备闲置转让，诚心出售，价格可小刀。支持当面验货，${item.location}自提为主，大件可协助联系物流。有意者请电话或在线联系，非诚勿扰。`
}

export function IdleDetail({ itemId, onBack, showToast }: Props) {
  const item = idleItems.find((i) => i.id === itemId)
  const [unlocked, setUnlocked] = useState(false)

  if (!item) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <PageHeader title="闲置详情" onBack={onBack} />
        <EmptyState title="物品不存在" desc="该闲置物品可能已被交易或下架" />
      </div>
    )
  }


  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="闲置详情" onBack={onBack} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        {/* 主图 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img src={item.image || '/placeholder.svg'} alt={item.title} className="h-full w-full object-cover" />
          <span className="absolute left-2.5 top-2.5 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
            {item.cond}
          </span>
        </div>

        {/* 价格区 */}
        <div className="bg-card px-4 py-3.5">
          <div className="flex items-end gap-2">
            <span className="font-mono text-2xl font-bold text-accent">¥{item.price}</span>
            {item.original && (
              <span className="mb-0.5 font-mono text-[13px] text-muted-foreground line-through">¥{item.original}</span>
            )}
          </div>
          <h1 className="mt-2 text-base font-semibold leading-snug text-foreground text-pretty">{item.title}</h1>
          <div className="mt-2.5 flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {item.location}
            </span>
          </div>
        </div>

        {/* 卖家 */}
        <div className="mt-2 flex items-center gap-2.5 bg-card px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Store className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">{item.seller}</span>
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <ShieldCheck className="h-3 w-3" />
                认证商户
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">{item.publishDate} 发布</span>
          </div>
        </div>

        {/* 描述 */}
        <div className="mt-2 bg-card px-4 py-4">
          <h2 className="mb-2 text-sm font-bold text-foreground">物品描述</h2>
          <p className="text-sm leading-relaxed text-foreground/90">{buildDesc(item)}</p>
        </div>

        <div className="mx-4 mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          温馨提示：二手交易建议当面验货、一手交钱一手交货，谨防先付款后失联的骗局。
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center border-t border-border bg-card px-3 py-2.5">
        {unlocked ? (
          <button
            type="button"
            onClick={() => showToast(`拨打电话 ${SELLER_PHONE}`)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-accent-foreground shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Phone className="h-4 w-4" />
            {SELLER_PHONE}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUnlocked(true)
              showToast('支付成功，已解锁卖家手机号')
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-accent-foreground shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Lock className="h-4 w-4" />
            {`付费 ${UNLOCK_FEE} 元解锁手机号`}
          </button>
        )}
      </div>
    </div>
  )
}
