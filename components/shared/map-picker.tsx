'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { X, MapPin, LocateFixed, Loader2 } from 'lucide-react'

type Props = {
  open: boolean
  initial?: string
  onClose: () => void
  onConfirm: (address: string) => void
}

// 默认中心：长沙市岳麓区大学城
const DEFAULT_CENTER: [number, number] = [28.2003, 112.9294]

export function MapPicker({ open, initial = '', onClose, onConfirm }: Props) {
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [address, setAddress] = useState(initial)
  const [loading, setLoading] = useState(false)

  // 逆地理编码：根据坐标反查地址（OpenStreetMap Nominatim）
  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=zh-CN`,
      )
      const data = await res.json()
      if (data?.display_name) {
        // 去掉国家/邮编等冗余，保留主体地址
        const name = String(data.display_name).replace(/,?\s*中国$/, '').replace(/,?\s*\d{6}\b/, '')
        setAddress(name)
      } else {
        setAddress(`经纬度 ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    } catch {
      setAddress(`经纬度 ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    let disposed = false

    ;(async () => {
      const L = (await import('leaflet')).default
      if (disposed || !mapElRef.current) return
      // 已初始化则跳过
      if (mapRef.current) {
        setTimeout(() => mapRef.current?.invalidateSize(), 0)
        return
      }
      const map = L.map(mapElRef.current, {
        center: DEFAULT_CENTER,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)
      mapRef.current = map
      setTimeout(() => map.invalidateSize(), 60)
    })()

    return () => {
      disposed = true
    }
  }, [open])

  // 关闭时销毁地图实例，避免容器复用报错
  useEffect(() => {
    if (open) return
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
  }, [open])

  const useCurrentCenter = () => {
    const map = mapRef.current
    if (!map) return
    const c = map.getCenter()
    reverseGeocode(c.lat, c.lng)
  }

  const locateMe = () => {
    const map = mapRef.current
    if (!map || !navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.setView([latitude, longitude], 16)
        reverseGeocode(latitude, longitude)
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  if (!open) return null

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-background">
      {/* 顶部栏 */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
        <span className="text-sm font-semibold text-foreground">地图选点</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 地图区域 */}
      <div className="relative flex-1">
        <div ref={mapElRef} className="absolute inset-0 h-full w-full" />

        {/* 居中固定图钉 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[10] -translate-x-1/2 -translate-y-full">
          <MapPin className="h-9 w-9 text-accent drop-shadow-md" fill="currentColor" strokeWidth={1.5} />
        </div>

        {/* 定位到当前位置 */}
        <button
          type="button"
          onClick={locateMe}
          aria-label="定位当前位置"
          className="absolute bottom-4 right-4 z-[10] flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary shadow-md transition-colors hover:bg-muted"
        >
          <LocateFixed className="h-5 w-5" />
        </button>

        {/* 使用此位置 */}
        <button
          type="button"
          onClick={useCurrentCenter}
          className="absolute bottom-4 left-4 z-[10] flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          使用此位置
        </button>
      </div>

      {/* 底部地址编辑与确认 */}
      <div className="shrink-0 border-t border-border bg-card px-4 pb-6 pt-3">
        <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">详细地址</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="移动地图并点击「使用此位置」，或手动填写门牌号等详细地址"
          className="mb-3 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        <button
          type="button"
          disabled={!address.trim()}
          onClick={() => onConfirm(address.trim())}
          className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          确认地址
        </button>
      </div>
    </div>
  )
}
