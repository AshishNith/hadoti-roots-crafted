import {
  type Product,
  type Farmer,
  type BlogPost,
  type Testimonial,
  type Stat,
  type DalOption
} from "./data";

const API_BASE_URL = "http://127.0.0.1:5000/api";

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

