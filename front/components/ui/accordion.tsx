"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  type = "single",
  collapsible = true,
  className,
  children,
  ...props
}: {
  type?: "single" | "multiple"
  collapsible?: boolean
  className?: string
  children: React.ReactNode
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set())

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        if (collapsible) next.delete(value)
      } else {
        if (type === "single") next.clear()
        next.add(value)
      }
      return next
    })
  }

  return (
    <div
      className={cn("w-full", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ _toggleItem?: (v: string) => void; _openItems?: Set<string> }>, {
            _toggleItem: toggleItem,
            _openItems: openItems,
          })
        }
        return child
      })}
    </div>
  )
}

function AccordionItem({
  value,
  className,
  children,
  _toggleItem,
  _openItems,
}: {
  value: string
  className?: string
  children: React.ReactNode
  _toggleItem?: (value: string) => void
  _openItems?: Set<string>
}) {
  const isOpen = _openItems?.has(value) ?? false

  return (
    <div className={cn("border-b", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ _isOpen?: boolean; _toggle?: () => void }>, {
            _isOpen: isOpen,
            _toggle: () => _toggleItem?.(value),
          })
        }
        return child
      })}
    </div>
  )
}

function AccordionTrigger({
  children,
  className,
  _isOpen,
  _toggle,
}: {
  children: React.ReactNode
  className?: string
  _isOpen?: boolean
  _toggle?: () => void
}) {
  return (
    <button
      type="button"
      onClick={_toggle}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left transition-all hover:underline",
        className
      )}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          _isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

function AccordionContent({
  children,
  className,
  _isOpen,
}: {
  children: React.ReactNode
  className?: string
  _isOpen?: boolean
}) {
  if (!_isOpen) return null

  return (
    <div className={cn("pb-4 pt-0", className)}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
