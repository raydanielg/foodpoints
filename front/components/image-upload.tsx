"use client"

import * as React from "react"
import { CameraIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  type?: "logo" | "cover" | "avatar" | "menu_item"
  className?: string
  shape?: "circle" | "square" | "wide"
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  type = "logo",
  className,
  shape = "square",
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    setProgress(0)
    setError("")
    try {
      const res = await api.uploadImageWithProgress(file, type, setProgress)
      onChange(res.url)
    } catch {
      setError("Upload failed. Try again.")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "wide"
        ? "rounded-lg"
        : "rounded-xl"

  const sizeClass =
    shape === "circle" ? "size-20" : shape === "wide" ? "w-full aspect-[3/1]" : "size-24"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className={cn("relative", shapeClass, sizeClass)}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex size-full items-center justify-center overflow-hidden border border-input bg-muted/40 transition-colors hover:bg-muted/70",
            shapeClass
          )}
        >
          {uploading ? (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-muted/60">
              <div className="flex w-3/4 flex-col gap-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-center text-[10px] font-medium tabular-nums text-muted-foreground">
                  {progress}%
                </span>
              </div>
            </div>
          ) : value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="Upload" className="size-full object-cover" />
          ) : (
            <CameraIcon className="size-5 text-muted-foreground" />
          )}
        </button>

        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            className={cn(
              "absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm hover:bg-destructive/90",
              shape === "circle" && "right-0 top-0"
            )}
          >
            <XIcon className="size-3" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
