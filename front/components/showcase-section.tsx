"use client"

import * as React from "react"
import {
  QrCodeIcon,
  WalletIcon,
  ChefHatIcon,
  BarChart3Icon,
  ClipboardListIcon,
  SmartphoneIcon,
  ReceiptIcon,
  UsersIcon,
  PlusIcon,
  CheckIcon,
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

const showcaseItems: {
  icon: LucideIcon
  title: string
  desc: string
}[] = [
  {
    icon: QrCodeIcon,
    title: "Instant QR Ordering",
    desc: "Scan, browse, order — done in seconds.",
  },
  {
    icon: WalletIcon,
    title: "Split Payments",
    desc: "Split bills among friends with one tap.",
  },
  {
    icon: ChefHatIcon,
    title: "Kitchen Display",
    desc: "Orders flow to kitchen in real-time.",
  },
  {
    icon: BarChart3Icon,
    title: "Live Analytics",
    desc: "Revenue, top sellers, and order stats.",
  },
  {
    icon: ReceiptIcon,
    title: "Receipt Management",
    desc: "Digital receipts with VAT breakdown.",
  },
  {
    icon: UsersIcon,
    title: "Staff Management",
    desc: "Manage roles, shifts, and permissions.",
  },
  {
    icon: ClipboardListIcon,
    title: "Menu Control",
    desc: "Update items, prices, and availability.",
  },
  {
    icon: SmartphoneIcon,
    title: "Mobile Optimized",
    desc: "Works perfectly on any phone or tablet.",
  },
]

const menuItems = [
  {
    name: "Grilled Chicken",
    price: "12,000",
    category: "Main Course",
    image: "/images/56.jpg",
  },
  {
    name: "Beef Burger",
    price: "15,000",
    category: "Main Course",
    image: "/images/58 (1).jpg",
  },
  {
    name: "Signature Dish",
    price: "18,000",
    category: "Chef Special",
    image: "/images/6342.jpg",
  },
  {
    name: "Premium Platter",
    price: "25,000",
    category: "Chef Special",
    image: "/images/19743.jpg",
  },
]

function ShowcaseCard({
  item,
  index,
}: {
  item: (typeof showcaseItems)[number]
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
          : "translate-y-6 opacity-0 scale-95"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Item
        variant="outline"
        className="group flex-col items-start gap-3 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
      >
        <ItemMedia
          variant="icon"
          className="size-10 rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
        >
          <item.icon className="size-5" />
        </ItemMedia>
        <ItemContent className="gap-1">
          <ItemTitle className="text-sm font-semibold">
            {item.title}
          </ItemTitle>
          <ItemDescription className="text-xs leading-relaxed">
            {item.desc}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

function PhoneMockup() {
  const [added, setAdded] = React.useState<Set<number>>(new Set())
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

  const toggleAdd = (i: number) => {
    setAdded((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const total = [...added]
    .map((i) => parseInt(menuItems[i].price.replace(/,/g, "")))
    .reduce((a, b) => a + b, 0)

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto flex justify-center transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <div className="relative w-full max-w-sm">
        {/* Phone frame */}
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-foreground/15 bg-background shadow-2xl">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-foreground/5 px-6 py-2 text-[10px] font-medium text-muted-foreground">
            <span>9:41</span>
            <span>FoodPoint</span>
            <span>100%</span>
          </div>

          {/* Restaurant header */}
          <div className="relative h-28 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/3394.jpg"
              alt="Restaurant"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
              <div className="text-white">
                <p className="text-sm font-bold">The Garden Restaurant</p>
                <p className="text-[10px] text-white/80">Table 5 · Session #42</p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <QrCodeIcon className="size-4 text-white" />
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex flex-col gap-2 p-3">
            <p className="px-1 text-xs font-semibold text-muted-foreground">
              Menu · Tap to order
            </p>
            {menuItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleAdd(i)}
                className="flex items-center gap-3 rounded-xl border p-2 text-left transition-all hover:border-primary/50 hover:shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-xs font-semibold">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.category}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {item.price} TZS
                  </span>
                </div>
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg transition-all",
                    added.has(i)
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {added.has(i) ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <PlusIcon className="size-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Cart bar */}
          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
            <div>
              <p className="text-[10px] text-muted-foreground">
                {added.size} item{added.size !== 1 ? "s" : ""} · Subtotal
              </p>
              <p className="text-sm font-bold text-primary">
                {total.toLocaleString()} TZS
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
              <WalletIcon className="size-3.5" />
              Split &amp; Pay
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShowcaseSection() {
  return (
    <section id="showcase" className="border-t py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See FoodPoint in action
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From customer ordering to kitchen to payments — every feature
            designed to work together seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Left: Phone mockup with menu */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Customer scans QR · sees menu · orders
            </h3>
            <PhoneMockup />
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              Try it — tap the items to add them to your cart.
            </p>
          </div>

          {/* Right: Feature list */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">
              Everything included
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {showcaseItems.map((item, i) => (
                <ShowcaseCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
