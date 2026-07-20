import { HomeApp } from '@/components/home/home-app'
import { PhoneFrame } from '@/components/home/phone-frame'

export default function Page() {
  return (
    <main className="min-h-dvh bg-muted/40">
      <PhoneFrame>
        <HomeApp />
      </PhoneFrame>
    </main>
  )
}
