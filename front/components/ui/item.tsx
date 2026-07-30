import * as React from "react"

import { cn } from "@/lib/utils"

function Item({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "muted"
}) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 text-sm transition-colors",
        "data-[variant=default]:bg-card data-[variant=default]:ring-1 data-[variant=default]:ring-foreground/10",
        "data-[variant=muted]:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function ItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("font-medium leading-none", className)}
      {...props}
    />
  )
}

export { Item, ItemContent, ItemMedia, ItemTitle }
