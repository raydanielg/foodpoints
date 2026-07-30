import Link from "next/link"
import Image from "next/image"
import {
  BadgeCheckIcon,
  StoreIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  WalletIcon,
  BarChart3Icon,
  ChefHatIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  FileTextIcon,
  MailIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemGroup,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemActions,
  ItemSeparator,
} from "@/components/ui/item"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const benefits = [
  {
    icon: StoreIcon,
    title: "Own Your Restaurant",
    desc: "Create and manage your restaurant profile. Upload your logo, cover image, and set up your brand identity.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Get Verified",
    desc: "Verified restaurants earn a trust badge that shows customers you're a legitimate, approved business.",
  },
  {
    icon: QrCodeIcon,
    title: "QR Code Ordering",
    desc: "Generate unique QR codes for each table. Customers scan and order instantly — no app needed.",
  },
  {
    icon: WalletIcon,
    title: "Split Payments",
    desc: "Let customers split bills easily. Automatic VAT calculation and multiple payment methods supported.",
  },
  {
    icon: ChefHatIcon,
    title: "Kitchen Display",
    desc: "Real-time kitchen display system. Orders flow directly to your kitchen staff with prep time tracking.",
  },
  {
    icon: BarChart3Icon,
    title: "Analytics & Insights",
    desc: "Track revenue, top sellers, and daily performance with beautiful, easy-to-read charts.",
  },
]

const verificationSteps = [
  {
    num: "01",
    icon: ClipboardListIcon,
    title: "Create Your Account",
    desc: "Sign up with your email and fill in your restaurant details including name, address, and phone number.",
  },
  {
    num: "02",
    icon: FileTextIcon,
    title: "Submit Documents",
    desc: "Upload your business license and any required permits. Our team reviews them within 24-48 hours.",
  },
  {
    num: "03",
    icon: ShieldCheckIcon,
    title: "Get Reviewed",
    desc: "Our verification team checks your documents and restaurant information to ensure everything is legitimate.",
  },
  {
    num: "04",
    icon: BadgeCheckIcon,
    title: "Receive Verification",
    desc: "Once approved, you'll receive a verified badge on your profile. Customers can trust your restaurant.",
  },
]

const requirements = [
  {
    title: "Business License",
    desc: "A valid restaurant or food service business license from your local authority.",
  },
  {
    title: "Food Safety Certificate",
    desc: "Current food handling and safety certification for your establishment.",
  },
  {
    title: "Valid ID",
    desc: "Government-issued identification of the restaurant owner or authorized manager.",
  },
  {
    title: "Restaurant Photos",
    desc: "Clear photos of your restaurant interior, exterior, and sample menu items.",
  },
]

const faqs = [
  {
    q: "How long does verification take?",
    a: "Verification typically takes 24-48 hours after you submit all required documents. You'll receive an email notification once your restaurant is approved.",
  },
  {
    q: "What if my verification is rejected?",
    a: "If your verification is rejected, we'll email you with the reason. You can fix the issues and resubmit your application at any time at no cost.",
  },
  {
    q: "Do I need to pay for verification?",
    a: "No. Verification is completely free for all FoodPoint restaurant managers. There are no hidden fees or charges.",
  },
  {
    q: "Can I start using FoodPoint before verification?",
    a: "Yes! You can set up your menu, generate QR codes, and start accepting orders immediately. The verified badge is added once your documents are approved.",
  },
  {
    q: "What does the verified badge do?",
    a: "The verified badge appears on your restaurant profile, customer-facing menu page, and receipts. It builds trust with customers and shows you're a legitimate business.",
  },
  {
    q: "How do I maintain my verified status?",
    a: "Keep your documents up to date. If your business license or food safety certificate expires, you'll need to upload renewed versions to maintain your verified badge.",
  },
]

