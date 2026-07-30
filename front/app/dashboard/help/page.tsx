"use client"

import * as React from "react"
import {
  LifeBuoyIcon,
  ChevronDownIcon,
  MailIcon,
  PhoneIcon,
  MessageSquareIcon,
  SendIcon,
  CheckCircleIcon,
  BookIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { api, type User } from "@/lib/api"

const faqs = [
  {
    question: "How do I generate QR codes for my tables?",
    answer:
      "Go to Tables & QR in the sidebar. Each table automatically gets a unique QR code. You can click the QR icon to view and print it. Customers scan the QR code with their phone camera to access your menu and place orders.",
  },
  {
    question: "How do I add or edit menu items?",
    answer:
      "Navigate to Menu in the sidebar. First create categories (e.g., Starters, Main Course), then add menu items under each category. You can set the price, description, preparation time, and availability for each item.",
  },
  {
    question: "How do payments work?",
    answer:
      "Customers can pay using mobile money, card, or cash. For mobile money and card payments, the transaction is processed automatically. For cash payments, staff need to confirm the payment from the Payments page.",
  },
  {
    question: "Can I split a bill between multiple customers?",
    answer:
      "Yes! The checkout page supports four split types: full payment, pay by specific items, equal split, and custom amount. Customers choose their preferred method when paying.",
  },
  {
    question: "How do I manage my staff?",
    answer:
      "Go to Staff in the sidebar under Management. You can add team members with roles like Manager, Waiter, or Kitchen staff. Each role has different access levels within the system.",
  },
  {
    question: "How do I view my restaurant's performance?",
    answer:
      "The Dashboard page shows your today/week/month revenue, active sessions, total orders, top-selling items, and a revenue chart. You can use this data to track your restaurant's performance over time.",
  },
]

export default function HelpPage() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  const [contactForm, setContactForm] = React.useState({
    subject: "",
    message: "",
  })
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  React.useEffect(() => {
    api
      .me()
      .then((res) => setUser(res.user))
      .finally(() => setLoading(false))
  }, [])

  const handleSend = async () => {
    if (!contactForm.subject || !contactForm.message) return
    setSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSent(true)
      setContactForm({ subject: "", message: "" })
      setTimeout(() => setSent(false), 3000)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading help&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 max-w-3xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MailIcon className="size-5" />
            </div>
            <span className="text-sm font-medium">Email Support</span>
            <span className="text-xs text-muted-foreground">
              support@foodpoints.app
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PhoneIcon className="size-5" />
            </div>
            <span className="text-sm font-medium">Phone Support</span>
            <span className="text-xs text-muted-foreground">
              +255 700 000 000
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquareIcon className="size-5" />
            </div>
            <span className="text-sm font-medium">Live Chat</span>
            <span className="text-xs text-muted-foreground">
              Available 9am - 6pm
            </span>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookIcon className="size-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Quick answers to the most common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <Collapsible
              key={i}
              open={openFaq === i}
              onOpenChange={(open) => setOpenFaq(open ? i : null)}
            >
              <div className="rounded-lg border">
                <CollapsibleTrigger
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <span className="text-sm font-medium">{faq.question}</span>
                  <ChevronDownIcon
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-3">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* Contact form */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LifeBuoyIcon className="size-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Can&apos;t find what you&apos;re looking for? Send us a message.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={contactForm.subject}
              onChange={(e) =>
                setContactForm((f) => ({ ...f, subject: e.target.value }))
              }
              placeholder="What do you need help with?"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={contactForm.message}
              onChange={(e) =>
                setContactForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Describe your issue in detail..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSend}
              disabled={sending || !contactForm.subject || !contactForm.message}
            >
              {sending ? (
                <Spinner className="size-4" />
              ) : (
                <SendIcon className="size-4" />
              )}
              Send Message
            </Button>
            {sent && (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircleIcon className="size-4" />
                Message sent! We&apos;ll get back to you soon.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Additional guides and documentation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Getting Started Guide</span>
            </div>
            <ExternalLinkIcon className="size-4 text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Menu Management Guide</span>
            </div>
            <ExternalLinkIcon className="size-4 text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Payment Setup Guide</span>
            </div>
            <ExternalLinkIcon className="size-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
