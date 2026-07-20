'use client'

import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { publishTags } from '@/lib/app-data'

type Props = {
  open: boolean
  selected: string[]
  max?: number
  onClose: () => void
  onConfirm: (tags: string[]) => void
}

export function TagPicker({ open, selected, max = 5, onClose, onConfirm }: Props) {
  const [picked, setPicked] = useState<string[]>(selected)
  const [custom, setCustom] = useState('')

  if (!open) return null

  // 预设 + 已添加的自定义标签合并去重
  const allTags = Array.from(new Set([...publishTags, ...picked]))

  const toggle = (tag: string) => {
    setPicked((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag)
      if (prev.length >= max) return prev
      return [...prev, tag]
    })
  }

  const addCustom = () => {
    const v = custom.trim()
    if (!v) return
    if (!picked.includes(v) && picked.length < max) {
      setPicked((prev) => [...prev, v])
    }
    setCustom('')
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button type="button" aria-label="关闭" onClick={onClose} className="absolute inset-0 bg-foreground/40" />

      <div className="relative z-10 flex max-h-[75%] flex-col rounded-t-2xl bg-card duration-200 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            添加标签
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              （{picked.length}/{max}）
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const on = picked.includes(tag)
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggle(tag)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all ${
                    on
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {on && <Check className="h-3 w-3" strokeWidth={2.6} />}
                  {tag}
                </button>
              )
            })}
          </div>

          {/* 自定义标签 */}
          <div className="mt-5">
            <span className="mb-2 block text-xs font-medium text-muted-foreground">自定义标签</span>
            <div className="flex items-center gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                    e.preventDefault()
                    addCustom()
                  }
                }}
                maxLength={8}
                placeholder="输入后点击添加，最多8字"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={!custom.trim() || picked.length >= max}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
                添加
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 pb-6 pt-3">
          <button
            type="button"
            onClick={() => onConfirm(picked)}
            className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.99]"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
