'use client'

import { Search, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = '搜索' }: Props) {
  return (
    <div className="px-3 pb-1 pt-2.5">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 focus-within:border-primary">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="清除"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
