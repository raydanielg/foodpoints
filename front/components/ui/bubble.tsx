import * as React from "react"

import { cn } from "@/lib/utils"

function Bubble({
  variant = "default",
  align = "start",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"
  align?: "start" | "end"
}) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "flex w-full",
        "data-[align=end]:justify-end",
        className
      )}
      {...props}
    >
      <div
        data-slot="bubble-inner"
        data-variant={variant}
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          "data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground",
          "data-[variant=secondary]:bg-muted data-[variant=secondary]:text-foreground",
          "data-[variant=muted]:bg-muted/50 data-[variant=muted]:text-muted-foreground",
          "data-[variant=tinted]:bg-primary/10 data-[variant=tinted]:text-foreground",
          "data-[variant=outline]:border data-[variant=outline]:text-foreground",
          "data-[variant=ghost]:text-foreground",
          "data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-white",
          "data-[align=end]:rounded-br-sm",
          "data-[align=start]:rounded-bl-sm"
        )}
      >
        {children}
      </div>
    </div>
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & {
  render?: React.ReactElement
}) {
  if (render) {
    return React.cloneElement(render as React.ReactElement<Record<string, unknown>>, {
      "data-slot": "bubble-content",
      className: cn(
        "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      ),
      ...props,
    })
  }
  return (
    <div
      data-slot="bubble-content"
      className={cn(
        "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  )
}

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "bottom"
  align?: "start" | "end"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-side={side}
      data-align={align}
      className={cn(
        "flex items-center gap-1 text-xs",
        "data-[side=top]:-mt-2 data-[side=bottom]:-mt-2",
        "data-[align=end]:ml-auto",
        className
      )}
      {...props}
    />
  )
}

function BubbleGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

export { Bubble, BubbleContent, BubbleReactions, BubbleGroup }
