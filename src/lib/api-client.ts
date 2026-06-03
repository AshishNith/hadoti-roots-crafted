import {
  type Product,
  type Farmer,
  type BlogPost,
  type Testimonial,
  type Stat,
  type DalOption
} from "./data";

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://127.0.0.1:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

async function fetchOrThrow<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status} from ${url}`);
  }
  return (await res.json()) as T;
}

export async function getProducts(): Promise<Product[]> {
  return fetchOrThrow<Product[]>(`${API_BASE_URL}/products`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return fetchOrThrow<Product>(`${API_BASE_URL}/products/${slug}`);
}

export async function getFarmers(): Promise<Farmer[]> {
  return fetchOrThrow<Farmer[]>(`${API_BASE_URL}/farmers`);
}

export async function getBlogs(): Promise<BlogPost[]> {
  return fetchOrThrow<BlogPost[]>(`${API_BASE_URL}/blogs`);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost> {
  return fetchOrThrow<BlogPost>(`${API_BASE_URL}/blogs/${slug}`);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fetchOrThrow<Testimonial[]>(`${API_BASE_URL}/testimonials`);
}

export async function getStats(): Promise<Stat[]> {
  return fetchOrThrow<Stat[]>(`${API_BASE_URL}/stats`);
}

export async function getDalOptions(): Promise<DalOption[]> {
  return fetchOrThrow<DalOption[]>(`${API_BASE_URL}/dal-options`);
}

async function postOrThrow<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status} from ${url}`);
  }
  return (await res.json()) as T;
}

export async function syncUser(userData: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<any> {
  return postOrThrow<any>(`${API_BASE_URL}/users/sync`, userData);
}

export async function placeOrder(orderData: {
  userUid: string;
  items: any[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin: string;
  };
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}): Promise<any> {
  return postOrThrow<any>(`${API_BASE_URL}/orders`, orderData);
}

export async function getUserOrders(uid: string): Promise<any[]> {
  return fetchOrThrow<any[]>(`${API_BASE_URL}/orders/user/${uid}`);
}

export async function saveBlend(blendData: {
  userUid: string;
  name: string;
  blendType: string;
  customizationSummary: string;
  weight: string;
  price: number;
}): Promise<any> {
  return postOrThrow<any>(`${API_BASE_URL}/blends`, blendData);
}

export async function getSavedBlends(uid: string): Promise<any[]> {
  return fetchOrThrow<any[]>(`${API_BASE_URL}/blends/user/${uid}`);
}

export async function getProductReviews(slug: string): Promise<any[]> {
  return fetchOrThrow<any[]>(`${API_BASE_URL}/reviews/product/${slug}`);
}

export async function createProductReview(reviewData: {
  productSlug: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<any> {
  return postOrThrow<any>(`${API_BASE_URL}/reviews`, reviewData);
}


