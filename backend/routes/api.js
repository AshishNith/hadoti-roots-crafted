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

// ==========================================
// ADMINISTRATIVE (ADMIN PANEL) ENDPOINTS
// ==========================================

// GET admin dashboard stats
router.get("/admin/stats", async (req, res) => {
  try {
    // Total Revenue (excluding cancelled orders)
    const activeOrders = await Order.find({ status: { $ne: "cancelled" } });
    const totalSales = activeOrders.reduce((sum, order) => sum + order.total, 0);

    // Total counts
    const totalOrders = await Order.countDocuments({});
    const totalFarmers = await Farmer.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({});

    // Recent orders with details
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(6);

    // Recent activity (e.g. recent custom blends or users)
    const recentBlends = await CustomBlend.find({}).sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5);

    // Group sales by date for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const ordersInLast7Days = await Order.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    const salesHistory = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      salesHistory[dateString] = { date: dateString, sales: 0, count: 0 };
    }

    ordersInLast7Days.forEach(order => {
      const dateString = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (salesHistory[dateString]) {
        salesHistory[dateString].sales += order.total;
        salesHistory[dateString].count += 1;
      }
    });

    const salesChartData = Object.values(salesHistory);

    // Category distribution
    const products = await Product.find({});
    const categoriesCount = {};
    products.forEach(p => {
      categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
    });

    res.json({
      summary: {
        totalSales,
        totalOrders,
        totalFarmers,
        totalProducts,
        totalUsers
      },
      recentOrders,
      recentBlends,
      recentUsers,
      salesChartData,
      categoriesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Products CRUD ---
router.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Farmers CRUD ---
router.post("/farmers", async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.json({ message: "Farmer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Blog Posts CRUD ---
router.post("/blogs", async (req, res) => {
  try {
    const blog = new BlogPost(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Testimonials CRUD ---
router.post("/testimonials", async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/testimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Dal Options CRUD ---
router.post("/dal-options", async (req, res) => {
  try {
    const dalOption = new DalOption(req.body);
    await dalOption.save();
    res.status(201).json(dalOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/dal-options/:id", async (req, res) => {
  try {
    const dalOption = await DalOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dalOption) return res.status(404).json({ message: "Dal Option not found" });
    res.json(dalOption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/dal-options/:id", async (req, res) => {
  try {
    const dalOption = await DalOption.findByIdAndDelete(req.params.id);
    if (!dalOption) return res.status(404).json({ message: "Dal Option not found" });
    res.json({ message: "Dal Option deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Orders Management ---
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Users Management ---
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
