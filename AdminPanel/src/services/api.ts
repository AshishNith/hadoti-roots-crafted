export interface Product {
  _id?: string;
  slug: string;
  name: string;
  shortDesc: string;
  category: "dals" | "masalas" | "ration" | "hampers" | "grains";
  price: number;
  weight: string;
  customizable: string | null;
  image: string | null;
}

export interface Farmer {
  _id?: string;
  name: string;
  village: string;
  years: number;
  crop: string;
  quote: string;
  image: string | null;
}

export interface BlogPost {
  _id?: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  image: string | null;
}

export interface Testimonial {
  _id?: string;
  quote: string;
  name: string;
  city: string;
  rating: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  qty: number;
  customization: string | null;
  image: string | null;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userUid: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "upi" | "card" | "cod";
  paymentStatus: string;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: "customer" | "admin";
  createdAt: string;
}

export interface DalOption {
  _id?: string;
  id: string;
  name: string;
  desc: string;
}

export interface DashboardStats {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalFarmers: number;
    totalProducts: number;
    totalUsers: number;
  };
  recentOrders: Order[];
  recentBlends: any[];
  recentUsers: User[];
  salesChartData: { date: string; sales: number; count: number }[];
  categoriesCount: Record<string, number>;
}

const API_BASE = "/api";

async function fetchOrThrow<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Stats
  getDashboardStats: () => fetchOrThrow<DashboardStats>(`${API_BASE}/admin/stats`),

  // Products
  getProducts: () => fetchOrThrow<Product[]>(`${API_BASE}/products`),
  getProductBySlug: (slug: string) => fetchOrThrow<Product>(`${API_BASE}/products/${slug}`),
  createProduct: (data: Partial<Product>) => 
    fetchOrThrow<Product>(`${API_BASE}/products`, { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) => 
    fetchOrThrow<Product>(`${API_BASE}/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/products/${id}`, { method: "DELETE" }),

  // Farmers
  getFarmers: () => fetchOrThrow<Farmer[]>(`${API_BASE}/farmers`),
  createFarmer: (data: Partial<Farmer>) => 
    fetchOrThrow<Farmer>(`${API_BASE}/farmers`, { method: "POST", body: JSON.stringify(data) }),
  updateFarmer: (id: string, data: Partial<Farmer>) => 
    fetchOrThrow<Farmer>(`${API_BASE}/farmers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFarmer: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/farmers/${id}`, { method: "DELETE" }),

  // Blogs
  getBlogs: () => fetchOrThrow<BlogPost[]>(`${API_BASE}/blogs`),
  getBlogBySlug: (slug: string) => fetchOrThrow<BlogPost>(`${API_BASE}/blogs/${slug}`),
  createBlog: (data: Partial<BlogPost>) => 
    fetchOrThrow<BlogPost>(`${API_BASE}/blogs`, { method: "POST", body: JSON.stringify(data) }),
  updateBlog: (id: string, data: Partial<BlogPost>) => 
    fetchOrThrow<BlogPost>(`${API_BASE}/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlog: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/blogs/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => fetchOrThrow<Testimonial[]>(`${API_BASE}/testimonials`),
  createTestimonial: (data: Partial<Testimonial>) => 
    fetchOrThrow<Testimonial>(`${API_BASE}/testimonials`, { method: "POST", body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: Partial<Testimonial>) => 
    fetchOrThrow<Testimonial>(`${API_BASE}/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/testimonials/${id}`, { method: "DELETE" }),

  // Dal Options
  getDalOptions: () => fetchOrThrow<DalOption[]>(`${API_BASE}/dal-options`),
  createDalOption: (data: Partial<DalOption>) => 
    fetchOrThrow<DalOption>(`${API_BASE}/dal-options`, { method: "POST", body: JSON.stringify(data) }),
  updateDalOption: (id: string, data: Partial<DalOption>) => 
    fetchOrThrow<DalOption>(`${API_BASE}/dal-options/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDalOption: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/dal-options/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => fetchOrThrow<Order[]>(`${API_BASE}/orders`),
  updateOrderStatus: (id: string, status?: string, paymentStatus?: string) => 
    fetchOrThrow<Order>(`${API_BASE}/orders/${id}/status`, { 
      method: "PUT", 
      body: JSON.stringify({ status, paymentStatus }) 
    }),
  deleteOrder: (id: string) => 
    fetchOrThrow<{ message: string }>(`${API_BASE}/orders/${id}`, { method: "DELETE" }),

  // Users
  getUsers: () => fetchOrThrow<User[]>(`${API_BASE}/users`),
  updateUserRole: (id: string, role: "customer" | "admin") => 
    fetchOrThrow<User>(`${API_BASE}/users/${id}/role`, { 
      method: "PUT", 
      body: JSON.stringify({ role }) 
    }),
};
