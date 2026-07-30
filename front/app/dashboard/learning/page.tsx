"use client"

import * as React from "react"
import {
  PlayCircleIcon,
  GraduationCapIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LightbulbIcon,
  SettingsIcon,
  UtensilsCrossedIcon,
  TableIcon,
  ClipboardListIcon,
  WalletIcon,
  UsersIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Tutorial {
  id: number
  title: string
  description: string
  duration: string
  category: string
  icon: React.ElementType
  videoUrl: string
  thumbnail: string
  steps: string[]
}

const tutorials: Tutorial[] = [
  {
    id: 1,
    title: "Getting Started with FoodPoint",
    description: "Learn the basics of FoodPoint — how to navigate your dashboard, understand the layout, and set up your restaurant profile for the first time.",
    duration: "5 min",
    category: "Basics",
    icon: GraduationCapIcon,
    videoUrl: "",
    thumbnail: "from-blue-500 to-indigo-600",
    steps: [
      "Log in to your dashboard",
      "Complete your restaurant profile (name, logo, address)",
      "Set your currency and VAT percentage",
      "Navigate the sidebar menu",
      "Understand the dashboard KPI cards",
    ],
  },
  {
    id: 2,
    title: "Setting Up Your Menu",
    description: "Create menu categories and add menu items with prices, descriptions, and images. Learn how to organize your menu for the best customer experience.",
    duration: "7 min",
    category: "Menu",
    icon: UtensilsCrossedIcon,
    videoUrl: "",
    thumbnail: "from-orange-500 to-red-500",
    steps: [
      "Go to Menu in the sidebar",
      "Create categories (e.g. Drinks, Main Course, Desserts)",
      "Add menu items with name, price, and description",
      "Upload item images",
      "Toggle item availability on/off",
    ],
  },
  {
    id: 3,
    title: "Tables & QR Codes",
    description: "Set up your restaurant tables and generate QR codes that customers scan to view your menu and place orders directly from their phones.",
    duration: "6 min",
    category: "Setup",
    icon: TableIcon,
    videoUrl: "",
    thumbnail: "from-emerald-500 to-teal-600",
    steps: [
      "Go to Tables & QR in the sidebar",
      "Add tables with names (Table 1, Table 2, etc.)",
      "Generate unique QR codes for each table",
      "Download and print QR codes",
      "Regenerate QR codes if needed",
    ],
  },
  {
    id: 4,
    title: "Managing Orders & Kitchen Display",
    description: "Track orders in real-time, use the kitchen display to manage preparation, and update order status from pending to served.",
    duration: "8 min",
    category: "Operations",
    icon: ClipboardListIcon,
    videoUrl: "",
    thumbnail: "from-purple-500 to-pink-600",
    steps: [
      "View active orders in the Orders page",
      "Use Kitchen Display to track preparation",
      "Update order status (preparing → ready → served)",
      "Mark individual items as served",
      "Handle cancellations and special requests",
    ],
  },
  {
    id: 5,
    title: "Payments & Revenue Tracking",
    description: "Understand how customer payments work — mobile money, card, and cash. Track revenue, view payment history, and confirm cash payments.",
    duration: "10 min",
    category: "Finance",
    icon: WalletIcon,
    videoUrl: "",
    thumbnail: "from-amber-500 to-orange-600",
    steps: [
      "View all payments in the Payments page",
      "Understand payment methods (mobile money, card, cash)",
      "Confirm cash payments from staff",
      "Track revenue on the Revenue page",
      "View commission deductions (1.5%)",
    ],
  },
  {
    id: 6,
    title: "Withdrawals & Payout Settings",
    description: "Learn how to withdraw your earnings to your mobile money or bank account. Set up payout details and understand the withdrawal process.",
    duration: "7 min",
    category: "Finance",
    icon: WalletIcon,
    videoUrl: "",
    thumbnail: "from-cyan-500 to-blue-600",
    steps: [
      "Set up payout settings (mobile money or bank)",
      "Check your available balance",
      "Request a withdrawal",
      "Understand the 1.5% commission deduction",
      "Track withdrawal status (pending, completed, failed)",
    ],
  },
  {
    id: 7,
    title: "Staff Management",
    description: "Add and manage staff members — waiters, kitchen staff, and managers. Assign roles and control what each team member can access.",
    duration: "6 min",
    category: "Management",
    icon: UsersIcon,
    videoUrl: "",
    thumbnail: "from-rose-500 to-pink-600",
    steps: [
      "Go to Staff in the sidebar",
      "Add new staff members with email and role",
      "Assign roles: waiter, kitchen, manager",
      "Edit or remove staff members",
      "Understand role-based access",
    ],
  },
  {
    id: 8,
    title: "Customer QR Ordering Flow",
    description: "See how your customers experience FoodPoint — from scanning the QR code to browsing the menu, placing orders, and paying from their phone.",
    duration: "5 min",
    category: "Customer",
    icon: SmartphoneIcon,
    videoUrl: "",
    thumbnail: "from-violet-500 to-purple-600",
    steps: [
      "Customer scans the table QR code",
      "Menu appears on their phone browser",
      "Customer adds items to cart",
      "Customer chooses payment method",
      "Payment is processed and order sent to kitchen",
    ],
  },
  {
    id: 9,
    title: "Upgrading Your Plan",
    description: "Compare plans and upgrade to unlock more features — unlimited menu items, more tables, advanced analytics, and priority support.",
    duration: "4 min",
    category: "Account",
    icon: SparklesIcon,
    videoUrl: "",
    thumbnail: "from-gold-500 to-yellow-600",
    steps: [
      "Go to Upgrade in the sidebar",
      "Compare available plans",
      "Choose a plan and payment method",
      "Pay via mobile money or card",
      "Enjoy your new features instantly",
    ],
  },
]

const categories = ["All", "Basics", "Menu", "Setup", "Operations", "Finance", "Management", "Customer", "Account"]

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [selectedTutorial, setSelectedTutorial] = React.useState<Tutorial | null>(null)

  const filteredTutorials = activeCategory === "All"
    ? tutorials
    : tutorials.filter((t) => t.category === activeCategory)

  const completedIds = React.useMemo(() => {
    if (typeof window === "undefined") return new Set<number>()
    const stored = localStorage.getItem("completed_tutorials")
    return new Set<number>(stored ? JSON.parse(stored) : [])
  }, [])

  const [completed, setCompleted] = React.useState<Set<number>>(completedIds)

  const toggleCompleted = (id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("completed_tutorials", JSON.stringify([...next]))
      }
      return next
    })
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCapIcon className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Learning Center</h2>
            <p className="text-sm text-muted-foreground">
              Learn how to get the most out of FoodPoint with step-by-step video tutorials
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircleIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {completed.size} of {tutorials.length} tutorials completed
              </p>
              <p className="text-xs text-muted-foreground">
                {completed.size === tutorials.length
                  ? "Amazing! You've completed all tutorials 🎉"
                  : "Keep learning to master FoodPoint!"}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(completed.size / tutorials.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums text-primary">
              {Math.round((completed.size / tutorials.length) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTutorials.map((tutorial) => {
          const isCompleted = completed.has(tutorial.id)
          const Icon = tutorial.icon

          return (
            <Card
              key={tutorial.id}
              className="group cursor-pointer overflow-hidden rounded-xl transition-all hover:shadow-lg hover:border-muted-foreground/30"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              {/* Thumbnail */}
              <div
                className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${tutorial.thumbnail}`}
              >
                <PlayCircleIcon className="size-12 text-white/90 transition-transform group-hover:scale-110" />
                {isCompleted && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                    <CheckCircleIcon className="size-3" />
                    Done
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  <ClockIcon className="size-3" />
                  {tutorial.duration}
                </div>
              </div>

              {/* Content */}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {tutorial.category}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-base leading-snug">
                  {tutorial.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-2">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {tutorial.steps.length} steps
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTutorial(tutorial)
                    }}
                  >
                    Watch
                    <ArrowRightIcon className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={!!selectedTutorial} onOpenChange={(open) => !open && setSelectedTutorial(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTutorial && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <selectedTutorial.icon className="size-4" />
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedTutorial.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="size-3" />
                    {selectedTutorial.duration}
                  </span>
                </div>
                <DialogTitle className="text-lg">{selectedTutorial.title}</DialogTitle>
                <DialogDescription className="leading-relaxed">
                  {selectedTutorial.description}
                </DialogDescription>
              </DialogHeader>

              {/* Video Player Placeholder */}
              <div className={`flex h-48 items-center justify-center rounded-xl bg-gradient-to-br ${selectedTutorial.thumbnail}`}>
                <div className="flex flex-col items-center gap-2 text-white">
                  <PlayCircleIcon className="size-16 opacity-90" />
                  <p className="text-sm font-medium">Video coming soon</p>
                  <p className="text-xs text-white/70">This tutorial will be available shortly</p>
                </div>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <LightbulbIcon className="size-4 text-amber-500" />
                  What you'll learn
                </p>
                <div className="grid gap-2">
                  {selectedTutorial.steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCompleted(selectedTutorial.id)}
                >
                  <CheckCircleIcon className="size-4" />
                  {completed.has(selectedTutorial.id) ? "Mark as incomplete" : "Mark as completed"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTutorial(null)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
