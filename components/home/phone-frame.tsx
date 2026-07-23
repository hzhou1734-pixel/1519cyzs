import type { ReactNode } from 'react'

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 p-0 sm:p-6">
      {/* device bezel */}
      <div className="relative h-dvh w-full max-w-[375px] overflow-hidden bg-foreground shadow-2xl sm:h-[812px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-foreground sm:ring-1 sm:ring-border">
        {/* dynamic island / notch */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-50 hidden h-6 w-32 -translate-x-1/2 rounded-full bg-foreground sm:block" />
        {/* screen */}
        <div className="h-full w-full overflow-hidden bg-background sm:rounded-[2.1rem]">{children}</div>
      </div>
    </div>
  )
}
