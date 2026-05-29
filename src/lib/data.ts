export type Product = {
  slug: string;
  name: string;
  shortDesc: string;
  category: "dals" | "masalas" | "ration" | "hampers" | "grains";
  price: number;
  weight: string;
  customizable: "dal" | "masala" | "ration" | "hamper" | "grain" | null;
};

export const products: Product[] = [
  {
    slug: "hadoti-panchratan-dal",
    name: "Hadoti Panchratan Dal",
    shortDesc: "Five-dal heritage blend, slow sun-dried.",
    category: "dals",
    price: 180,
    weight: "500g",
    customizable: "dal",
  },
  {
    slug: "pure-moong-dhuli",
    name: "Pure Moong Dhuli",
    shortDesc: "Hand-cleaned, washed, gently split.",
    category: "dals",
    price: 140,
    weight: "500g",
    customizable: "dal",
  },
  {
    slug: "kali-urad-dal",
    name: "Kali Urad Dal",
    shortDesc: "Native black urad from Bundi.",
    category: "dals",
    price: 160,
    weight: "500g",
    customizable: "dal",
  },
  {
    slug: "custom-masala-blend",
    name: "Custom Masala Blend",
    shortDesc: "Built to your kitchen, ground to order.",
    category: "masalas",
    price: 120,
    weight: "100g",
    customizable: "masala",
  },
  {
    slug: "lal-mirch-powder",
    name: "Lal Mirch Powder",
    shortDesc: "Single-origin Mathania chilli.",
    category: "masalas",
    price: 90,
    weight: "100g",
    customizable: "masala",
  },
  {
    slug: "monthly-ration-box-small",
    name: "Monthly Ration Box — Small",
    shortDesc: "A month of staples, built around you.",
    category: "ration",
    price: 899,
    weight: "3kg",
    customizable: "ration",
  },
  {
    slug: "festive-gift-hamper",
    name: "Festive Gift Hamper",
    shortDesc: "A taste of Hadoti, wrapped in jute.",
    category: "hampers",
    price: 1499,
    weight: "Gift Box",
    customizable: "hamper",
  },
  {
    slug: "jowar-atta",
    name: "Jowar Atta",
    shortDesc: "Stone ground the slow way.",
    category: "grains",
    price: 110,
    weight: "1kg",
    customizable: null,
  },
  {
    slug: "custom-flour-blend",
    name: "Custom Flour Blend (Atta)",
    shortDesc: "Stone-ground to order. Calibrate gluten, carbs, and seeds to your family's needs.",
    category: "grains",
    price: 130,
    weight: "1kg",
    customizable: "grain",
  },
];

export const farmers = [
  {
    name: "Ramesh Gurjar",
    village: "Bundi",
    years: 18,
    crop: "Urad Dal",
    quote: "The black soil here keeps the urad rich. We don't rush it.",
  },
  {
    name: "Savitri Devi",
    village: "Jhalawar",
    years: 12,
    crop: "Jowar & Til",
    quote: "My grandmother farmed this land. Same wells, same seeds.",
  },
  {
    name: "Mohan Lal Meena",
    village: "Kota",
    years: 22,
    crop: "Moong & Chana",
    quote: "No pesticides. The neem trees do the work for us.",
  },
  {
    name: "Dinesh Sharma",
    village: "Bundi",
    years: 9,
    crop: "Lal Mirch (Mathania)",
    quote: "Each chilli is dried under the open Bundi sun.",
  },
];

export const blogPosts = [
  {
    slug: "perfect-protein-dal-mix",
    type: "Recipe",
    title: "How to Build the Perfect Protein Dal Mix",
    excerpt: "The ratios that turn three dals into a complete meal.",
    date: "March 2026",
  },
  {
    slug: "story-of-mathania-chilli",
    type: "Farm Story",
    title: "The Story of Mathania Chilli",
    excerpt: "Why a single village in Rajasthan colors half of India's curries.",
    date: "February 2026",
  },
  {
    slug: "why-hadoti-urad-is-different",
    type: "Farm Story",
    title: "Why Hadoti Urad is Different",
    excerpt: "Black soil, low water, slow growth — and what it does to the dal.",
    date: "January 2026",
  },
  {
    slug: "first-custom-ration-box",
    type: "Seasonal Guide",
    title: "Building Your First Custom Ration Box",
    excerpt: "A simple framework for a month of staples.",
    date: "January 2026",
  },
];

export const testimonials = [
  {
    quote: "It tastes like what my mother used to send from her village.",
    name: "Aarti Mehta",
    city: "Bengaluru",
    rating: 5,
  },
  {
    quote: "The custom dal mix is honestly the best thing my kitchen has met.",
    name: "Rohit Singh",
    city: "Pune",
    rating: 5,
  },
  {
    quote: "Packaging is beautiful, but the urad — the urad is unbelievable.",
    name: "Kavya Iyer",
    city: "Mumbai",
    rating: 5,
  },
];

export const stats = [
  { value: 400, suffix: "+", label: "Farmers" },
  { value: 12, suffix: "", label: "Native Crops" },
  { value: 3, suffix: "", label: "Districts" },
  { value: 10000, suffix: "+", label: "Happy Orders" },
];

export const dalOptions = [
  { id: "moong", name: "Moong", desc: "Cooling, light, easy to digest." },
  { id: "urad", name: "Urad", desc: "Earthy, deep, slow-cooked richness." },
  { id: "masoor", name: "Masoor", desc: "Quick-cooking, gentle red lentil." },
  { id: "chana", name: "Chana", desc: "Nutty, hearty, holds shape." },
  { id: "toor", name: "Toor", desc: "Everyday sambhar staple." },
  { id: "rajma", name: "Rajma", desc: "Bold kidney bean, slow simmer." },
  { id: "matki", name: "Matki", desc: "Tiny, sprouted, protein dense." },
  { id: "kulthi", name: "Kulthi", desc: "Hadoti horse gram, monsoon crop." },
];

export const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export function imageFor(slug: string): string {
  const mapping: Record<string, string> = {
    "hadoti-panchratan-dal": "/images/panchratan_dal.png",
    "pure-moong-dhuli": "/images/moong_dal.png",
    "kali-urad-dal": "/images/kali_urad_dal.png",
    "custom-masala-blend": "/images/masala_blend.png",
    "lal-mirch-powder": "/images/lal_mirch.png",
    "monthly-ration-box-small": "/images/ration_box.png",
    "festive-gift-hamper": "/images/gift_hamper.png",
    "jowar-atta": "/images/jowar_atta.png",
    "custom-flour-blend": "/images/jowar_atta.png",
  };
  return mapping[slug] || "/images/panchratan_dal.png";
}

export function imageForBlog(slug: string): string {
  const mapping: Record<string, string> = {
    "perfect-protein-dal-mix": "/images/blog_dal_mix.png",
    "story-of-mathania-chilli": "/images/blog_mathania_chilli.png",
    "why-hadoti-urad-is-different": "/images/blog_urad_dal.png",
    "first-custom-ration-box": "/images/blog_ration_box.png",
  };
  return mapping[slug] || "/images/blog_dal_mix.png";
}

export function imageForFarmer(name: string): string {
  const mapping: Record<string, string> = {
    "Ramesh Gurjar": "/images/farmer_ramesh.png",
    "Savitri Devi": "/images/farmer_savitri.png",
    "Mohan Lal Meena": "/images/farmer_mohan.png",
    "Dinesh Sharma": "/images/lal_mirch.png",
  };
  return mapping[name] || "/images/farmer_ramesh.png";
}

