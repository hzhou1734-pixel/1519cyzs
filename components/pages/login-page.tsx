'use client'

import { useState, useRef, useEffect } from 'react'
import { Phone, ShieldCheck, X, Check, ChevronLeft, User } from 'lucide-react'
import { StatusBar } from '@/components/home/status-bar'

type Props = {
  onClose: () => void
  onSuccess: (phone: string) => void
  showToast: (msg: string) => void
}

const PHONE_RE = /^1[3-9]\d{9}$/

export function LoginPage({ onClose, onSuccess, showToast }: Props) {
  const [agreed, setAgreed] = useState(false)
  const [view, setView] = useState<'authorize' | 'phone'>('authorize')

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      {view === 'authorize' ? (
        <AuthorizeView
          agreed={agreed}
          setAgreed={setAgreed}
          onClose={onClose}
          showToast={showToast}
          onWechat={() => {
            if (!agreed) {
              showToast('请先阅读并勾选下方协议')
              return
            }
            // 网页原型：模拟微信授权返回的手机号
            onSuccess('13800138000')
          }}
          onPhone={() => {
            if (!agreed) {
              showToast('请先阅读并勾选下方协议')
              return
            }
            setView('phone')
          }}
        />
      ) : (
        <PhoneView onBack={() => setView('authorize')} onSuccess={onSuccess} showToast={showToast} />
      )}
    </div>
  )
}

/* ------------------------- 微信授权登录 ------------------------- */

function AuthorizeView({
  agreed,
  setAgreed,
  onClose,
  onWechat,
  onPhone,
  showToast,
}: {
  agreed: boolean
  setAgreed: (v: boolean) => void
  onClose: () => void
  onWechat: () => void
  onPhone: () => void
  showToast: (msg: string) => void
}) {
  return (
    <>
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
          <div className="mt-3 flex flex-col gap-3">
            <AuthItem icon={User} title="你的公开信息" desc="头像、昵称" />
            <AuthItem icon={Phone} title="你的手机号" desc="用于账号注册与登录" />
          </div>
        </div>

        {/* 主按钮：微信授权登录 */}
        <button
          type="button"
          onClick={onWechat}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#07C160] py-3 text-sm font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.99]"
        >
          <WechatGlyph className="h-5 w-5" />
          微信授权登录
        </button>

        {/* 手机号快捷登录 */}
        <button
          type="button"
          onClick={onPhone}
          className="mt-3 w-full rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
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
    </>
  )
}

function AuthItem({ icon: Icon, title, desc }: { icon: typeof User; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

/* 微信图标（简化字形，纯装饰） */
function WechatGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M9.5 4C5.36 4 2 6.86 2 10.38c0 1.98 1.06 3.75 2.72 4.94L4 18l2.5-1.32c.9.26 1.85.4 2.85.4h.35a5.6 5.6 0 0 1-.2-1.48c0-3.2 3.06-5.8 6.83-5.8.24 0 .47.01.7.03C16.2 6.3 13.13 4 9.5 4Zm-2.6 4.3a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Zm5.2 0a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Z" />
      <path d="M22 15.7c0-2.7-2.6-4.9-5.8-4.9s-5.8 2.2-5.8 4.9 2.6 4.9 5.8 4.9c.72 0 1.4-.1 2.05-.3L20.5 21l-.5-1.7c1.2-.9 2-2.16 2-3.6Zm-7.7-1a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm3.9 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" />
    </svg>
  )
}

/* ------------------------- 手机号快捷登录 ------------------------- */

function PhoneView({
  onBack,
  onSuccess,
  showToast,
}: {
  onBack: () => void
  onSuccess: (phone: string) => void
  showToast: (msg: string) => void
}) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const phoneValid = PHONE_RE.test(phone)
  const canSubmit = phoneValid && code.length === 6

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const sendCode = () => {
    if (!phoneValid) {
      showToast('请输入正确的手机号')
      return
    }
    if (countdown > 0) return
    showToast('验证码已发送（演示：123456）')
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1 && timerRef.current) {
          clearInterval(timerRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const submit = () => {
    if (!phoneValid) {
      showToast('请输入正确的手机号')
      return
    }
    if (code.length !== 6) {
      showToast('请输入 6 位验证码')
      return
    }
    onSuccess(phone)
  }

  return (
    <>
      {/* 顶部导航栏 */}
      <div className="relative bg-card">
        <StatusBar />
        <div className="relative flex h-11 items-center justify-center border-b border-border">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回"
            className="absolute left-2 flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-foreground">手机号登录</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8">
        <h2 className="text-xl font-bold text-foreground">欢迎登录万户优铺</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">未注册的手机号将自动创建账号</p>

        {/* 手机号 */}
        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 focus-within:border-primary">
          <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
            inputMode="numeric"
            placeholder="请输入手机号"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* 验证码 */}
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 focus-within:border-primary">
          <ShieldCheck className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
            inputMode="numeric"
            placeholder="请输入验证码"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={countdown > 0}
            className="shrink-0 text-[12px] font-medium text-primary disabled:text-muted-foreground"
          >
            {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
          </button>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          登录 / 注册
        </button>
      </div>
    </>
  )
}
