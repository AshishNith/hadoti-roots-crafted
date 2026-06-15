import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { sendOrderEmail } from "../config/emails.js";
import Product from "../models/Product.js";
import Farmer from "../models/Farmer.js";
import BlogPost from "../models/BlogPost.js";
import Testimonial from "../models/Testimonial.js";
import Stat from "../models/Stat.js";
import DalOption from "../models/DalOption.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import CustomBlend from "../models/CustomBlend.js";
import Review from "../models/Review.js";
import Subscription from "../models/Subscription.js";
import { checkAndGenerateSubscriptionOrders } from "../config/subscriptionEngine.js";

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

// GET saved addresses for a user
router.get("/users/:uid/addresses", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a saved address
router.post("/users/:uid/addresses", async (req, res) => {
  try {
    const { name, phone, address, city, state, pin } = req.body;
    if (!name || !phone || !address || !city || !state || !pin) {
      return res.status(400).json({ message: "Incomplete address details" });
    }
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Avoid duplicates
    const isDuplicate = user.addresses.some(
      (addr) =>
        addr.name === name &&
        addr.phone === phone &&
        addr.address === address &&
        addr.city === city &&
        addr.state === state &&
        addr.pin === pin
    );
    
    if (!isDuplicate) {
      user.addresses.push({ name, phone, address, city, state, pin });
      await user.save();
    }
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a saved address
router.delete("/users/:uid/addresses/:addressId", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.addresses.pull(req.params.addressId);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create Razorpay order
router.post("/payments/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("Razorpay KEY_ID or KEY_SECRET is missing. Running in payment Mock Mode.");
      // Return a simulated Razorpay order response
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 9)}`;
      return res.json({
        id: mockOrderId,
        amount: amount * 100, // in paise
        currency: "INR",
        mock: true,
        keyId: "rzp_test_mockkey123"
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise (must be integer)
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      mock: false,
      keyId: keyId
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST verify Razorpay signature
router.post("/payments/verify-signature", async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing Razorpay details" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.warn("Razorpay KEY_SECRET is missing. Bypassing signature verification.");
      return res.json({ status: "success", verified: true, mock: true });
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpaySignature) {
      res.json({ status: "success", verified: true, mock: false });
    } else {
      res.status(400).json({ status: "failed", verified: false, message: "Signature verification failed" });
    }
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create order
router.post("/orders", async (req, res) => {
  try {
    const {
      userUid,
      items,
      shippingAddress,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    if (!userUid || !items || !shippingAddress || total === undefined) {
      return res.status(400).json({ message: "Incomplete order data" });
    }

    // Verify payment details if paymentMethod is UPI or Card
    let paymentStatus = "pending";
    if (paymentMethod === "cod") {
      paymentStatus = "cod";
    } else if (paymentMethod === "upi" || paymentMethod === "card") {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (keySecret) {
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          return res.status(400).json({ message: "Online payment details are required for UPI/Card orders." });
        }
        // Crypto verification
        const hmac = crypto.createHmac("sha256", keySecret);
        hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
        const generatedSignature = hmac.digest("hex");
        if (generatedSignature !== razorpaySignature) {
          return res.status(400).json({ message: "Online payment signature mismatch. Order not placed." });
        }
        paymentStatus = "paid";
      } else {
        console.warn("Skipping payment verification because RAZORPAY_KEY_SECRET is not configured.");
        paymentStatus = "paid"; // Accept simulated payments in dev mode
      }
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
      paymentStatus,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      razorpaySignature: razorpaySignature || null
    });
    await newOrder.save();

    // Check if the order contains subscription plans and create subscription records
    try {
      for (const item of newOrder.items) {
        const nameLower = item.name.toLowerCase();
        const customLower = (item.customization || "").toLowerCase();
        if (
          nameLower.includes("ration box") &&
          (customLower.includes("prepaid plan") || customLower.includes("subscription"))
        ) {
          let months = 1;
          if (customLower.includes("3-month")) months = 3;
          else if (customLower.includes("6-month")) months = 6;
          else if (customLower.includes("12-month")) months = 12;

          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + months);

          const nextDeliveryDate = new Date(startDate);
          nextDeliveryDate.setMonth(startDate.getMonth() + 1);

          const subscriptionNumber = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;

          const newSubscription = new Subscription({
            subscriptionNumber,
            userUid: newOrder.userUid,
            originalOrderId: newOrder._id,
            originalOrderNumber: newOrder.orderNumber,
            status: "active",
            planName: customLower.includes("prepaid plan") ? `${months}-Month Prepaid Plan` : "Monthly subscription",
            months,
            currentDeliveryCount: 1, // The initial order covers month 1
            price: item.price,
            shippingAddress: newOrder.shippingAddress,
            items: [item],
            startDate,
            endDate,
            lastDeliveryDate: startDate,
            nextDeliveryDate,
          });

          await newSubscription.save();
          console.log(`[Subscription Hook] Created subscription ${subscriptionNumber} for order ${newOrder.orderNumber}`);
        }
      }
    } catch (subErr) {
      console.error("Failed to process subscription generation on checkout:", subErr);
    }

    // Auto-save address to user profile if not duplicates and retrieve email
    let userEmail = "";
    try {
      const user = await User.findOne({ uid: userUid });
      if (user) {
        userEmail = user.email;
        const isDuplicate = user.addresses.some(
          (addr) =>
            addr.name === shippingAddress.name &&
            addr.phone === shippingAddress.phone &&
            addr.address === shippingAddress.address &&
            addr.city === shippingAddress.city &&
            addr.state === shippingAddress.state &&
            addr.pin === shippingAddress.pin
        );
        if (!isDuplicate) {
          user.addresses.push({
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pin: shippingAddress.pin,
          });
          await user.save();
        }
      }
    } catch (addrErr) {
      console.error("Auto-save address on checkout error:", addrErr);
    }

    // Trigger async order email notification
    if (userEmail) {
      sendOrderEmail(newOrder, userEmail).catch((mailErr) => {
        console.error("Failed to send order email:", mailErr);
      });
    } else {
      console.warn(`[Order API] No email found for userUid: ${userUid}. Receipt email skipped.`);
    }

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

// GET reviews for a product
router.get("/reviews/product/:slug", async (req, res) => {
  try {
    const reviews = await Review.find({ productSlug: req.params.slug }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create review
router.post("/reviews", async (req, res) => {
  try {
    const { productSlug, userUid, userName, rating, comment } = req.body;
    if (!productSlug || !userUid || !userName || !rating || !comment) {
      return res.status(400).json({ message: "Incomplete review details" });
    }
    const newReview = new Review({
      productSlug,
      userUid,
      userName,
      rating,
      comment,
    });
    await newReview.save();
    res.status(201).json(newReview);
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
    const totalReviews = await Review.countDocuments({});
    const totalSubscriptions = await Subscription.countDocuments({});

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
        totalUsers,
        totalReviews,
        totalSubscriptions
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

// --- Reviews Management ---
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// YouTube Playlist RSS Feed Fetch & Parse
let videoCache = null;
let cacheTime = 0;

router.get("/youtube/videos", async (req, res) => {
  try {
    const playlistId = process.env.YOUTUBE_PLAYLIST_ID || "PL2iAl79gAPTQweN3pRffvmoPMAnfe5EVJ";
    const now = Date.now();
    
    // Cache for 10 minutes
    if (videoCache && (now - cacheTime < 600000)) {
      return res.json(videoCache);
    }

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    
    const entries = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entryContent = match[1];
      
      const videoIdMatch = entryContent.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entryContent.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);
      const descriptionMatch = entryContent.match(/<media:description>([\s\S]*?)<\/media:description>/);
      
      if (videoIdMatch) {
        const id = videoIdMatch[1].trim();
        const title = titleMatch ? titleMatch[1].trim() : "YouTube Video";
        const published = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();
        const description = descriptionMatch ? descriptionMatch[1].trim() : "";
        
        entries.push({
          id,
          title: decodeHtmlEntities(title),
          published,
          description: decodeHtmlEntities(description),
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${id}`
        });
      }
    }
    
    const latestVideos = entries.slice(0, 6);
    videoCache = latestVideos;
    cacheTime = now;
    
    res.json(latestVideos);
  } catch (error) {
    console.error("Error fetching/parsing YouTube RSS:", error);
    if (videoCache) {
      return res.json(videoCache);
    }
    res.status(500).json({ message: "Failed to load YouTube videos" });
  }
});

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

// --- Subscriptions API ---

// GET user subscriptions
router.get("/subscriptions/user/:uid", async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userUid: req.params.uid }).sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all subscriptions (for Admin)
router.get("/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update subscription status
router.put("/subscriptions/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["active", "completed", "cancelled", "paused"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const sub = await Subscription.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.json(sub);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST run subscription engine to generate monthly orders
router.post("/admin/subscriptions/run-engine", async (req, res) => {
  try {
    const generated = await checkAndGenerateSubscriptionOrders();
    res.json({
      message: `Subscription order check complete. Generated ${generated.length} monthly delivery orders.`,
      generatedOrdersCount: generated.length,
      orders: generated
    });
  } catch (error) {
    console.error("Subscription engine run error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

