import express from "express";
import Product from "../models/Product.js";
import Farmer from "../models/Farmer.js";
import BlogPost from "../models/BlogPost.js";
import Testimonial from "../models/Testimonial.js";
import Stat from "../models/Stat.js";
import DalOption from "../models/DalOption.js";

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

export default router;
