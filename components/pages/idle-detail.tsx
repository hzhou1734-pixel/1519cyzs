'use client'

import { MapPin, ShieldCheck, Phone, Lock, Store } from 'lucide-react'
import { idleItems, type IdleItem } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'

type Props = {
  itemId: number
  onBack: () => void
  showToast: (msg: string) => void
  /** 该物品的卖家手机号是否已付费解锁 */
  phoneUnlocked?: boolean
  /** 点击解锁：跳转支付页 */
  onUnlockPhone?: () => void
}

// 解锁卖家手机号的费用（元）
const UNLOCK_FEE = 2
// 卖家手机号（解锁后展示）
const SELLER_PHONE = '138 8888 6666'
// 脱敏后的手机号：中间 4 位以 **** 替代（如 138 **** 6666）
const SELLER_PHONE_MASKED = SELLER_PHONE.replace(/\D/g, '').replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2')

// 闲置物品评论（原型示例数据）
const IDLE_COMMENTS: {
  id: number
  name: string
  avatar: string
  text: string
  date: string
  reply?: string
}[] = [
  {
    id: 1,
    name: '开店的老陈',
    avatar: '/images/avatar2.png',
    text: '成色看着还不错，用了多久了？可以小刀不？',
    date: '3天前',
    reply: '用了半年多，功能都正常，价格可以聊，诚心要可小刀。',
  },
  { id: 2, name: '奶茶店阿玲', avatar: '/images/avatar3.png', text: '同城可以送货上门吗？大概多重？', date: '1天前' },
  {
    id: 3,
    name: '夜市小吃摊',
    avatar: '/images/avatar5.png',
    text: '有没有发票和保修卡？想买来备用。',
    date: '6小时前',
    reply: '发票在的，保修还剩几个月，可以一起给你。',
  },
]

// 依据成色给出一段合理的补充描述（原型数据无长描述，按语义生成）
function buildDesc(item: IdleItem) {
  return `${item.title}，成色${item.cond}，功能完好可正常使用。因店铺调整/升级设备闲置转让，诚心出售，价格可小刀。支持当面验货，${item.location}自提为主，大件可协助联系物流。有意者请电话或在线联系，非诚勿扰。`
}

export function IdleDetail({ itemId, onBack, showToast, phoneUnlocked = false, onUnlockPhone }: Props) {
  const item = idleItems.find((i) => i.id === itemId)

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

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24">
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

        {/* 用户评论 */}
        <section className="mt-2 bg-card px-4 py-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-foreground">
            用户评论
            <span className="text-[12px] font-normal text-muted-foreground">({IDLE_COMMENTS.length})</span>
          </h2>
          <ul className="flex flex-col">
            {IDLE_COMMENTS.map((c, i) => (
              <li
                key={c.id}
                className={`flex gap-2.5 py-3 ${i !== IDLE_COMMENTS.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                  <img src={c.avatar || '/placeholder.svg'} alt={`${c.name}的头像`} className="h-full w-full object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-foreground">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.date}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/90">{c.text}</p>
                  {c.reply && (
                    <div className="mt-2 rounded-lg bg-muted px-3 py-2">
                      <p className="text-[13px] leading-relaxed text-foreground/90">
                        <span className="font-semibold text-primary">卖家回复：</span>
                        {c.reply}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {/* 发表评论入口 */}
          <button
            type="button"
            onClick={() => showToast('发表评论')}
            className="mt-2 flex w-full items-center rounded-full bg-muted px-4 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted/70"
          >
            说点什么，向卖家提问...
          </button>
        </section>

        <div className="mx-4 mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          温馨提示：二手交易建议当面验货、一手交钱一手交货，谨防先付款后失联的骗局。
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center border-t border-border bg-card px-3 py-2.5">
        {phoneUnlocked ? (
          <button
            type="button"
            onClick={() => showToast(`拨打电话 ${SELLER_PHONE_MASKED}`)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-accent-foreground shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Phone className="h-4 w-4" />
            {SELLER_PHONE_MASKED}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onUnlockPhone?.()}
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
