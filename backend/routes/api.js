import express from "express";
import Product from "../models/Product.js";
import Farmer from "../models/Farmer.js";
import BlogPost from "../models/BlogPost.js";
import Testimonial from "../models/Testimonial.js";
import Stat from "../models/Stat.js";
import DalOption from "../models/DalOption.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import CustomBlend from "../models/CustomBlend.js";

const router = express.Router();

// GET all products or filter by category
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by slug
router.get("/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all farmers
router.get("/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find({});
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all blog posts
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await BlogPost.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single blog post by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await Stat.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all dal options
router.get("/dal-options", async (req, res) => {
  try {
    const options = await DalOption.find({});
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST sync user from Firebase Auth
router.post("/users/sync", async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ message: "UID and email are required" });
    }
    let user = await User.findOne({ uid });
    if (user) {
      user.email = email;
      user.displayName = displayName || user.displayName;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      user = new User({ uid, email, displayName, photoURL });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create order
router.post("/orders", async (req, res) => {
  try {
    const { userUid, items, shippingAddress, subtotal, deliveryFee, total, paymentMethod } = req.body;
    if (!userUid || !items || !shippingAddress || total === undefined) {
      return res.status(400).json({ message: "Incomplete order data" });
    }
    const orderNumber = `HF-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newOrder = new Order({
      orderNumber,
      userUid,
      items,
      shippingAddress,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "cod" : "paid",
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user orders
router.get("/orders/user/:uid", async (req, res) => {
  try {
    const orders = await Order.find({ userUid: req.params.uid }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST save custom blend
router.post("/blends", async (req, res) => {
  try {
    const { userUid, name, blendType, customizationSummary, weight, price } = req.body;
    if (!userUid || !name || !blendType || !customizationSummary || !weight) {
      return res.status(400).json({ message: "Incomplete blend details" });
    }
    const newBlend = new CustomBlend({
      userUid,
      name,
      blendType,
      customizationSummary,
      weight,
      price,
    });
    await newBlend.save();
    res.status(201).json(newBlend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user custom blends
router.get("/blends/user/:uid", async (req, res) => {
  try {
    const blends = await CustomBlend.find({ userUid: req.params.uid }).sort({ createdAt: -1 });
    res.json(blends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
