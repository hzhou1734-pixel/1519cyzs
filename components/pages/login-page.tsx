'use client'

import { useState, useRef, useEffect } from 'react'
import { Phone, Lock, ShieldCheck, X, Check } from 'lucide-react'
import { StatusBar } from '@/components/home/status-bar'

type Props = {
  onClose: () => void
  onSuccess: (phone: string) => void
  showToast: (msg: string) => void
}

const PHONE_RE = /^1[3-9]\d{9}$/

export function LoginPage({ onClose, onSuccess, showToast }: Props) {
  const [mode, setMode] = useState<'password' | 'code'>('password')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const phoneValid = PHONE_RE.test(phone)
  const canSubmit = phoneValid && agreed && (mode === 'password' ? password.length >= 6 : code.length === 6)

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
    if (!agreed) {
      showToast('请先阅读并同意用户协议')
      return
    }
    if (mode === 'password' && password.length < 6) {
      showToast('密码至少 6 位')
      return
    }
    if (mode === 'code' && code.length !== 6) {
      showToast('请输入 6 位验证码')
      return
    }
    onSuccess(phone)
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

      <div className="flex-1 overflow-y-auto px-6 pt-6">
        {/* 模式切换 */}
        <div className="mb-6 flex gap-6 border-b border-border">
          <TabBtn active={mode === 'password'} label="密码登录" onClick={() => setMode('password')} />
          <TabBtn active={mode === 'code'} label="验证码登录" onClick={() => setMode('code')} />
        </div>

        {/* 手机号 */}
        <Field icon={Phone}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
            inputMode="numeric"
            placeholder="请输入手机号"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>

        {/* 密码 / 验证码 */}
        {mode === 'password' ? (
          <Field icon={Lock}>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              maxLength={20}
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button type="button" onClick={() => setShowPwd((v) => !v)} className="shrink-0 text-[12px] font-medium text-primary">
              {showPwd ? '隐藏' : '显示'}
            </button>
          </Field>
        ) : (
          <Field icon={ShieldCheck}>
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
          </Field>
        )}

        {mode === 'password' && (
          <div className="mt-2 flex justify-end">
            <button type="button" onClick={() => showToast('请联系客服重置密码')} className="text-[12px] text-muted-foreground">
              忘记密码？
            </button>
          </div>
        )}

        {/* 登录按钮 */}
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          登录 / 注册
        </button>

        {/* 用户协议 */}
        <label className="mt-5 flex cursor-pointer items-start gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => setAgreed((v) => !v)}
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
        </label>

        {/* 游客浏览 */}
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={onClose} className="text-[13px] text-muted-foreground">
            暂不登录，先逛逛
          </button>
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 text-base font-semibold transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      {label}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
    </button>
  )
}

function Field({ icon: Icon, children }: { icon: typeof Phone; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 focus-within:border-primary">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      {children}
    </div>
  )
}
