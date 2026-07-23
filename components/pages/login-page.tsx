'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { StatusBar } from '@/components/home/status-bar'

type Props = {
  onClose: () => void
  onSuccess: (phone: string) => void
  showToast: (msg: string) => void
}

// 网页原型：模拟微信账号已绑定的手机号
const BOUND_PHONE = '13800138000'

export function LoginPage({ onClose, onSuccess, showToast }: Props) {
  const [agreed, setAgreed] = useState(false)

  const handleLogin = () => {
    if (!agreed) {
      showToast('请先阅读并勾选下方协议')
      return
    }
    // 手机号授权登录：直接使用账号绑定的手机号登录成功
    onSuccess(BOUND_PHONE)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      {/* 品牌头部 */}
      <div className="relative bg-primary text-primary-foreground">
        <StatusBar />
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-3 top-11 flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center px-6 pb-10 pt-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <span className="text-2xl font-bold text-white">万</span>
          </span>
          <h1 className="mt-3 text-xl font-bold">万户优铺</h1>
          <p className="mt-1 text-[13px] text-white/70">诚信餐饮商业信息服务平台</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-6">
        {/* 授权说明卡片 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold text-foreground">「万户优铺」申请获取以下信息</p>
          <div className="mt-3">
            <p className="text-sm font-medium text-foreground">你的手机号</p>
            <p className="text-[12px] text-muted-foreground">用于账号注册与登录</p>
          </div>
        </div>

        {/* 主按钮：手机号授权登录 */}
        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
        >
          手机号快捷登录
        </button>

        {/* 用户协议 */}
        <div className="mt-6 flex items-start justify-center gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
              agreed ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
            }`}
          >
            {agreed && <Check className="h-3 w-3" />}
          </button>
          <span className="text-[12px] leading-relaxed text-muted-foreground">
            我已阅读并同意
            <button type="button" onClick={() => showToast('用户服务协议')} className="text-primary">
              《用户服务协议》
            </button>
            与
            <button type="button" onClick={() => showToast('隐私政策')} className="text-primary">
              《隐私政策》
            </button>
          </span>
        </div>

        <div className="mt-auto flex justify-center pb-4 pt-8">
          <button type="button" onClick={onClose} className="text-[13px] text-muted-foreground">
            暂不登录，先逛逛
          </button>
        </div>
      </div>
    </div>
  )
}
