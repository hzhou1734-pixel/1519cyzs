'use client'

import { House, Repeat, Newspaper, User, Plus } from 'lucide-react'

type Props = {
  active: string
  onSwitch: (page: string) => void
}

const items = [
  { page: 'home', label: '首页', Icon: House },
  { page: 'idle', label: '闲置社区', Icon: Repeat },
]
const rightItems = [
  { page: 'news', label: '资讯', Icon: Newspaper },
  { page: 'me', label: '我的', Icon: User, badge: 3 },
]

export function BottomTabBar({ active, onSwitch }: Props) {
  return (
    <div className="absolute bottom-0 left-0 z-40 w-full border-t border-border bg-card">
      <div className="flex items-center">
        {items.map(({ page, label, Icon }) => (
          <TabButton key={page} page={page} label={label} Icon={Icon} active={active === page} onSwitch={onSwitch} />
        ))}

        {/* center publish */}
        <button
          type="button"
          onClick={() => onSwitch('publish-pre')}
          className="flex flex-1 flex-col items-center"
          aria-label="发布"
        >
          <span className="-mt-6 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#d06a12] text-white shadow-lg shadow-accent/40 transition-transform hover:scale-105 active:scale-95">
            <Plus className="h-6 w-6" strokeWidth={2.6} />
          </span>
        </button>

        {rightItems.map(({ page, label, Icon, badge }) => (
          <TabButton
            key={page}
            page={page}
            label={label}
            Icon={Icon}
            active={active === page}
            onSwitch={onSwitch}
            badge={badge}
          />
        ))}
      </div>
    </div>
  )
}

function TabButton({
  page,
  label,
  Icon,
  active,
  onSwitch,
  badge,
}: {
  page: string
  label: string
  Icon: typeof House
  active: boolean
  onSwitch: (p: string) => void
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={() => onSwitch(page)}
      className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <span className="relative">
        <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
        {badge ? (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
