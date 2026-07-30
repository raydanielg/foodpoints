"use client"

import * as React from "react"
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"

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
import { ImageUpload } from "@/components/image-upload"
import { api, imageUrl, type MenuCategory, type MenuItem } from "@/lib/api"

export default function MenuPage() {
  const [categories, setCategories] = React.useState<MenuCategory[]>([])
  const [items, setItems] = React.useState<MenuItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const loadData = () => {
    Promise.all([api.getCategories(), api.getItems()])
      .then(([catRes, itemRes]) => {
        setCategories(catRes.categories)
        setItems(itemRes.items)
      })
      .finally(() => setLoading(false))
  }

  React.useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <Spinner className="size-8 text-muted-foreground" />
        <p className="shimmer text-sm text-muted-foreground">Loading menu&hellip;</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menu Management</h2>
          <p className="text-muted-foreground">Manage your categories and menu items</p>
        </div>
      </div>

      {/* Categories section */}
      <CategorySection categories={categories} onChange={loadData} />

      {/* Items section */}
      <ItemsSection categories={categories} items={items} onChange={loadData} />
    </div>
  )
}

function CategorySection({
  categories,
  onChange,
}: {
  categories: MenuCategory[]
  onChange: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await api.updateCategory(editingId, { name })
      } else {
        await api.createCategory({ name })
      }
      setOpen(false)
      setName("")
      setEditingId(null)
      onChange()
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat: MenuCategory) => {
    setEditingId(cat.id)
    setName(cat.name)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return
    await api.deleteCategory(id)
    onChange()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize your menu into categories</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingId(null)
                    setName("")
                  }}
                >
                  <PlusIcon className="size-4" />
                  Add Category
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Category" : "New Category"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the category name"
                    : "Create a new menu category"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cat-name">Category Name</Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Drinks, Main Course"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={saving || !name}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories yet. Create one to get started.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({cat.items?.length || 0} items)
                </span>
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PencilIcon className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ItemsSection({
  categories,
  items,
  onChange,
}: {
  categories: MenuCategory[]
  items: MenuItem[]
  onChange: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    image_url: "" as string | null,
    prep_time_min: "15",
    is_available: true,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = {
        category_id: parseInt(form.category_id),
        name: form.name,
        description: form.description || null,
        price: form.price,
        image_url: form.image_url,
        prep_time_min: parseInt(form.prep_time_min),
        is_available: form.is_available,
      }
      if (editingId) {
        await api.updateItem(editingId, body)
      } else {
        await api.createItem(body)
      }
      setOpen(false)
      setEditingId(null)
      setForm({
        category_id: "",
        name: "",
        description: "",
        price: "",
        image_url: null,
        prep_time_min: "15",
        is_available: true,
      })
      onChange()
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id)
    setForm({
      category_id: String(item.category_id),
      name: item.name,
      description: item.description || "",
      price: item.price,
      image_url: item.image_url,
      prep_time_min: String(item.prep_time_min),
      is_available: item.is_available,
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return
    await api.deleteItem(id)
    onChange()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Your food and drink offerings</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingId(null)
                    setForm({
                      category_id: "",
                      name: "",
                      description: "",
                      price: "",
                      image_url: null,
                      prep_time_min: "15",
                      is_available: true,
                    })
                  }}
                >
                  <PlusIcon className="size-4" />
                  Add Item
                </Button>
              }
            />
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Item" : "New Menu Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category_id}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category_id: v ?? "" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Nyama Choma"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Optional description"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <ImageUpload
                    value={imageUrl(form.image_url)}
                    type="menu_item"
                    shape="square"
                    onChange={(url) =>
                      setForm((f) => ({ ...f, image_url: url }))
                    }
                  />
                  <div className="flex flex-1 flex-col gap-1 text-sm text-muted-foreground">
                    <span>Item Photo</span>
                    <span>Square format recommended (e.g. 400×400)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Price (TZS)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Prep Time (min)</Label>
                  <Input
                    type="number"
                    value={form.prep_time_min}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prep_time_min: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={form.is_available}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, is_available: e.target.checked }))
                    }
                    className="size-4"
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.category_id || !form.price}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No items yet. Add your first menu item.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border p-4"
              >
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl(item.image_url) ?? ""}
                    alt={item.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : null}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category?.name}
                    </p>
                  </div>
                  <Badge variant={item.is_available ? "default" : "secondary"}>
                    {item.is_available ? "Available" : "Out"}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold tabular-nums">
                    {parseFloat(item.price).toLocaleString()} TZS
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
