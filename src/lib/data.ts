export type Product = {
  slug: string;
  name: string;
  shortDesc: string;
  category: "dals" | "masalas" | "ration" | "hampers" | "grains";
  price: number;
  weight: string;
  customizable: "dal" | "masala" | "ration" | "hamper" | "grain" | "single-dal" | "single-flour" | null;
  image?: string | null;
  stock?: number;
};

export type Farmer = {
  name: string;
  village: string;
  years: number;
  crop: string;
  quote: string;
  image?: string | null;
};

export type BlogPost = {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string | null;
};

export type Testimonial = {
  quote: string;
  name: string;
  city: string;
  rating: number;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type DalOption = {
  id: string;
  name: string;
  desc: string;
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
    customizable: "single-dal",
  },
  {
    slug: "kali-urad-dal",
    name: "Kali Urad Dal",
    shortDesc: "Native black urad from Bundi.",
    category: "dals",
    price: 160,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-masoor-dal",
    name: "Pure Masoor Dal",
    shortDesc: "Quick-cooking, gentle red lentil.",
    category: "dals",
    price: 130,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-chana-dal",
    name: "Pure Chana Dal",
    shortDesc: "Nutty, hearty, holds shape.",
    category: "dals",
    price: 120,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-toor-dal",
    name: "Pure Toor Dal",
    shortDesc: "Everyday sambhar staple.",
    category: "dals",
    price: 150,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-rajma",
    name: "Pure Rajma",
    shortDesc: "Bold kidney bean, slow simmer.",
    category: "dals",
    price: 190,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-matki",
    name: "Pure Matki",
    shortDesc: "Tiny, sprouted, protein dense.",
    category: "dals",
    price: 170,
    weight: "500g",
    customizable: "single-dal",
  },
  {
    slug: "pure-kulthi",
    name: "Pure Kulthi",
    shortDesc: "Hadoti horse gram, monsoon crop.",
    category: "dals",
    price: 180,
    weight: "500g",
    customizable: "single-dal",
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
    slug: "pure-sharbati-wheat-atta",
    name: "Pure Sharbati Wheat Atta",
    shortDesc: "100% Sharbati wheat, traditional stone-ground.",
    category: "grains",
    price: 90,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "jowar-atta",
    name: "Jowar Atta",
    shortDesc: "Stone ground the slow way from Bundi jowar.",
    category: "grains",
    price: 110,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "makki-atta",
    name: "Makki Atta (Maize)",
    shortDesc: "Stone-ground yellow corn meal, naturally gluten-free.",
    category: "grains",
    price: 100,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "bajra-atta",
    name: "Bajra Atta",
    shortDesc: "Iron-rich pearl millet flour, stone-ground.",
    category: "grains",
    price: 95,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "ragi-atta",
    name: "Ragi Atta",
    shortDesc: "Calcium-dense finger millet flour, stone-ground.",
    category: "grains",
    price: 120,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "chana-atta",
    name: "Chana Atta (Besan)",
    shortDesc: "Rich protein roasted chickpea flour, stone-ground.",
    category: "grains",
    price: 130,
    weight: "1kg",
    customizable: "single-flour",
  },
  {
    slug: "oats-atta",
    name: "Oats Atta",
    shortDesc: "Milled whole oat groats, rich in beta-glucan fiber.",
    category: "grains",
    price: 150,
    weight: "1kg",
    customizable: "single-flour",
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

export const farmers: Farmer[] = [
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

export const blogPosts: BlogPost[] = [
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

export const testimonials: Testimonial[] = [
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

export const stats: Stat[] = [
  { value: 400, suffix: "+", label: "Farmers" },
  { value: 12, suffix: "", label: "Native Crops" },
  { value: 3, suffix: "", label: "Districts" },
  { value: 10000, suffix: "+", label: "Happy Orders" },
];

export const dalOptions: DalOption[] = [
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
    "pure-masoor-dal": "/images/moong_dal.png",
    "pure-chana-dal": "/images/moong_dal.png",
    "pure-toor-dal": "/images/moong_dal.png",
    "pure-rajma": "/images/kali_urad_dal.png",
    "pure-matki": "/images/panchratan_dal.png",
    "pure-kulthi": "/images/panchratan_dal.png",
    "custom-masala-blend": "/images/masala_blend.png",
    "lal-mirch-powder": "/images/lal_mirch.png",
    "monthly-ration-box-small": "/images/ration_box.png",
    "festive-gift-hamper": "/images/gift_hamper.png",
    "jowar-atta": "/images/jowar_atta.png",
    "pure-sharbati-wheat-atta": "/images/jowar_atta.png",
    "makki-atta": "/images/jowar_atta.png",
    "bajra-atta": "/images/jowar_atta.png",
    "ragi-atta": "/images/jowar_atta.png",
    "chana-atta": "/images/jowar_atta.png",
    "oats-atta": "/images/jowar_atta.png",
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

