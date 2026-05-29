import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { uploadImage } from "./config/cloudinary.js";

// Models
import Product from "./models/Product.js";
import Farmer from "./models/Farmer.js";
import BlogPost from "./models/BlogPost.js";
import Testimonial from "./models/Testimonial.js";
import Stat from "./models/Stat.js";
import DalOption from "./models/DalOption.js";

// Load env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsSeed = [
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

const farmersSeed = [
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

const blogPostsSeed = [
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

const testimonialsSeed = [
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

const statsSeed = [
  { value: 400, suffix: "+", label: "Farmers" },
  { value: 12, suffix: "", label: "Native Crops" },
  { value: 3, suffix: "", label: "Districts" },
  { value: 10000, suffix: "+", label: "Happy Orders" },
];

const dalOptionsSeed = [
  { id: "moong", name: "Moong", desc: "Cooling, light, easy to digest." },
  { id: "urad", name: "Urad", desc: "Earthy, deep, slow-cooked richness." },
  { id: "masoor", name: "Masoor", desc: "Quick-cooking, gentle red lentil." },
  { id: "chana", name: "Chana", desc: "Nutty, hearty, holds shape." },
  { id: "toor", name: "Toor", desc: "Everyday sambhar staple." },
  { id: "rajma", name: "Rajma", desc: "Bold kidney bean, slow simmer." },
  { id: "matki", name: "Matki", desc: "Tiny, sprouted, protein dense." },
  { id: "kulthi", name: "Kulthi", desc: "Hadoti horse gram, monsoon crop." },
];

// File mappings
const productImageMapping = {
  "hadoti-panchratan-dal": "panchratan_dal.png",
  "pure-moong-dhuli": "moong_dal.png",
  "kali-urad-dal": "kali_urad_dal.png",
  "custom-masala-blend": "masala_blend.png",
  "lal-mirch-powder": "lal_mirch.png",
  "monthly-ration-box-small": "ration_box.png",
  "festive-gift-hamper": "gift_hamper.png",
  "jowar-atta": "jowar_atta.png",
  "custom-flour-blend": "jowar_atta.png",
};

const farmerImageMapping = {
  "Ramesh Gurjar": "farmer_ramesh.png",
  "Savitri Devi": "farmer_savitri.png",
  "Mohan Lal Meena": "farmer_mohan.png",
  "Dinesh Sharma": "lal_mirch.png",
};

const blogImageMapping = {
  "perfect-protein-dal-mix": "blog_dal_mix.png",
  "story-of-mathania-chilli": "blog_mathania_chilli.png",
  "why-hadoti-urad-is-different": "blog_urad_dal.png",
  "first-custom-ration-box": "blog_ration_box.png",
};

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing database collections...");
    await Product.deleteMany({});
    await Farmer.deleteMany({});
    await BlogPost.deleteMany({});
    await Testimonial.deleteMany({});
    await Stat.deleteMany({});
    await DalOption.deleteMany({});

    console.log("\n--- Seeding Products with Cloudinary ---");
    for (const item of productsSeed) {
      const fileName = productImageMapping[item.slug] || "panchratan_dal.png";
      const localPath = path.join(__dirname, "../public/images", fileName);
      
      const cloudinaryUrl = await uploadImage(localPath, "hadoti_farms/products");
      item.image = cloudinaryUrl || `/images/${fileName}`;
    }
    await Product.insertMany(productsSeed);

    console.log("\n--- Seeding Farmers with Cloudinary ---");
    for (const item of farmersSeed) {
      const fileName = farmerImageMapping[item.name] || "farmer_ramesh.png";
      const localPath = path.join(__dirname, "../public/images", fileName);
      
      const cloudinaryUrl = await uploadImage(localPath, "hadoti_farms/farmers");
      item.image = cloudinaryUrl || `/images/${fileName}`;
    }
    await Farmer.insertMany(farmersSeed);

    console.log("\n--- Seeding Blog Posts with Cloudinary ---");
    for (const item of blogPostsSeed) {
      const fileName = blogImageMapping[item.slug] || "blog_dal_mix.png";
      const localPath = path.join(__dirname, "../public/images", fileName);
      
      const cloudinaryUrl = await uploadImage(localPath, "hadoti_farms/blogs");
      item.image = cloudinaryUrl || `/images/${fileName}`;
    }
    await BlogPost.insertMany(blogPostsSeed);

    console.log("\n--- Seeding Static Data ---");
    await Testimonial.insertMany(testimonialsSeed);
    await Stat.insertMany(statsSeed);
    await DalOption.insertMany(dalOptionsSeed);

    console.log("\n🎉 Database seeded successfully with Cloudinary assets!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
