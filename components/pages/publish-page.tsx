'use client'

import { useEffect, useRef, useState } from 'react'
import { ImagePlus, MapPin, Phone, Tag as TagIcon, Check, X, ChevronRight, Navigation } from 'lucide-react'
import { publishCats } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { RegionPicker } from '@/components/shared/region-picker'
import { TagPicker } from '@/components/shared/tag-picker'
import { MapPicker } from '@/components/shared/map-picker'

const MAX_IMAGES = 9
const PHONE_RE = /^1[3-9]\d{9}$/

// 置顶推广方案（按周期付费）
const TOP_PLANS: { key: string; title: string; price: string; note: string; amount: number }[] = [
  { key: 'none', title: '不置顶', price: '¥0', note: '免费发布', amount: 0 },
  { key: '7', title: '7天置顶', price: '¥9.9', note: '¥1.4/天', amount: 9.9 },
  { key: '15', title: '15天置顶', price: '¥18.8', note: '¥1.25/天', amount: 18.8 },
  { key: '30', title: '30天置顶', price: '¥29.9', note: '¥1.0/天', amount: 29.9 },
]

type Props = {
  showToast: (msg: string) => void
  onDone: () => void
  onPay: (amount: number, label: string) => void
  /** 从发布类型选择页带入的一级/二级分类 */
  initialCat?: string
  initialSubCat?: string
  /** 发布成功后的回调（关闭整个发布流程），默认回退 */
  onPublished?: () => void
}

