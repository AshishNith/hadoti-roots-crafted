export type Product = {
  slug: string;
  name: string;
  shortDesc: string;
  category: "dals" | "masalas" | "ration" | "hampers" | "grains";
  price: number;
  weight: string;
  customizable: "dal" | "masala" | "ration" | "hamper" | null;
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
