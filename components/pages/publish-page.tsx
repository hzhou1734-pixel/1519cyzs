'use client'

import { useState } from 'react'
import { ImagePlus, MapPin, Phone, Tag as TagIcon, Check } from 'lucide-react'
import { publishCats } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'

type Props = {
  showToast: (msg: string) => void
  onDone: () => void
}

export function PublishPage({ showToast, onDone }: Props) {
  const [cat, setCat] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')

  const canSubmit = cat && title.trim() && desc.trim() && location.trim() && phone.trim()

  const handleSubmit = () => {
    if (!canSubmit) {
      showToast('请完善必填信息')
      return
    }
    showToast('发布成功，等待审核')
    setTimeout(onDone, 900)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="发布信息" subtitle="真实信息共建诚信平台" onBack={onDone} />

      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <div className="flex flex-col gap-3 px-3 py-3">
          {/* 选择分类 */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <FieldLabel required>选择分类</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {publishCats.map((c) => {
                const isActive = cat === c.cat
                return (
                  <button
                    type="button"
                    key={c.cat}
                    onClick={() => setCat(c.cat)}
                    className={`rounded-lg px-2 py-2.5 text-[12px] font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* 标题与详情 */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <FieldLabel required>标题</FieldLabel>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
              placeholder="一句话描述你要发布的信息"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <div className="mb-2 mt-4 flex items-center justify-between">
              <FieldLabel required className="mb-0">详细描述</FieldLabel>
              <span className="text-[11px] text-muted-foreground">{desc.length}/500</span>
            </div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={500}
              rows={5}
              placeholder="面积、经营品类、收费模式、进场要求等，信息越详细越容易成交"
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </section>

          {/* 图片 */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <FieldLabel>上传图片</FieldLabel>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => showToast('选择图片上传')}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ImagePlus className="h-6 w-6" strokeWidth={1.75} />
                <span className="text-[10px]">最多9张</span>
              </button>
            </div>
          </section>

          {/* 地区 / 电话 / 标签 */}
          <section className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <IconField
              icon={<MapPin className="h-4 w-4 text-accent" />}
              label="所在地区"
              required
              value={location}
              onChange={setLocation}
              placeholder="如：长沙 · 岳麓区"
            />
            <div className="mx-4 border-t border-border" />
            <IconField
              icon={<Phone className="h-4 w-4 text-accent" />}
              label="联系电话"
              required
              value={phone}
              onChange={setPhone}
              placeholder="请输入手机号"
              inputMode="tel"
            />
            <div className="mx-4 border-t border-border" />
            <button
              type="button"
              onClick={() => showToast('添加标签')}
              className="flex w-full items-center gap-2 px-3 py-3.5 text-left"
            >
              <TagIcon className="h-4 w-4 text-accent" />
              <span className="text-sm text-foreground">添加标签</span>
              <span className="ml-auto text-[13px] text-muted-foreground">选填 ›</span>
            </button>
          </section>

          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            发布即表示同意《万户优铺信息发布规范》，请勿发布虚假、违规信息，平台将进行人工审核。
          </p>
        </div>
      </div>

      {/* 底部提交栏 */}
      <div className="absolute bottom-0 left-0 z-30 w-full border-t border-border bg-card px-3 pb-6 pt-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex w-full items-center justify-center gap-1.5 rounded-full py-3 text-sm font-bold transition-all ${
            canSubmit
              ? 'bg-primary text-primary-foreground shadow-md hover:brightness-110 active:scale-[0.99]'
              : 'cursor-not-allowed bg-muted text-muted-foreground'
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.6} />
          确认发布
        </button>
      </div>
    </div>
  )
}

function FieldLabel({
  children,
  required,
  className = '',
}: {
  children: React.ReactNode
  required?: boolean
  className?: string
}) {
  return (
    <label className={`mb-2 flex items-center gap-1 text-sm font-semibold text-foreground ${className}`}>
      {required && <span className="text-destructive">*</span>}
      {children}
    </label>
  )
}

function IconField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  required,
  inputMode,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  inputMode?: 'tel' | 'text'
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {icon}
      <span className="flex shrink-0 items-center gap-0.5 text-sm text-foreground">
        {required && <span className="text-destructive">*</span>}
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="flex-1 bg-transparent py-1.5 text-right text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
