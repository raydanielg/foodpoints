function getApiUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl) return envUrl
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8001/api`
  }
  return "http://localhost:8001/api"
}

function getBackendOrigin() {
  const api = getApiUrl()
  return api.replace(/\/api$/, "")
}

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return getBackendOrigin() + path
}

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: "super_admin" | "owner" | "manager" | "waiter" | "kitchen"
  restaurant_id: number | null
  restaurant?: Restaurant
}

export interface Restaurant {
  id: number
  name: string
  logo_url: string | null
  cover_url: string | null
  address: string | null
  phone: string | null
  currency: string
  vat_percent: string
  subscription_status: string
}

export interface MenuCategory {
  id: number
  restaurant_id: number
  name: string
  sort_order: number
  items?: MenuItem[]
}

export interface MenuItem {
  id: number
  restaurant_id: number
  category_id: number
  name: string
  description: string | null
  price: string
  image_url: string | null
  prep_time_min: number
  is_available: boolean
  category?: MenuCategory
}

export interface RestaurantTable {
  id: number
  restaurant_id: number
  table_number: string
  qr_token: string
  status: "free" | "occupied"
}

export interface TableSession {
  id: number
  restaurant_id: number
  table_id: number
  status: "open" | "closed"
  total_amount: string
  paid_amount: string
  opened_at: string
  closed_at: string | null
  table?: RestaurantTable
  orders?: Order[]
  payments?: Payment[]
}

export interface Order {
  id: number
  session_id: number
  restaurant_id: number
  placed_by: "customer" | "waiter"
  status: "received" | "preparing" | "ready" | "served"
  created_at: string
  items?: OrderItem[]
  session?: TableSession
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: string
  notes: string | null
  served: boolean
  paid: boolean
  paid_by_label: string | null
  menu_item?: MenuItem
}

export interface Payment {
  id: number
  session_id: number
  restaurant_id: number
  amount: string
  method: "mobile_money" | "card" | "cash"
  split_type: "full" | "by_item" | "equal" | "by_amount"
  payer_label: string | null
  status: "pending" | "completed" | "failed"
  transaction_ref: string | null
  item_ids: number[] | null
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface RestaurantStats {
  today_revenue: string
  week_revenue: string
  month_revenue: string
  active_sessions: number
  total_orders_today: number
  top_sellers: { name: string; total_sold: number; revenue: string }[]
  recent_orders: {
    id: number
    status: string
    created_at: string
    table_number: string
  }[]
  daily_revenue: { date: string; revenue: string; payments_count: number }[]
  orders_by_status: Record<string, number>
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    const error: ApiError = {
      message: data.message || "Something went wrong",
      errors: data.errors,
    }
    throw error
  }

  return data as T
}

export const api = {
  // ===== Auth =====
  register: (body: {
    name: string
    email: string
    password: string
    password_confirmation: string
    restaurant_name: string
    phone?: string
  }) =>
    apiRequest<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    apiRequest<{ message: string }>("/logout", { method: "POST" }),

  me: () => apiRequest<{ user: User }>("/me"),
  updateProfile: (body: { name?: string; email?: string; phone?: string | null; avatar_url?: string | null }) =>
    apiRequest<{ user: User }>("/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  changePassword: (body: { current_password: string; password: string; password_confirmation: string }) =>
    apiRequest<{ message: string }>("/profile/password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  updateSubscription: (body: { subscription_status: "active" | "suspended" | "pending" }) =>
    apiRequest<{ restaurant: Restaurant }>("/restaurant/subscription", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  // ===== Restaurant =====
  getRestaurant: () =>
    apiRequest<{ restaurant: Restaurant }>("/restaurant"),
  updateRestaurant: (body: Partial<Restaurant>) =>
    apiRequest<{ restaurant: Restaurant }>("/restaurant", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  uploadImage: (file: File, type?: "logo" | "cover" | "avatar" | "menu_item") =>
    apiRequest<{ url: string; path: string }>("/upload", {
      method: "POST",
      body: (() => {
        const formData = new FormData()
        formData.append("file", file)
        if (type) formData.append("type", type)
        return formData
      })(),
    }).then((res) => ({ ...res, url: imageUrl(res.url) ?? "" })),
  uploadImageWithProgress: (
    file: File,
    type?: "logo" | "cover" | "avatar" | "menu_item",
    onProgress?: (percent: number) => void
  ) =>
    new Promise<{ url: string; path: string }>((resolve, reject) => {
      const formData = new FormData()
      formData.append("file", file)
      if (type) formData.append("type", type)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", `${getApiUrl()}/upload`)

      const token = getToken()
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.setRequestHeader("Accept", "application/json")

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ ...data, url: imageUrl(data.url) ?? "" })
          } else {
            reject({ message: data.message || "Upload failed" })
          }
        } catch {
          reject({ message: "Upload failed" })
        }
      }

      xhr.onerror = () => reject({ message: "Upload failed" })
      xhr.send(formData)
    }),
  getStats: () => apiRequest<{ stats: RestaurantStats }>("/restaurant/stats"),
  getPayments: () =>
    apiRequest<{ payments: Payment[] }>("/restaurant/payments"),

  // ===== Menu Categories =====
  getCategories: () =>
    apiRequest<{ categories: MenuCategory[] }>("/menu/categories"),
  createCategory: (body: { name: string; sort_order?: number }) =>
    apiRequest<{ category: MenuCategory }>("/menu/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCategory: (id: number, body: Partial<MenuCategory>) =>
    apiRequest<{ category: MenuCategory }>(`/menu/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteCategory: (id: number) =>
    apiRequest<{ message: string }>(`/menu/categories/${id}`, {
      method: "DELETE",
    }),

  // ===== Menu Items =====
  getItems: () => apiRequest<{ items: MenuItem[] }>("/menu/items"),
  createItem: (body: Partial<MenuItem>) =>
    apiRequest<{ item: MenuItem }>("/menu/items", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateItem: (id: number, body: Partial<MenuItem>) =>
    apiRequest<{ item: MenuItem }>(`/menu/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteItem: (id: number) =>
    apiRequest<{ message: string }>(`/menu/items/${id}`, {
      method: "DELETE",
    }),

  // ===== Tables =====
  getTables: () => apiRequest<{ tables: RestaurantTable[] }>("/tables"),
  createTable: (body: { table_number: string }) =>
    apiRequest<{ table: RestaurantTable }>("/tables", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateTable: (id: number, body: Partial<RestaurantTable>) =>
    apiRequest<{ table: RestaurantTable }>(`/tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteTable: (id: number) =>
    apiRequest<{ message: string }>(`/tables/${id}`, { method: "DELETE" }),
  regenerateQr: (id: number) =>
    apiRequest<{ table: RestaurantTable }>(`/tables/${id}/regenerate-qr`, {
      method: "POST",
    }),

  // ===== Customer (public) =====
  scanQr: (qrToken: string) =>
    apiRequest<{
      table: RestaurantTable
      session: TableSession
      menu: MenuCategory[]
      restaurant: Restaurant
    }>(`/scan/${qrToken}`),
  getSessionOrders: (sessionId: number) =>
    apiRequest<{ session: TableSession }>(`/session/${sessionId}/orders`),
  placeOrder: (body: {
    session_id: number
    items: {
      menu_item_id: number
      quantity: number
      notes?: string
    }[]
  }) =>
    apiRequest<{ order: Order }>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  makePayment: (body: {
    session_id: number
    amount: number
    method: Payment["method"]
    split_type: Payment["split_type"]
    payer_label?: string
    item_ids?: number[]
  }) =>
    apiRequest<{ payment: Payment }>("/payments", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getSessionPayments: (sessionId: number) =>
    apiRequest<{ payments: Payment[] }>(`/session/${sessionId}/payments`),

  // ===== Kitchen =====
  getKitchenOrders: () =>
    apiRequest<{ orders: Order[] }>("/orders/kitchen"),
  updateOrderStatus: (id: number, status: Order["status"]) =>
    apiRequest<{ order: Order }>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  markItemServed: (itemId: number) =>
    apiRequest<{ item: OrderItem }>(`/orders/items/${itemId}/served`, {
      method: "PUT",
    }),

  // ===== Payments (staff) =====
  confirmCash: (id: number) =>
    apiRequest<{ payment: Payment }>(`/payments/${id}/confirm-cash`, {
      method: "PUT",
    }),

  // ===== Staff =====
  getStaff: () => apiRequest<{ staff: User[] }>("/staff"),
  createStaff: (body: {
    name: string
    email: string
    password: string
    phone?: string
    role: "manager" | "waiter" | "kitchen"
  }) =>
    apiRequest<{ staff: User; token: string }>("/staff", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateStaff: (id: number, body: Partial<User> & { password?: string }) =>
    apiRequest<{ staff: User }>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteStaff: (id: number) =>
    apiRequest<{ message: string }>(`/staff/${id}`, { method: "DELETE" }),
}
