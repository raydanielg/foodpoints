"use client"

import * as React from "react"
import { QRCodeSVG } from "qrcode.react"
import { CheckIcon, XIcon, RefreshCwIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type QrState = "default" | "loading" | "scanned" | "expired"

interface QrCodeProps {
  value: string
  state?: QrState
  onRefresh?: () => void
  className?: string
  size?: number
}

function QrCode({
  value,
  state = "default",
  onRefresh,
  className,
  size = 192,
}: QrCodeProps) {
  return (
    <div className={cn("relative", className)}>
      {state !== "default" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/95">
          {state === "loading" && (
            <>
              <Spinner className="size-8 text-muted-foreground" />
              <span className="sr-only">Loading...</span>
            </>
          )}
          {state === "scanned" && (
            <>
              <CheckIcon className="size-6 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Scanned</span>
            </>
          )}
          {state === "expired" && (
            <>
              <XIcon className="size-6 text-red-500" />
              <span className="text-sm font-medium text-foreground">QR code expired</span>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <RefreshCwIcon className="size-4" />
                  Refresh
                </button>
              )}
            </>
          )}
        </div>
      )}
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed p-4"
        style={{ width: size, height: size }}
      >
        <QRCodeSVG
          value={value}
          size={size - 32}
          level="M"
          className="text-foreground"
        />
      </div>
    </div>
  )
}

interface QrCodeWithCopyProps {
  value: string
  className?: string
  size?: number
}

function QrCodeWithCopy({ value, className, size = 192 }: QrCodeWithCopyProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("flex w-full flex-col items-center justify-center gap-4", className)}>
      <QrCode value={value} size={size} />
      <div className="w-full max-w-[18rem]">
        <div className="relative">
          <label htmlFor="qr-copy-input" className="sr-only">
            QR URL
          </label>
          <input
            id="qr-copy-input"
            type="text"
            className="w-full rounded-md border bg-muted px-3 py-2.5 pr-10 text-sm text-muted-foreground shadow-xs"
            value={value}
            disabled
            readOnly
          />
          <button
            onClick={handleCopy}
            className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted-foreground/10"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="size-4 text-emerald-500" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { QrCode, QrCodeWithCopy, type QrState }
