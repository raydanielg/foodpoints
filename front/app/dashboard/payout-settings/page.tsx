"use client"

import * as React from "react"
import { SmartphoneIcon, BuildingIcon, UserIcon, SaveIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { api, type PayoutSettings } from "@/lib/api"
import { toast } from "@/components/ui/toast"

export default function PayoutSettingsPage() {
  const [settings, setSettings] = React.useState<PayoutSettings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [channel, setChannel] = React.useState<"mobile" | "bank">("mobile")
  const [phone, setPhone] = React.useState("")
  const [bank, setBank] = React.useState("")
  const [account, setAccount] = React.useState("")
  const [recipientName, setRecipientName] = React.useState("")

  React.useEffect(() => {
    api
      .getPayoutSettings()
      .then((res) => {
        const p = res.payout
        setSettings(p)
        setChannel(p.payout_channel || "mobile")
        setPhone(p.payout_phone || "")
        setBank(p.payout_bank || "")
        setAccount(p.payout_bank_account || "")
        setRecipientName(p.payout_recipient_name || "")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!recipientName.trim()) {
      toast.add({ title: "Recipient name required", type: "error" })
      return
    }

    if (channel === "mobile" && !phone.trim()) {
      toast.add({ title: "Phone number required", description: "Please enter your mobile money phone number.", type: "error" })
      return
    }

    if (channel === "bank" && (!bank.trim() || !account.trim())) {
      toast.add({ title: "Bank details required", description: "Please enter your bank name and account number.", type: "error" })
      return
    }

    setSaving(true)
    try {
      const res = await api.updatePayoutSettings({
        payout_channel: channel,
        payout_phone: phone,
        payout_bank: bank,
        payout_bank_account: account,
        payout_recipient_name: recipientName,
      })
      toast.add({ title: "Settings saved", description: res.message, type: "success" })
    } catch (err: any) {
      toast.add({ title: "Failed to save", description: err?.message || "Something went wrong", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading payout settings&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:gap-6 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payout Settings</h2>
        <p className="text-muted-foreground">Configure where your withdrawal funds will be sent</p>
      </div>

      {/* Channel Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
          <CardDescription>Choose how you want to receive your withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setChannel("mobile")}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                channel === "mobile"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <span className={cn(
                "flex size-12 items-center justify-center rounded-xl",
                channel === "mobile" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
              )}>
                <SmartphoneIcon className="size-6" />
              </span>
              <div className="text-center">
                <p className="font-semibold text-sm">Mobile Money</p>
                <p className="text-xs text-muted-foreground mt-0.5">M-Pesa, Tigo Pesa, Airtel Money, Halopesa</p>
              </div>
            </button>

            <button
              onClick={() => setChannel("bank")}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                channel === "bank"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <span className={cn(
                "flex size-12 items-center justify-center rounded-xl",
                channel === "bank" ? "bg-blue-500/15 text-blue-600" : "bg-muted text-muted-foreground"
              )}>
                <BuildingIcon className="size-6" />
              </span>
              <div className="text-center">
                <p className="font-semibold text-sm">Bank Transfer</p>
                <p className="text-xs text-muted-foreground mt-0.5">Direct transfer to your bank account</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Details</CardTitle>
          <CardDescription>
            {channel === "mobile"
              ? "Enter your mobile money number and recipient name"
              : "Enter your bank account details and recipient name"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recipient Name */}
          <div className="space-y-2">
            <Label htmlFor="recipientName" className="flex items-center gap-2">
              <UserIcon className="size-3.5" />
              Recipient Name
            </Label>
            <Input
              id="recipientName"
              placeholder="e.g. John Doe"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">The name registered on the account</p>
          </div>

          {/* Mobile Money Fields */}
          {channel === "mobile" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Money Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0712 345 678 or 255712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number registered with your mobile money account
              </p>
            </div>
          )}

          {/* Bank Fields */}
          {channel === "bank" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Name</Label>
                <Input
                  id="bank"
                  placeholder="e.g. CRDB Bank, NMB Bank, NBC"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  placeholder="e.g. 0151234567890"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your full bank account number
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Spinner className="size-4" /> : <SaveIcon className="size-4" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 shrink-0">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Secure & Encrypted</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your payout details are encrypted and securely stored. Funds are only sent to the
              account you configure here. Always verify your details before requesting a withdrawal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
