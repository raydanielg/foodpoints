import * as React from "react"

import { cn } from "@/lib/utils"

function Item({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "outline" | "muted"
  size?: "default" | "sm" | "xs"
}) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 text-sm transition-colors",
        "data-[variant=default]:bg-card data-[variant=default]:ring-1 data-[variant=default]:ring-foreground/10",
        "data-[variant=outline]:bg-background data-[variant=outline]:ring-1 data-[variant=outline]:ring-border",
        "data-[variant=muted]:bg-muted/50",
        "data-[size=sm]:gap-2.5 data-[size=sm]:p-2.5 data-[size=sm]:text-xs",
        "data-[size=xs]:gap-2 data-[size=xs]:p-2 data-[size=xs]:text-xs",
        className
      )}
      {...props}
    />
  )
}

function ItemGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-separator"
      className={cn("h-px w-full bg-border", className)}
      {...props}
    />
  )
}

function ItemHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("px-3 pb-2 pt-3 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "icon" | "image"
}) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden",
        "data-[variant=icon]:rounded-md data-[variant=icon]:bg-muted data-[variant=icon]:text-muted-foreground",
        "data-[variant=image]:rounded-md",
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

function ItemDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("px-3 pb-3 pt-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemFooter,
}
