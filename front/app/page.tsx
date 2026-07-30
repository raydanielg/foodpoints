import Link from "next/link"
import { HotelIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary">
          <HotelIcon className="size-8 text-primary-foreground" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Restaurant Management System
        </h1>
        <p className="mb-8 text-muted-foreground">
          QR-based ordering, split payments, kitchen display, and full
          management panels for your restaurant.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
