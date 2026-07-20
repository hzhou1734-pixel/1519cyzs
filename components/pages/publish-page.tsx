'use client'

import { useRef, useState } from 'react'
import { ImagePlus, MapPin, Phone, Tag as TagIcon, Check, X, ChevronRight } from 'lucide-react'
import { publishCats } from '@/lib/app-data'
import { PageHeader } from '@/components/shared/page-header'
import { RegionPicker } from '@/components/shared/region-picker'
import { TagPicker } from '@/components/shared/tag-picker'

type Props = {
  showToast: (msg: string) => void
  onDone: () => void
}

const MAX_IMAGES = 9
const PHONE_RE = /^1[3-9]\d{9}$/

export function PublishPage({ showToast, onDone }: Props) {
  const [cat, setCat] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [regionOpen, setRegionOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const phoneValid = PHONE_RE.test(phone)
  const phoneError = phoneTouched && phone.length > 0 && !phoneValid
  const canSubmit = cat && title.trim() && desc.trim() && location.trim() && phoneValid

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
                  <img src={src || "/placeholder.svg"} alt={`已选图片 ${idx + 1}`} className="h-full w-full object-cover" />
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

          {/* 地区 / 电话 / 标签 */}
          <section className="rounded-xl border border-border bg-card p-1 shadow-sm">
            {/* 所在地区 - 打开三级联动选择器 */}
            <button
              type="button"
              onClick={() => setRegionOpen(true)}
              className="flex w-full items-center gap-2 px-3 py-3.5 text-left"
            >
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span className="flex shrink-0 items-center gap-0.5 text-sm text-foreground">
                <span className="text-destructive">*</span>所在地区
              </span>
              <span className={`ml-auto truncate text-[13px] ${location ? 'text-foreground' : 'text-muted-foreground'}`}>
                {location || '请选择省 / 市 / 区'}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
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
              {phoneError && (
                <p className="pb-1 text-right text-[11px] text-destructive">请输入正确的手机号码</p>
              )}
            </div>

            <div className="mx-4 border-t border-border" />

            {/* 添加标签 - 打开标签选择器 */}
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

      {/* 省市区三级联动选择器 */}
      <RegionPicker open={regionOpen} onClose={() => setRegionOpen(false)} onConfirm={setLocation} />

      {/* 标签选择器 */}
      <TagPicker
        open={tagOpen}
        selected={tags}
        onClose={() => setTagOpen(false)}
        onConfirm={(t) => {
          setTags(t)
          setTagOpen(false)
        }}
      />
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
