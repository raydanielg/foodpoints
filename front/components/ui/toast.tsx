"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  InfoIcon,
  AlertTriangleIcon,
  XCircleIcon,
  Loader2Icon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ToastType = "success" | "info" | "warning" | "error" | "loading"

interface ToastItem {
  id: string
  title: string
  description?: string
  type?: ToastType
  actionProps?: {
    children: React.ReactNode
    onClick?: () => void
  }
  duration?: number
}

type ToastOptions = Omit<ToastItem, "id">

const listeners = new Set<(toasts: ToastItem[]) => void>()
let toasts: ToastItem[] = []

function notify() {
  listeners.forEach((l) => l([...toasts]))
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

export const toast = {
  add(options: ToastOptions): string {
    const id = Math.random().toString(36).slice(2)
    const item: ToastItem = {
      id,
      duration: 5000,
      ...options,
    }
    toasts = [...toasts, item]
    notify()

    if (item.duration && item.duration > 0 && item.type !== "loading") {
      setTimeout(() => removeToast(id), item.duration)
    }

    return id
  },
  close(id: string) {
    removeToast(id)
  },
  promise<T>(
    promise: Promise<T>,
    opts: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((err: unknown) => string)
    }
  ): Promise<T> {
    const id = this.add({
      title: opts.loading,
      type: "loading",
      duration: 0,
    })

    promise
      .then((data) => {
        const msg = typeof opts.success === "function" ? opts.success(data) : opts.success
        toasts = toasts.map((t) =>
          t.id === id ? { ...t, title: msg, type: "success", duration: 5000 } : t
        )
        notify()
        setTimeout(() => removeToast(id), 5000)
      })
      .catch((err) => {
        const msg = typeof opts.error === "function" ? opts.error(err) : opts.error
        toasts = toasts.map((t) =>
          t.id === id ? { ...t, title: msg, type: "error", duration: 5000 } : t
        )
        notify()
        setTimeout(() => removeToast(id), 5000)
      })

    return promise
  },
}

const typeConfig: Record<
  ToastType,
  { icon: LucideIcon; iconClass: string; borderClass: string }
> = {
  success: {
    icon: CheckCircle2Icon,
    iconClass: "text-green-600",
    borderClass: "border-l-green-600",
  },
  info: {
    icon: InfoIcon,
    iconClass: "text-blue-600",
    borderClass: "border-l-blue-600",
  },
  warning: {
    icon: AlertTriangleIcon,
    iconClass: "text-amber-600",
    borderClass: "border-l-amber-600",
  },
  error: {
    icon: XCircleIcon,
    iconClass: "text-red-600",
    borderClass: "border-l-red-600",
  },
  loading: {
    icon: Loader2Icon,
    iconClass: "text-primary",
    borderClass: "border-l-primary",
  },
}

function ToastCard({ toast: item }: { toast: ToastItem }) {
  const type = item.type ?? "info"
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-l-4 bg-background p-4 shadow-lg",
        "animate-in slide-in-from-bottom-2 fade-in-0 duration-300",
        config.borderClass
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          config.iconClass,
          type === "loading" && "animate-spin"
        )}
      />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
      {item.actionProps && (
        <button
          type="button"
          onClick={item.actionProps.onClick}
          className="shrink-0 rounded-md px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          {item.actionProps.children}
        </button>
      )}
      <button
        type="button"
        onClick={() => removeToast(item.id)}
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    listeners.add(setItems)
    return () => {
      listeners.delete(setItems)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
      {items.map((item) => (
        <div key={item.id} className="w-full max-w-sm">
          <ToastCard toast={item} />
        </div>
      ))}
    </div>
  )
}
