"use client"

import * as React from "react"
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, imageUrl, type User } from "@/lib/api"

export default function StaffPage() {
  const [staff, setStaff] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [open, setOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    password: "",
    role: "waiter" as "manager" | "waiter" | "kitchen",
  })

  const load = () => {
    api.getStaff().then((res) => setStaff(res.staff)).finally(() => setLoading(false))
  }

  React.useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        role: form.role,
      }
      if (form.password) body.password = form.password
      if (editingId) {
        await api.updateStaff(editingId, body as Partial<User> & { password?: string })
      } else {
        await api.createStaff({
          name: form.name,
          phone: form.phone || "",
          password: form.password,
          role: form.role,
        })
      }
      setOpen(false)
      setEditingId(null)
      setForm({ name: "", phone: "", password: "", role: "waiter" })
      load()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (s: User) => {
    setEditingId(s.id)
    setForm({
      name: s.name,
      phone: s.phone || "",
      password: "",
      role: s.role as "manager" | "waiter" | "kitchen",
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this staff member?")) return
    await api.deleteStaff(id)
    load()
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading staff&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
          <p className="text-muted-foreground">Manage your team members and roles</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null)
                  setForm({ name: "", phone: "", password: "", role: "waiter" })
                }}
              >
                <PlusIcon className="size-4" />
                Add Staff
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Staff" : "New Staff Member"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update staff details" : "Add a new team member"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="2557XXXXXXXX"
                  pattern="^255\d{9}$"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: (v ?? "waiter") as "manager" | "waiter" | "kitchen" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="waiter">Waiter</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{editingId ? "New Password (leave blank to keep)" : "Password"}</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required={!editingId}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.phone}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {staff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No staff members yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {s.avatar_url && (
                      <AvatarImage src={imageUrl(s.avatar_url) ?? undefined} alt={s.name} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <span className="font-bold">{s.name.charAt(0).toUpperCase()}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{s.role}</Badge>
                  <button onClick={() => handleEdit(s)} className="text-muted-foreground hover:text-foreground">
                    <PencilIcon className="size-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive">
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
