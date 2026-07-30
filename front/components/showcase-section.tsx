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
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/components/ui/bubble"
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
        className="group flex-col items-start gap-3 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Chat demo */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">
              Customer ordering experience
            </h3>
            <div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
              <BubbleGroup className="gap-3">
                {/* Customer */}
                <Bubble variant="secondary" align="end">
                  <BubbleContent>
                    Hi, I'd like to order some food
                  </BubbleContent>
                </Bubble>

                {/* System */}
                <Bubble variant="tinted" align="start">
                  <BubbleContent>
                    Welcome! Scan the QR code on your table to see our menu.
                  </BubbleContent>
                </Bubble>

                {/* Customer */}
                <Bubble variant="secondary" align="end">
                  <BubbleContent>
                    I see the menu. Can I get the Grilled Chicken and a Soda?
                  </BubbleContent>
                </Bubble>

                {/* System */}
                <Bubble variant="tinted" align="start">
                  <BubbleContent>
                    Added to your cart. Total: 15,000 TZS (incl. VAT).
                  </BubbleContent>
                </Bubble>

                {/* Customer */}
                <Bubble variant="secondary" align="end">
                  <BubbleContent>
                    Can we split the bill between 3 people?
                  </BubbleContent>
                </Bubble>

                {/* System */}
                <Bubble variant="default" align="start">
                  <BubbleContent>
                    Split payment enabled. Each person pays 5,000 TZS.
                    Order sent to kitchen.
                  </BubbleContent>
                </Bubble>

                {/* Kitchen notification */}
                <Bubble variant="outline" align="start">
                  <BubbleContent>
                    Kitchen: Order #42 received. Preparing now.
                  </BubbleContent>
                </Bubble>
              </BubbleGroup>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                QR Ordering
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Split Payments
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Kitchen Display
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                VAT Calculation
              </span>
            </div>
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
