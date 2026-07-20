'use client'

import { useState } from 'react'
import { X, Check, ChevronRight } from 'lucide-react'
import { regions, type Region } from '@/lib/app-data'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (value: string) => void
}

type Level = 0 | 1 | 2

export function RegionPicker({ open, onClose, onConfirm }: Props) {
  const [province, setProvince] = useState<Region | null>(null)
  const [city, setCity] = useState<Region | null>(null)
  const [level, setLevel] = useState<Level>(0)

  if (!open) return null

  const reset = () => {
    setProvince(null)
    setCity(null)
    setLevel(0)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // 当前层级展示的列表
  const list: Region[] = level === 0 ? regions : level === 1 ? province?.children ?? [] : city?.children ?? []

  const handlePick = (item: Region) => {
    if (level === 0) {
      setProvince(item)
      // 无下级则直接完成
      if (!item.children?.length) {
        onConfirm(item.name)
        reset()
        onClose()
        return
      }
      setLevel(1)
    } else if (level === 1) {
      setCity(item)
      if (!item.children?.length) {
        onConfirm(`${province?.name} · ${item.name}`)
        reset()
        onClose()
        return
      }
      setLevel(2)
    } else {
      onConfirm(`${province?.name} · ${city?.name} · ${item.name}`)
      reset()
      onClose()
    }
  }

  const tabs = [
    { label: province?.name ?? '请选择', active: level === 0, show: true, go: () => setLevel(0) },
    { label: city?.name ?? '请选择', active: level === 1, show: !!province, go: () => setLevel(1) },
    { label: '请选择', active: level === 2, show: !!city, go: () => setLevel(2) },
  ]

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* 遮罩 */}
      <button type="button" aria-label="关闭" onClick={handleClose} className="absolute inset-0 bg-foreground/40" />

      {/* 弹层 */}
      <div className="relative z-10 flex max-h-[70%] flex-col rounded-t-2xl bg-card duration-200 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">选择所在地区</span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="关闭"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 已选层级 tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-4 py-2.5 text-sm">
          {tabs
            .filter((t) => t.show)
            .map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                <button
                  type="button"
                  onClick={t.go}
                  className={`whitespace-nowrap rounded-md px-2 py-1 font-medium transition-colors ${
                    t.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              </span>
            ))}
        </div>

        {/* 选项列表 */}
        <div className="no-scrollbar flex-1 overflow-y-auto py-1">
          {list.map((item) => {
            const selected =
              (level === 0 && province?.name === item.name) || (level === 1 && city?.name === item.name)
            return (
              <button
                type="button"
                key={item.name}
                onClick={() => handlePick(item)}
                className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted/60"
              >
                <span className={selected ? 'font-semibold text-primary' : ''}>{item.name}</span>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
