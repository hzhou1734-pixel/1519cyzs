import { Signal, Wifi, BatteryFull } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="flex h-9 items-center justify-between bg-primary px-5 text-white">
      <span className="text-[13px] font-semibold tracking-wide">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" aria-hidden />
        <Wifi className="h-3.5 w-3.5" aria-hidden />
        <BatteryFull className="h-4 w-4" aria-hidden />
        <span className="sr-only">信号、WiFi、电量</span>
      </div>
    </div>
  )
}
