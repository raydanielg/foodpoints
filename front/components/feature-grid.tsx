"use client"

import * as React from "react"
import {
  QrCodeIcon,
  WalletIcon,
  ChefHatIcon,
  BarChart3Icon,
  ClipboardListIcon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const features: {
  icon: LucideIcon
  title: string
  desc: string
}[] = [
  {
    icon: QrCodeIcon,
    title: "QR Code Ordering",
    desc: "Customers scan a QR code on their table to instantly view your menu and place orders — no app needed.",
  },
  {
    icon: WalletIcon,
    title: "Split Payments",
    desc: "Let customers split bills easily. Multiple payment methods supported with automatic VAT calculation.",
  },
  {
    icon: ChefHatIcon,
    title: "Kitchen Display",
    desc: "Real-time kitchen display system. Orders flow directly to the kitchen with prep time tracking.",
  },
  {
    icon: BarChart3Icon,
    title: "Analytics Dashboard",
    desc: "Track revenue, top sellers, order status, and daily performance with beautiful charts.",
  },
  {
    icon: ClipboardListIcon,
    title: "Menu Management",
    desc: "Easily manage categories, items, prices, and availability. Upload photos for every dish.",
  },
  {
    icon: SmartphoneIcon,
    title: "Mobile First",
    desc: "Optimized for mobile devices. Your customers order from their phones, your staff manages from anywhere.",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <Item
        variant="outline"
        className="group flex-col items-start gap-4 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
      >
        <ItemMedia
          variant="icon"
          className="size-12 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3"
        >
          <feature.icon className="size-6" />
        </ItemMedia>
        <ItemContent className="gap-2">
          <ItemTitle className="text-base font-semibold">
            {feature.title}
          </ItemTitle>
          <ItemDescription className="text-sm leading-relaxed">
            {feature.desc}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {features.map((feature, i) => (
        <FeatureCard key={feature.title} feature={feature} index={i} />
      ))}
    </div>
  )
}
