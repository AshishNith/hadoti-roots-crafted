import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/api.js";
import { checkAndGenerateSubscriptionOrders } from "./config/subscriptionEngine.js";

// Load env variables from .env
dotenv.config();
//Just to trigger the redeployment on Vercel to move it 

// Connect to MongoDB
connectDB();

// Initialize active subscription recurring order checks (runs once daily in background)
const DAILY_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
setInterval(async () => {
  try {
    console.log("[Background Task] Running daily subscription delivery check...");
    await checkAndGenerateSubscriptionOrders();
  } catch (err) {
    console.error("[Background Task] Subscription check failed:", err);
  }
}, DAILY_INTERVAL);

// Run once immediately on startup (after 5 seconds to ensure DB is fully ready)
setTimeout(async () => {
  try {
    console.log("[Startup Task] Executing initial subscription delivery check...");
    await checkAndGenerateSubscriptionOrders();
  } catch (err) {
    console.error("[Startup Task] Initial subscription check failed:", err);
  }
}, 5000);

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-ms-client-request-id'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use((req, res, next) => {
  console.log(`[CORS Check] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hadoti Farms Backend API is running...");
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
