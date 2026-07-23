'use client'

import {
  UtensilsCrossed,
  Store,
  Stethoscope,
  Building2,
  UserPlus,
  ClipboardList,
  House,
  Tag,
  GraduationCap,
  Soup,
  type LucideIcon,
} from 'lucide-react'
import { navItems } from '@/lib/home-data'

const iconMap: Record<string, LucideIcon> = {
  canteen: UtensilsCrossed,
  street: Store,
  hospital: Stethoscope,
  park: Building2,
  recruit: UserPlus,
  biz: ClipboardList,
  shop: House,
  brand: Tag,
  training: GraduationCap,
  sauce: Soup,
}

type Props = {
  onNav: (cat: string) => void
}

export function CategoryNav({ onNav }: Props) {
  return (
    <div className="px-3 py-1.5">
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="grid grid-cols-5 gap-y-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.cat] ?? UtensilsCrossed
            return (
              <button
                type="button"
                key={item.cat}
                onClick={() => onNav(item.cat)}
                className="group flex flex-col items-center gap-1.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-border/60 transition-all group-hover:-translate-y-0.5 group-hover:ring-primary/40 group-hover:shadow-md group-active:scale-95">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-medium text-foreground">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
