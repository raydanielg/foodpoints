import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <Image
          src="/food-irradiation.png"
          alt="FoodPoint"
          width={72}
          height={72}
          className="mb-6 rounded-2xl"
          priority
        />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          FoodPoint
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