export default function BecomeManagerPage() {
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
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
              <BadgeCheckIcon className="size-4 text-primary" />
              <span className="font-medium text-muted-foreground">Restaurant Manager Program</span>
            </div>
            <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Become a manager.{" "}
              <span className="text-primary">Own</span> your restaurant.{" "}
              <span className="text-primary">Get verified</span>.
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Join FoodPoint as a restaurant manager. Set up your menu, generate
              QR codes for your tables, and get verified to build trust with
              your customers.
            </p>
            <div className="flex flex-row gap-3">
              <Link href="/login">
                <Button size="lg" className="flex-1 sm:flex-none">
                  Get Started
                  <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#verification">
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                  How to Get Verified
                </Button>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-primary" />
                Free to join
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-primary" />
                Verified in 48 hours
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-primary" />
                No hidden fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Benefits ===== */}
      <section id="benefits" className="border-t py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you get as a manager
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful tools to run your restaurant efficiently and give your
              customers a seamless ordering experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Item
                key={benefit.title}
                variant="outline"
                className="group flex-col items-start gap-3 p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <ItemMedia
                  variant="icon"
                  className="size-11 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <benefit.icon className="size-5" />
                </ItemMedia>
                <ItemContent className="gap-1.5">
                  <ItemTitle className="text-base font-semibold">{benefit.title}</ItemTitle>
                  <ItemDescription className="text-sm leading-relaxed">{benefit.desc}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Verification Steps ===== */}
      <section id="verification" className="border-t bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <ShieldCheckIcon className="size-4" />
              Verification Process
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              How to get verified
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Four simple steps to earn your verified badge and build trust with
              customers.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            {/* Progress line */}
            <div className="absolute left-5 top-8 h-[calc(100%-4rem)] w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-8">
              {verificationSteps.map((step, i) => (
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
                      <ItemMedia
                        variant="icon"
                        className={`size-9 rounded-lg bg-primary/10 text-primary ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                      >
                        <step.icon className="size-4" />
                      </ItemMedia>
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

      {/* ===== Requirements ===== */}
      <section id="requirements" className="border-t py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <FileTextIcon className="size-4" />
              What You Need
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Verification requirements
            </h2>
            <p className="text-lg text-muted-foreground">
              Prepare these documents to get verified quickly.
            </p>
          </div>

          <ItemGroup>
            {requirements.map((req, i) => (
              <div key={req.title}>
                <Item variant="outline" className="p-4">
                  <ItemMedia
                    variant="icon"
                    className="size-10 rounded-lg bg-primary/10 text-primary"
                  >
                    <CheckCircle2Icon className="size-5" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle className="text-sm font-semibold">{req.title}</ItemTitle>
                    <ItemDescription className="text-sm">{req.desc}</ItemDescription>
                  </ItemContent>
                </Item>
                {i < requirements.length - 1 && <ItemSeparator className="my-0" />}
              </div>
            ))}
          </ItemGroup>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="size-4 text-primary" />
            <span>Average review time: 24-48 hours</span>
          </div>
        </div>
      </section>

      {/* ===== Verified Badge Highlight ===== */}
      <section className="border-t bg-gradient-to-br from-primary to-primary/80 py-16 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 lg:px-8 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <BadgeCheckIcon className="size-4" />
              Trust Badge
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The verified badge builds customer trust
            </h2>
            <p className="mb-8 max-w-lg text-lg text-white/80">
              When customers see the verified badge on your restaurant profile,
              they know you're a legitimate, approved business. This leads to
              more orders, better reviews, and repeat customers.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <StarIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">More Orders</p>
                  <p className="text-sm text-white/70">Trust drives sales</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <ShieldCheckIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Customer Confidence</p>
                  <p className="text-sm text-white/70">Verified = trusted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <MailIcon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Email Notification</p>
                  <p className="text-sm text-white/70">Instant approval alert</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col items-center gap-6">
            <div className="flex size-32 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
              <BadgeCheckIcon className="size-16 text-white" />
            </div>
            <div className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur">
              <p className="text-lg font-bold text-white">Verified Restaurant</p>
              <p className="mt-1 text-sm text-white/70">
                This badge appears on your profile, menu page, and receipts.
              </p>
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
              Everything you need to know about becoming a verified restaurant manager.
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
            Ready to become a restaurant manager?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Create your account today, set up your restaurant, and start the
            verification process. It's free and takes just minutes.
          </p>
          <div className="flex flex-row gap-3 sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="flex-1 sm:flex-none">
                Get Started
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                Back to Home
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
              <p className="mb-3 text-sm font-semibold">Program</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a></li>
                <li><a href="#verification" className="hover:text-foreground transition-colors">Verification</a></li>
                <li><a href="#requirements" className="hover:text-foreground transition-colors">Requirements</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Get Started</p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Create Account</Link></li>
                <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
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
