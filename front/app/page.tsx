import Link from "next/link"
import Image from "next/image"
import {
  QrCodeIcon,
  WalletIcon,
  UtensilsCrossedIcon,
  SmartphoneIcon,
  MenuIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroVideo } from "@/components/hero-video"
import { ShowcaseSection } from "@/components/showcase-section"
import { FeatureGrid } from "@/components/feature-grid"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const steps = [
  {
    num: "01",
    title: "Set Up Your Restaurant",
    desc: "Create your account, add your restaurant details, upload your logo and menu items with photos.",
  },
  {
    num: "02",
    title: "Generate QR Codes",
    desc: "Print QR codes for each table. Customers scan to view your menu and place orders instantly.",
  },
  {
    num: "03",
    title: "Manage Orders in Real-Time",
    desc: "Orders flow to your kitchen display. Track preparation, serve customers, and process payments.",
  },
]

const menuItems = [
  {
    name: "Gourmet Burgers",
    desc: "Juicy, flame-grilled burgers with fresh ingredients",
    image: "/images/56.jpg",
    price: "From 12,000 TZS",
  },
  {
    name: "Fine Dining",
    desc: "Elegant dishes prepared by expert chefs",
    image: "/images/58 (1).jpg",
    price: "From 25,000 TZS",
  },
  {
    name: "Restaurant Ambiance",
    desc: "Beautiful dining spaces for every occasion",
    image: "/images/3394.jpg",
    price: "Reserve a table",
  },
  {
    name: "Signature Dishes",
    desc: "Chef's special creations with local flavors",
    image: "/images/6342.jpg",
    price: "From 18,000 TZS",
  },
  {
    name: "Premium Experience",
    desc: "Top-tier service and culinary excellence",
    image: "/images/19743.jpg",
    price: "From 30,000 TZS",
  },
]

const faqs = [
  {
    q: "How does FoodPoint work?",
    a: "FoodPoint is a complete restaurant management platform. You set up your menu, generate QR codes for tables, and customers scan to order. Orders go straight to your kitchen display, and you track everything from your dashboard.",
  },
  {
    q: "Do customers need to download an app?",
    a: "No. Customers simply scan the QR code on their table with their phone camera. The menu opens in their browser — no app or registration required.",
  },
  {
    q: "Can I customize my menu with photos?",
    a: "Yes! You can upload photos for every menu item, organize items into categories, set prices, and mark items as available or out of stock — all from your dashboard.",
  },
  {
    q: "Does it support split payments?",
    a: "Absolutely. Customers can split bills among multiple people. The system automatically calculates VAT and handles multiple payment methods.",
  },
  {
    q: "Is there a kitchen display system?",
    a: "Yes. Orders are sent to a real-time kitchen display where your kitchen staff can track preparation status, prep times, and order priorities.",
  },
  {
    q: "What devices does it work on?",
    a: "FoodPoint works on any device with a browser. The customer ordering page is optimized for mobile phones, and the management dashboard works on both desktop and tablet.",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/food-irradiation.png"
              alt="FoodPoint"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <span className="text-xl font-bold tracking-tight">FoodPoint</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#menu" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Menu</a>
            <Link href="/become-manager" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Become a Manager</Link>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <details className="relative md:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border">
              <MenuIcon className="size-5" />
            </summary>
            <div className="absolute right-0 top-12 w-56 rounded-xl border bg-background p-4 shadow-lg">
              <nav className="flex flex-col gap-3">
                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">How it Works</a>
                <a href="#menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">Menu</a>
                <Link href="/become-manager" className="text-sm font-medium text-muted-foreground hover:text-foreground">Become a Manager</Link>
                <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">FAQ</a>
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          </details>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
              <span className="flex size-2 rounded-full bg-primary" />
              <span className="font-medium text-muted-foreground">All-in-one restaurant platform</span>
            </div>
            <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Run your restaurant{" "}
              <span className="text-primary">smarter</span> with FoodPoint
            </h1>
            <p className="mb-8 max-w-xl text-lg text-muted-foreground">
              QR-based ordering, split payments, kitchen display, and powerful
              management dashboards — everything you need in one platform.
            </p>
            <div className="flex flex-row gap-3">
              <Link href="/login">
                <Button size="lg" className="flex-1 sm:flex-none">
                  Get Started Free
                  <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                  See How it Works
                </Button>
              </a>
            </div>
          </div>

          {/* Hero video */}
          <HeroVideo />
        </div>
      </section>

      {/* ===== Trust badges ===== */}
      <section className="border-t bg-muted/30 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm text-muted-foreground lg:px-8">
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-primary" />
            No app required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-primary" />
            Works on any phone
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-primary" />
            Setup in minutes
          </span>
        </div>
      </section>

      {/* ===== Showcase ===== */}
      <ShowcaseSection />

      {/* ===== Features ===== */}
      <section id="features" className="border-t py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run your restaurant
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From ordering to kitchen to payments — FoodPoint handles it all
              with a beautiful, easy-to-use interface.
            </p>
          </div>

          <FeatureGrid />
        </div>
      </section>

      {/* ===== How it Works ===== */}
      <section id="how-it-works" className="border-t bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get your restaurant online in three simple steps.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            {/* Progress line */}
            <div className="absolute left-5 top-8 h-[calc(100%-4rem)] w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`relative flex items-start gap-6 md:items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Step circle */}
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg ring-4 ring-background transition-transform hover:scale-110 md:mx-auto">
                    {step.num}
                  </div>

                  {/* Step content */}
                  <div className={`flex-1 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                    <Item
                      variant="outline"
                      className={`flex-col items-start gap-2 p-4 ${i % 2 === 1 ? "md:items-end" : ""}`}
                    >
                      <ItemContent className="gap-1.5">
                        <ItemTitle className="text-base font-semibold">{step.title}</ItemTitle>
                        <ItemDescription className="text-sm leading-relaxed">{step.desc}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Menu Showcase ===== */}
      <section id="menu" className="border-t py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Showcase your menu beautifully
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Upload photos for every dish. Customers see what they're ordering,
              leading to more orders and less confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="group overflow-hidden rounded-2xl border transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-sm font-medium text-white/90">{item.price}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Mobile Banner ===== */}
      <section className="border-t bg-gradient-to-br from-primary to-primary/80 py-16 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 lg:px-8 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <SmartphoneIcon className="size-4" />
              Mobile ordering
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your customers order from their phones
            </h2>
            <p className="mb-8 max-w-lg text-lg text-white/80">
              No app downloads. No registrations. Customers just scan the QR code
              on their table and your menu appears instantly on their phone.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <QrCodeIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Scan QR Code</p>
                  <p className="text-sm text-white/70">On the table</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <UtensilsCrossedIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Browse Menu</p>
                  <p className="text-sm text-white/70">With photos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <WalletIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Pay Easily</p>
                  <p className="text-sm text-white/70">Split or single</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-sm">
            <div className="overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl">
              <Image
                src="/images/6342.jpg"
                alt="Mobile ordering experience"
                width={400}
                height={600}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-t py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about FoodPoint.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 flex justify-center">
            <Image
              src="/food-irradiation.png"
              alt="FoodPoint"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your restaurant?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join FoodPoint today and give your customers a modern ordering experience.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg">
                Get Started
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
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
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                The all-in-one restaurant management platform. QR ordering,
                kitchen display, split payments, and analytics.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Product</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#menu" className="hover:text-foreground transition-colors">Menu Showcase</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Get Started</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Create Account</Link></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Learn More</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FoodPoint. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <StarIcon className="size-4 fill-primary text-primary" />
              <span>Built for restaurants in Tanzania</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
