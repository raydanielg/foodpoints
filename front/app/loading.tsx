import Link from "next/link"
import Image from "next/image"

import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Image
          src="/food-irradiation.png"
          alt="FoodPoint"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-xl font-bold tracking-tight">FoodPoint</span>
      </Link>

      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-10 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
