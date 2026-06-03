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
    content: "The perfect protein dal mix is built on a simple biological truth: while individual pulses lack certain essential amino acids, combining them creates a complete, high-quality protein profile similar to animal sources. In our traditional Hadoti kitchens, we've found that a 5:3:2 ratio of yellow moong, split urad, and quick-cooking red masoor dal creates the absolute sweet spot. The moong provides a light, cooling baseline; the urad brings a deep, earthy texture and rich lipid mouthfeel; and the masoor ties it together by melting down into a thick, binding gravy. Stone-milled and sun-dried, these dals retain their outer nutrient husks, ensuring you get maximum dietary fiber alongside your plant proteins. For a perfect simmer, wash the blend three times, soak for 20 minutes, and slow-cook in a heavy brass vessel with a pinch of Bundi-grown turmeric and ghee.",
    date: "March 2026",
  },
  {
    slug: "story-of-mathania-chilli",
    type: "Farm Story",
    title: "The Story of Mathania Chilli",
    excerpt: "Why a single village in Rajasthan colors half of India's curries.",
    content: "Mathania, a small, sun-drenched pocket in Rajasthan, yields a single-origin red chilli that Jodhpur royalty and local farmer collectives have guarded for generations. The Mathania chilli is famous not for blinding, aggressive heat, but for its deep, oil-rich burgundy color, its lingering smoky sweetness, and its ability to emulsify beautifully into gravies like Laal Maas. Under the fierce desert sun, these chillies are slow-dried on large open-air jute sheets. This slow dehydration concentrates the natural capsaicin oils and sugars without scorching the pods. At Hadoti Farms, our farmers in Bundi work closely with Jodhpur growers to preserve these heirloom seeds, stone-grinding them in small batches to order. When you open a jar of our ground Mathania chilli, you are smelling the dry desert wind, the clay earth, and three centuries of desert farming heritage.",
    date: "February 2026",
  },
  {
    slug: "why-hadoti-urad-is-different",
    type: "Farm Story",
    title: "Why Hadoti Urad is Different",
    excerpt: "Black soil, low water, slow growth — and what it does to the dal.",
    content: "Walk through Ramesh Gurjar's fields in Bundi during the late winter, and you will see urad plants clinging tightly to the dark, clayey black cotton soil. Unlike other regions where rich river basins speed up growth, Hadoti's soil holds moisture deep down, forcing the crops to grow slowly and develop thick, robust root structures. This low-water, slow-maturing stress is precisely what gives Hadoti's black urad dal its unparalleled culinary properties. The skin is thick and rich in minerals, and the inner cotyledon is packed with dense, slow-solubilizing starches. When split and washed in our traditional stone mills, it yields a dal that doesn't disintegrate under high heat, but rather slowly releases its natural creamy mucilage. It is this unique quality that makes it the choice for slow-simmered dals like Dal Makhani and traditional Rajasthani Baati accompaniment.",
    date: "January 2026",
  },
  {
    slug: "first-custom-ration-box",
    type: "Seasonal Guide",
    title: "Building Your First Custom Ration Box",
    excerpt: "A simple framework for a month of staples.",
    content: "A custom ration box is designed to eliminate the waste, chemical exposure, and generic quality of supermarket staples by delivering fresh, pesticide-free, stone-ground grains and sun-dried dals direct from Hadoti's farms to your kitchen. To build your first box, start with your grain baseline: calculate roughly 1kg of flour per family member per week. Next, select your dals: we recommend a mix of Moong for light mid-week lunches, Urad for rich weekend dinners, and Chana for protein-dense salads. Finally, calibrate your spice levels: add single-origin Mathania chilli and stone-ground haldi to round out the monthly requirements. By shifting from industrial packaging to our custom jute-lined boxes, you actively support our cooperative of 400+ farmers, ensuring they receive 30% higher wages while your family enjoys unmatched, traceably clean nutrition.",
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
  "pure-masoor-dal": "moong_dal.png",
  "pure-chana-dal": "moong_dal.png",
  "pure-toor-dal": "moong_dal.png",
  "pure-rajma": "kali_urad_dal.png",
  "pure-matki": "panchratan_dal.png",
  "pure-kulthi": "panchratan_dal.png",
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
