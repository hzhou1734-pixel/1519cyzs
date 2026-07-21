'use client'

import { useState } from 'react'
import { Wallet, Layers, Check, Coins } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { profile } from '@/lib/app-data'

type Props = {
  amount: number
  label: string
  onBack: () => void
  onSuccess: () => void
  showToast: (msg: string) => void
}

/** 微信品牌图标（来自 theSVG.org，微信商标归腾讯所有） */
function WechatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden className={className}>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
  )
}

const METHODS: { key: string; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'balance', label: '余额支付', desc: '使用账户余额支付', icon: Wallet, color: 'text-[#e6a23c]' },
  { key: 'wechat', label: '微信支付', desc: '推荐已安装微信的用户使用', icon: WechatIcon, color: 'text-[#07c160]' },
  { key: 'combo', label: '组合支付', desc: '余额 + 微信组合支付', icon: Layers, color: 'text-primary' },
]

const POINTS_PER_YUAN = 100 // 100 积分抵扣 1 元

export function PaymentPage({ amount, label, onBack, onSuccess, showToast }: Props) {
  const [method, setMethod] = useState('balance')
  const [usePoints, setUsePoints] = useState(false)

  const balance = profile.stats.balance
  const points = profile.stats.points
  // 积分最多可抵扣金额（不超过订单金额）
  const pointsDeductible = Math.min(points / POINTS_PER_YUAN, amount)
  const deduction = usePoints ? pointsDeductible : 0
  const payable = Math.max(amount - deduction, 0)

  const amountText = `¥${payable.toFixed(2)}`

  const pay = () => {
    showToast('支付成功，已置顶发布')
    setTimeout(onSuccess, 900)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader title="支付" onBack={onBack} />

      {/* 金额横幅 */}
      <div className="flex flex-col items-center bg-primary px-4 py-7 text-primary-foreground">
        <span className="text-[13px] text-primary-foreground/80">支付金额</span>
        <span className="mt-1 text-4xl font-bold tracking-tight">{amountText}</span>
        <span className="mt-1.5 text-[13px] text-primary-foreground/80">{label}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* 积分抵扣 */}
        <button
          type="button"
          onClick={() => setUsePoints((v) => !v)}
          aria-pressed={usePoints}
          className="mb-4 flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-accent">
            <Coins className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-foreground">积分抵扣</span>
            <span className="block text-[12px] text-muted-foreground">
              当前剩余 <span className="font-semibold text-foreground">{points}</span> 积分，可抵扣{' '}
              <span className="font-semibold text-accent">¥{pointsDeductible.toFixed(2)}</span>
            </span>
          </span>
          <span
            className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${usePoints ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${usePoints ? 'left-[1.125rem]' : 'left-0.5'}`}
            />
          </span>
        </button>

        <p className="mb-2 px-1 text-[13px] font-medium text-muted-foreground">选择支付方式</p>
        <div className="flex flex-col gap-2.5">
          {METHODS.map((m) => {
            const Icon = m.icon
            const active = method === m.key
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={`flex items-center gap-3 rounded-xl border bg-card px-3.5 py-3.5 text-left transition-colors ${
                  active ? 'border-accent' : 'border-border'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-foreground">{m.label}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {m.key === 'balance' ? (
                      <>
                        当前余额 <span className="font-semibold text-foreground">¥{balance.toFixed(2)}</span>
                      </>
                    ) : (
                      m.desc
                    )}
                  </span>
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                    active ? 'bg-accent text-white' : 'border border-border'
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部确认支付 */}
      <div className="border-t border-border bg-card px-3 pb-6 pt-3">
        <button
          type="button"
          onClick={pay}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:scale-[0.99]"
        >
          确认支付 {amountText}
        </button>
      </div>
    </div>
  )
}
