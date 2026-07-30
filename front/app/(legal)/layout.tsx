import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

export default function LegalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/food-irradiation.png"
              alt="FoodPoint"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold tracking-tight">FoodPoint</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </header>

      {/* A4-style content */}
      <main className="flex flex-1 items-start justify-center px-4 py-8">
        <article className="w-full max-w-[800px] rounded-lg border bg-background p-8 shadow-sm sm:p-12 lg:p-16">
          {children}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FoodPoint. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
