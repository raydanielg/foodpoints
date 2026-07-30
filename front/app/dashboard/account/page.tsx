"use client"

import * as React from "react"
import {
  UserIcon,
  PhoneIcon,
  LockIcon,
  SaveIcon,
  CheckCircleIcon,
  ShieldIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/image-upload"
import { api, imageUrl, type User, type ApiError } from "@/lib/api"

export default function AccountPage() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Profile form
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    phone: "",
  })
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [profileSaved, setProfileSaved] = React.useState(false)
  const [profileError, setProfileError] = React.useState("")

  // Password form
  const [passwordForm, setPasswordForm] = React.useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  })
  const [savingPassword, setSavingPassword] = React.useState(false)
  const [passwordSaved, setPasswordSaved] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState("")

  React.useEffect(() => {
    api
      .me()
      .then((res) => {
        setUser(res.user)
        setProfileForm({
          name: res.user.name,
          phone: res.user.phone || "",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    setProfileSaved(false)
    setProfileError("")
    try {
      const res = await api.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone || undefined,
        avatar_url: user.avatar_url,
      })
      setUser(res.user)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      const apiErr = err as ApiError
      setProfileError(apiErr.message || "Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    setSavingPassword(true)
    setPasswordSaved(false)
    setPasswordError("")
    try {
      await api.changePassword({
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
      })
      setPasswordSaved(true)
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      })
      setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err) {
      const apiErr = err as ApiError
      setPasswordError(apiErr.message || "Failed to change password")
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading account&hellip;</p>
      </div>
    )
  }

  if (!user) {
    return <div className="p-6">Failed to load account.</div>
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U"

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">Manage your personal information and security</p>
      </div>

      {/* Profile summary card */}
      <Card className="rounded-xl">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="size-16 rounded-xl">
            {user.avatar_url && (
              <AvatarImage src={imageUrl(user.avatar_url) ?? undefined} alt={user.name} />
            )}
            <AvatarFallback className="rounded-xl text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.phone}</span>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
              {user.restaurant && (
                <Badge variant="secondary">{user.restaurant.name}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldIcon className="size-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <ImageUpload
                  value={imageUrl(user.avatar_url)}
                  type="avatar"
                  shape="circle"
                  onChange={(url) =>
                    setUser({ ...user, avatar_url: url })
                  }
                />
                <div className="flex flex-1 flex-col gap-1 text-sm text-muted-foreground">
                  <span>Profile Photo</span>
                  <span>Click to upload or drag and drop</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  <UserIcon className="mr-1 inline size-3.5" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                  <PhoneIcon className="mr-1 inline size-3.5" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="2557XXXXXXXX"
                  pattern="^255\d{9}$"
                />
              </div>

              {profileError && (
                <p className="text-sm text-destructive">{profileError}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !profileForm.name || !profileForm.phone}
                >
                  {savingProfile ? (
                    <Spinner className="size-4" />
                  ) : (
                    <SaveIcon className="size-4" />
                  )}
                  Save Changes
                </Button>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircleIcon className="size-4" />
                    Saved successfully!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="current_password">
                  <LockIcon className="mr-1 inline size-3.5" />
                  Current Password
                </Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      current_password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      password_confirmation: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </div>

              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    savingPassword ||
                    !passwordForm.current_password ||
                    !passwordForm.password ||
                    passwordForm.password !== passwordForm.password_confirmation
                  }
                >
                  {savingPassword ? (
                    <Spinner className="size-4" />
                  ) : (
                    <ShieldIcon className="size-4" />
                  )}
                  Update Password
                </Button>
                {passwordSaved && (
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircleIcon className="size-4" />
                    Password updated!
                  </span>
                )}
              </div>

              {passwordForm.password &&
                passwordForm.password !== passwordForm.password_confirmation && (
                  <p className="text-sm text-amber-600">
                    Passwords do not match.
                  </p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