export function PublishPage({ showToast, onDone, onPay, initialCat = '', initialSubCat = '', onPublished }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  // 分类在上一步已选定，此处仅作只读展示与提交校验
  const cat = initialCat
  const subCat = initialSubCat
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [school, setSchool] = useState('')
  const [students, setStudents] = useState('')
  const [floor, setFloor] = useState('')
  const [area, setArea] = useState('')
  const [region, setRegion] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [topPlan, setTopPlan] = useState('none')
  const [regionOpen, setRegionOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)

  const catLabel = publishCats.find((c) => c.cat === cat)?.label ?? (cat === 'idle' ? '二手闲置' : cat)
  const phoneValid = PHONE_RE.test(phone)
  const phoneError = phoneTouched && phone.length > 0 && !phoneValid
  const codeValid = /^\d{6}$/.test(code)
  const canSubmit =
    cat && subCat && title.trim() && desc.trim() && region.trim() && address.trim() && phoneValid && codeSent && codeValid

  // 验证码倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const sendCode = () => {
    if (!phoneValid) {
      setPhoneTouched(true)
      showToast('请先输入正确的手机号码')
      return
    }
    if (countdown > 0) return
    setCodeSent(true)
    setCountdown(60)
    showToast('验证码已发送')
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const room = MAX_IMAGES - images.length
    if (room <= 0) {
      showToast(`最多上传 ${MAX_IMAGES} 张图片`)
      return
    }
    const picked = Array.from(files).slice(0, room)
    const readers = picked.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        }),
    )
    Promise.all(readers).then((urls) => setImages((prev) => [...prev, ...urls]))
    if (files.length > room) showToast(`最多上传 ${MAX_IMAGES} 张，已自动截取`)
  }

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = () => {
    if (!canSubmit) {
      setPhoneTouched(true)
      showToast('请完善必填信息')
      return
    }
    const plan = TOP_PLANS.find((p) => p.key === topPlan)
    if (plan && plan.amount > 0) {
      // 选择了付费置顶方案，进入支付页
      onPay(plan.amount, `置顶推广 ${plan.title.replace('置顶', '')}`)
      return
    }
    showToast('发布成功，等待审核')
    setTimeout(onPublished ?? onDone, 900)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <PageHeader title="发布信息" onBack={onDone} />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-24">
        <div className="flex flex-col gap-3 px-3 py-3">
          {/* 发布类型（已在上一步选择，此处只读展示） */}
          <section className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <TagIcon className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-[13px] text-muted-foreground">发布类型</span>
            <span className="ml-auto flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
              {catLabel}
              {subCat && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {subCat}
                </>
              )}
            </span>
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

          {/* 商铺详情 */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <FieldLabel>商铺详情</FieldLabel>
            <div className="flex flex-col gap-3">
              <TextField label="学校名称" value={school} onChange={setSchool} placeholder="如：湖南大学" maxLength={20} />
              <TextField
                label="在校人数"
                value={students}
                onChange={(v) => setStudents(v.replace(/\D/g, '').slice(0, 7))}
                placeholder="请输入在校人数"
                inputMode="numeric"
                suffix="人"
              />
              <TextField label="商铺楼层" value={floor} onChange={setFloor} placeholder="如：1 楼 / 负一层" maxLength={10} />
              <TextField
                label="商铺面积"
                value={area}
                onChange={(v) => setArea(v.replace(/[^\d.]/g, '').slice(0, 8))}
                placeholder="请输入面积"
                inputMode="decimal"
                suffix="㎡"
              />
            </div>
          </section>

          {/* 图片上传 */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <FieldLabel className="mb-0">上传图片</FieldLabel>
              <span className="text-[11px] text-muted-foreground">{images.length}/{MAX_IMAGES}</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  {/* 用户本地选择的图片预览 */}
                  <img src={src || '/placeholder.svg'} alt={`已选图片 ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label={`删除图片 ${idx + 1}`}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background transition-colors hover:bg-foreground/80"
                  >
                    <X className="h-3 w-3" strokeWidth={2.6} />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <ImagePlus className="h-6 w-6" strokeWidth={1.75} />
                  <span className="text-[10px]">最多{MAX_IMAGES}张</span>
                </button>
              )}
            </div>
          </section>

          {/* 区域 / 详细地址 / 电话 / 标签 */}
          <section className="rounded-xl border border-border bg-card p-1 shadow-sm">
            {/* 选择区域 - 省市区三级联动 */}
            <button
              type="button"
              onClick={() => setRegionOpen(true)}
              className="flex w-full items-center gap-2 px-3 py-3.5 text-left"
            >
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span className="flex shrink-0 items-center gap-0.5 text-sm text-foreground">
                <span className="text-destructive">*</span>选择区域
              </span>
              <span className={`ml-auto truncate text-[13px] ${region ? 'text-foreground' : 'text-muted-foreground'}`}>
                {region || '请选择省 / 市 / 区'}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            <div className="mx-4 border-t border-border" />

            {/* 详细地址 - 打开地图选点 */}
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="flex w-full items-start gap-2 px-3 py-3.5 text-left"
            >
              <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="mt-0.5 flex shrink-0 items-center gap-0.5 text-sm text-foreground">
                <span className="text-destructive">*</span>详细地址
              </span>
              <span className={`ml-auto text-right text-[13px] leading-relaxed ${address ? 'text-foreground' : 'text-muted-foreground'}`}>
                {address || '打开地图选择位置'}
              </span>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            <div className="mx-4 border-t border-border" />

            {/* 联系电话 - 手机号校验 */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <span className="flex shrink-0 items-center gap-0.5 text-sm text-foreground">
                  <span className="text-destructive">*</span>联系电话
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="请输入11位手机号"
                  inputMode="tel"
                  className="flex-1 bg-transparent py-1.5 text-right text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              {phoneError && <p className="pb-1 text-right text-[11px] text-destructive">请输入正确的手机号码</p>}
            </div>

            <div className="mx-4 border-t border-border" />

            {/* 验证码校验 */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-accent" />
                <span className="flex shrink-0 items-center gap-0.5 text-sm text-foreground">
                  <span className="text-destructive">*</span>验证码
                </span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="请输入6位验证码"
                  inputMode="numeric"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-right text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={countdown > 0 || !phoneValid}
                  className="shrink-0 rounded-full border border-accent px-3 py-1.5 text-[12px] font-semibold text-accent transition-colors disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : codeSent ? '重新获取' : '获取验证码'}
                </button>
              </div>
            </div>

            <div className="mx-4 border-t border-border" />

            {/* 添加标签 - 打开标签多选器 */}
            <button
              type="button"
              onClick={() => setTagOpen(true)}
              className="flex w-full items-center gap-2 px-3 py-3.5 text-left"
            >
              <TagIcon className="h-4 w-4 shrink-0 text-accent" />
              <span className="shrink-0 text-sm text-foreground">添加标签</span>
              {tags.length > 0 ? (
                <span className="ml-auto flex flex-wrap items-center justify-end gap-1">
                  {tags.map((t) => (
                    <span key={t} className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent">
                      {t}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="ml-auto text-[13px] text-muted-foreground">选填</span>
              )}
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </section>

          {/* 置顶推广 */}
          <div>
            <h2 className="mb-2 px-1 text-sm font-bold text-foreground">置顶推广（按周期付费）</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {TOP_PLANS.map((p) => {
                const active = topPlan === p.key
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setTopPlan(p.key)}
                    className={`flex flex-col items-center gap-0.5 rounded-xl border py-3 transition-colors ${
                      active ? 'border-accent bg-accent-soft' : 'border-border bg-card'
                    }`}
                  >
                    <span className={`text-sm font-bold ${active ? 'text-accent' : 'text-foreground'}`}>{p.title}</span>
                    <span className={`text-base font-bold ${p.key === 'none' ? 'text-foreground' : 'text-destructive'}`}>{p.price}</span>
                    <span className="text-[11px] text-muted-foreground">{p.note}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            发布即表示同意《万户优铺信息发布规范》，请勿发布虚假、违规信息，平台将进行人工审核。
          </p>
        </div>
      </div>

      {/* 底部提交栏 */}
      <div className="absolute bottom-0 left-0 z-30 w-full border-t border-border bg-card px-3 pb-6 pt-3">
        <p className="mb-2 text-center text-[12px] text-muted-foreground">
          每日免费发布 1 条，今日剩余：<span className="font-semibold text-primary">1</span> 条
        </p>
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

      {/* 省市区三级联动选择器 */}
      <RegionPicker open={regionOpen} onClose={() => setRegionOpen(false)} onConfirm={setRegion} />

      {/* 详细地址 - 地图选点 */}
      <MapPicker
        open={mapOpen}
        initial={address}
        onClose={() => setMapOpen(false)}
        onConfirm={(addr) => {
          setAddress(addr)
          setMapOpen(false)
        }}
      />

      {/* 标签多选器 */}
      <TagPicker
        open={tagOpen}
        selected={tags}
        max={8}
        onClose={() => setTagOpen(false)}
        onConfirm={(t) => {
          setTags(t)
          setTagOpen(false)
        }}
      />
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  inputMode,
  suffix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel'
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm text-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
      {suffix && <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>}
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
