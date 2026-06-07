import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Lock, 
  MapPin, 
  UserCheck, 
  RefreshCw, 
  Sliders,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  Menu,
  X
} from "lucide-react";
import { AuthProvider, useAdminAuth } from "./context/AuthContext";
import { api } from "./services/api";
import type { Product, Farmer, BlogPost, Order, User, DalOption, DashboardStats } from "./services/api";
import { jsPDF } from "jspdf";

// -------------------------------------------------------------
// MAIN ADMIN PANEL CONTAINER COMPONENT
// -------------------------------------------------------------
const AdminPanelContent: React.FC = () => {
  const { user, loading: authLoading, isMockMode, login, logout, toggleMockMode } = useAdminAuth();
  
  // Views navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };
  
  // Login form state
  const [email, setEmail] = useState<string>("admin@hadotifarms.com");
  const [password, setPassword] = useState<string>("admin123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Global loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Global data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [dalOptions, setDalOptions] = useState<DalOption[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // User addresses details states
  const [selectedUserForAddresses, setSelectedUserForAddresses] = useState<User | null>(null);
  const [selectedUserAddresses, setSelectedUserAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);

  // Filtering states
  const [productSearch, setProductSearch] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [reviewSearch, setReviewSearch] = useState<string>("");
  
  // Order Pagination
  const [orderPage, setOrderPage] = useState<number>(1);
  const ordersPerPage = 6;

  // Form and detail states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingDal, setEditingDal] = useState<DalOption | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBlend, setSelectedBlend] = useState<any | null>(null);

  // Confirmation Dialogue state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    type: "product" | "farmer" | "blog" | "dal" | "order" | "review";
    title: string;
  } | null>(null);

  // Form Fields states
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "", slug: "", shortDesc: "", category: "dals", price: 100, weight: "500g", customizable: null, image: ""
  });
  
  const [farmerForm, setFarmerForm] = useState<Partial<Farmer>>({
    name: "", village: "", years: 5, crop: "", quote: "", image: ""
  });

  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: "", slug: "", type: "Recipe", excerpt: "", date: "", content: "", image: ""
  });

  const [dalForm, setDalForm] = useState<Partial<DalOption>>({
    id: "", name: "", desc: ""
  });

  // SVG Chart Tooltip State
  const [chartTooltip, setChartTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Trigger loading details for active tab
  useEffect(() => {
    if (!user) return;
    loadTabData();
  }, [user, activeTab]);

  // Handle flash messages
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const data = await api.getDashboardStats();
        setStats(data);
      } else if (activeTab === "products") {
        const data = await api.getProducts();
        setProducts(data);
      } else if (activeTab === "orders") {
        const data = await api.getOrders();
        setOrders(data);
      } else if (activeTab === "farmers") {
        const data = await api.getFarmers();
        setFarmers(data);
      } else if (activeTab === "blogs") {
        const data = await api.getBlogs();
        setBlogs(data);
      } else if (activeTab === "dalOptions") {
        const data = await api.getDalOptions();
        setDalOptions(data);
      } else if (activeTab === "users") {
        const data = await api.getUsers();
        setUsers(data);
      } else if (activeTab === "reviews") {
        const data = await api.getReviews();
        setReviews(data);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load database records.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login(email, password);
      showToast("Access Granted. Welcome to Hadoti Farms Admin.");
    } catch (err: any) {
      setLoginError(err.message || "Authentication credentials failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Product Form auto slug generator
  useEffect(() => {
    if (!editingProduct && productForm.name) {
      const generatedSlug = productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setProductForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [productForm.name, editingProduct]);

  // Blog Form auto slug generator
  useEffect(() => {
    if (!editingBlog && blogForm.title) {
      const generatedSlug = blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setBlogForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [blogForm.title, editingBlog]);

  // Dal ID auto generator
  useEffect(() => {
    if (!editingDal && dalForm.name) {
      const generatedId = dalForm.name.toLowerCase().replace(/[^a-z]+/g, "");
      setDalForm(prev => ({ ...prev, id: generatedId }));
    }
  }, [dalForm.name, editingDal]);

  // Product CRUD Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.slug || !productForm.price) {
      showToast("Please provide all required product details.", "error");
      return;
    }

    try {
      if (editingProduct && editingProduct._id) {
        await api.updateProduct(editingProduct._id, productForm);
        showToast("Product updated successfully!");
      } else {
        await api.createProduct(productForm);
        showToast("New Product created successfully!");
      }
      setActiveTab("products");
      loadTabData();
    } catch (err: any) {
      showToast(err.message || "Failed to save product.", "error");
    }
  };

  // Farmer CRUD Save
  const handleSaveFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerForm.name || !farmerForm.village || !farmerForm.crop) {
      showToast("Please fill all required farmer collective fields.", "error");
      return;
    }

    try {
      if (editingFarmer && editingFarmer._id) {
        await api.updateFarmer(editingFarmer._id, farmerForm);
        showToast("Farmer profile updated successfully!");
      } else {
        await api.createFarmer(farmerForm);
        showToast("New Farmer profile added successfully!");
      }
      setActiveTab("farmers");
      loadTabData();
    } catch (err: any) {
      showToast(err.message || "Failed to save farmer profile.", "error");
    }
  };

  // Blog CRUD Save
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.excerpt) {
      showToast("Please supply required blog fields.", "error");
      return;
    }

    try {
      const payload = {
        ...blogForm,
        date: blogForm.date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
      };
      if (editingBlog && editingBlog._id) {
        await api.updateBlog(editingBlog._id, payload);
        showToast("Blog post updated successfully!");
      } else {
        await api.createBlog(payload);
        showToast("New Blog post published successfully!");
      }
      setActiveTab("blogs");
      loadTabData();
    } catch (err: any) {
      showToast(err.message || "Failed to save blog post.", "error");
    }
  };

  // Dal CRUD Save
  const handleSaveDal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dalForm.name || !dalForm.id) {
      showToast("Please insert a name and identifier for the dal option.", "error");
      return;
    }

    try {
      if (editingDal && editingDal._id) {
        await api.updateDalOption(editingDal._id, dalForm);
        showToast("Dal blend option updated!");
      } else {
        await api.createDalOption(dalForm);
        showToast("Dal blend option created!");
      }
      setActiveTab("dalOptions");
      loadTabData();
    } catch (err: any) {
      showToast(err.message || "Failed to save dal blend option.", "error");
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status?: string, paymentStatus?: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status, paymentStatus);
      showToast(`Order status updated to "${updated.status}"`);
      
      // Update local state directly to feel instant
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status, paymentStatus: updated.paymentStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: updated.status, paymentStatus: updated.paymentStatus } : null);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update order status.", "error");
    }
  };

  // User Role update
  const handleUpdateUserRole = async (userId: string, currentRole: "customer" | "admin") => {
    const targetRole = currentRole === "admin" ? "customer" : "admin";
    try {
      await api.updateUserRole(userId, targetRole);
      showToast(`User role updated to ${targetRole}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: targetRole } : u));
    } catch (err: any) {
      showToast(err.message || "Failed to toggle user permissions.", "error");
    }
  };

  // Deletion Confirm Execution
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { id, type } = deleteConfirm;
    
    try {
      if (type === "product") {
        await api.deleteProduct(id);
        showToast("Product deleted successfully.");
      } else if (type === "farmer") {
        await api.deleteFarmer(id);
        showToast("Farmer profile removed.");
      } else if (type === "blog") {
        await api.deleteBlog(id);
        showToast("Blog article removed.");
      } else if (type === "dal") {
        await api.deleteDalOption(id);
        showToast("Dal option deleted.");
      } else if (type === "order") {
        await api.deleteOrder(id);
        showToast("Order transaction removed from database.");
      } else if (type === "review") {
        await api.deleteReview(id);
        showToast("Customer review deleted successfully.");
      }
      setDeleteConfirm(null);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || "Failed to execute database removal.", "error");
    }
  };

  // Edit action prefill triggers
  const triggerEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setActiveTab("product-form");
  };

  const triggerAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "", slug: "", shortDesc: "", category: "dals", price: 150, originalPrice: 200, weight: "500g", customizable: null, image: "/images/panchratan_dal.png", stock: 15
    });
    setActiveTab("product-form");
  };

  const triggerEditFarmer = (far: Farmer) => {
    setEditingFarmer(far);
    setFarmerForm({ ...far });
    setActiveTab("farmer-form");
  };

  const triggerAddFarmer = () => {
    setEditingFarmer(null);
    setFarmerForm({
      name: "", village: "", years: 10, crop: "", quote: "", image: "/images/farmer_ramesh.png"
    });
    setActiveTab("farmer-form");
  };

  const triggerEditBlog = (blg: BlogPost) => {
    setEditingBlog(blg);
    setBlogForm({ ...blg });
    setActiveTab("blog-form");
  };

  const triggerAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "", slug: "", type: "Recipe", excerpt: "", date: "", content: "", image: "/images/blog_dal_mix.png"
    });
    setActiveTab("blog-form");
  };

  const triggerEditDal = (dal: DalOption) => {
    setEditingDal(dal);
    setDalForm({ ...dal });
    setActiveTab("dal-form");
  };

  const triggerAddDal = () => {
    setEditingDal(null);
    setDalForm({
      id: "", name: "", desc: ""
    });
    setActiveTab("dal-form");
  };

  // View details order drawer
  const triggerViewOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setActiveTab("order-details");
  };

  const fetchUserAddresses = async (userRecord: User) => {
    setSelectedUserForAddresses(userRecord);
    setLoadingAddresses(true);
    try {
      const addrs = await api.getUserAddresses(userRecord.uid);
      setSelectedUserAddresses(addrs);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load saved addresses for this user.", "error");
      setSelectedUserForAddresses(null);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set standard colors
      const colorInk = "#1C1A16";
      const colorEarth = "#8B5E3C";
      const colorMuted = "#6b655c";

      // 1. Header (Brand Name & Tagline)
      doc.setFont("times", "bold");
      doc.setFontSize(26);
      doc.setTextColor(colorInk);
      doc.text("HADOTI FARMS", 20, 25);

      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(colorEarth);
      doc.text("Organically Grown, Stone-Ground & Traceable", 20, 30);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(colorMuted);
      doc.text("Bundi & Kota Soil Cooperatives, Rajasthan, India", 20, 35);
      doc.text("www.hadotifarms.com | support@hadotifarms.com", 20, 39);

      // 2. Right Side Header (Receipt details)
      doc.setFont("times", "bold");
      doc.setFontSize(18);
      doc.setTextColor(colorInk);
      doc.text("INVOICE RECEIPT", 190, 25, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(colorMuted);
      doc.text(`Receipt #: HF-${order.orderNumber}`, 190, 30, { align: "right" });
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
        190,
        35,
        { align: "right" }
      );

      // Divider line
      doc.setDrawColor(217, 210, 196); // border color #d9d2c4
      doc.setLineWidth(0.4);
      doc.line(20, 44, 190, 44);

      // 3. Billing & Shipping Address (Left) and Payment Info (Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(colorEarth);
      doc.text("DELIVERED TO:", 20, 53);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(colorInk);
      doc.text(order.shippingAddress.name, 20, 59);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(colorMuted);

      // Render shipping address lines
      const fullAddress = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pin}`;
      const addressLines = doc.splitTextToSize(fullAddress, 75);
      let addressY = 64;
      addressLines.forEach((line: string) => {
        doc.text(line, 20, addressY);
        addressY += 4.5;
      });
      doc.text(`Phone: ${order.shippingAddress.phone}`, 20, addressY);

      // Payment details on right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(colorEarth);
      doc.text("PAYMENT INFORMATION:", 115, 53);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(colorInk);
      doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 115, 59);
      doc.text(`Transaction Status: ${order.paymentStatus.toUpperCase()}`, 115, 63.5);
      doc.text(`Order Status: ${order.status.toUpperCase()}`, 115, 68);

      // 4. Items Table Header
      let tableY = Math.max(addressY + 12, 78);

      // Draw table header background
      doc.setFillColor(237, 232, 220); // Cream color #EDE8DC
      doc.rect(20, tableY, 170, 8, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(colorInk);
      doc.text("PRODUCT NAME", 24, tableY + 5.5);
      doc.text("SPECIFICATIONS / CUSTOMIZATION", 80, tableY + 5.5);
      doc.text("QTY", 148, tableY + 5.5, { align: "right" });
      doc.text("PRICE", 168, tableY + 5.5, { align: "right" });
      doc.text("TOTAL", 186, tableY + 5.5, { align: "right" });

      tableY += 8;

      // Render rows
      order.items.forEach((item: any) => {
        let nameY = tableY + 6;
        let specsY = tableY + 6;

        // Product Name
        doc.setFont("times", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(colorInk);
        const nameLines = doc.splitTextToSize(item.name, 52);
        nameLines.forEach((line: string) => {
          doc.text(line, 24, nameY);
          nameY += 4.5;
        });

        // Specifications
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(colorMuted);
        doc.text(`Pouch Size: ${item.weight}`, 80, specsY);
        specsY += 4;

        if (item.customization) {
          const customLines = doc.splitTextToSize(item.customization, 62);
          customLines.forEach((line: string) => {
            doc.text(line, 80, specsY);
            specsY += 3.5;
          });
        }

        // Qty, Price, Total aligning center vertically
        const rowHeight = Math.max(nameY - tableY, specsY - tableY) + 3;
        const middleY = tableY + rowHeight / 2 + 1;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(colorInk);
        doc.text(String(item.qty), 148, middleY, { align: "right" });
        doc.text(`₹${item.price}`, 168, middleY, { align: "right" });
        doc.text(`₹${item.price * item.qty}`, 186, middleY, { align: "right" });

        // Row Separator Line
        doc.setDrawColor(217, 210, 196);
        doc.setLineWidth(0.2);
        doc.line(20, tableY + rowHeight, 190, tableY + rowHeight);

        tableY += rowHeight;
      });

      // 5. Pricing summary block
      tableY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(colorMuted);
      doc.text("Subtotal:", 148, tableY, { align: "right" });
      doc.text(`₹${order.subtotal}`, 186, tableY, { align: "right" });

      tableY += 5;
      doc.text("Eco-Shipping:", 148, tableY, { align: "right" });
      doc.text(order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`, 186, tableY, { align: "right" });

      tableY += 5;
      doc.text("GST (Included):", 148, tableY, { align: "right" });
      doc.text("₹0.00", 186, tableY, { align: "right" });

      tableY += 7;
      doc.setDrawColor(217, 210, 196);
      doc.setLineWidth(0.4);
      doc.line(115, tableY - 4, 190, tableY - 4);

      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(colorInk);
      doc.text("Grand Total:", 148, tableY, { align: "right" });
      doc.text(`₹${order.total}`, 186, tableY, { align: "right" });

      // 6. Footer Heritage Note (Bottom of Page)
      const footerY = 265;
      doc.setDrawColor(217, 210, 196);
      doc.setLineWidth(0.3);
      doc.line(20, footerY - 5, 190, footerY - 5);

      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(colorEarth);
      doc.text("Thank you for choosing Hadoti Farms.", 105, footerY, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(colorMuted);
      doc.text("Every grain is slow-cleaned by hand, supporting smallholder farmers in Rajasthan.", 105, footerY + 4, { align: "center" });
      doc.text("Certified pesticide-free. Trace your batch via www.hadotifarms.com/standards", 105, footerY + 8, { align: "center" });

      // Save PDF document
      doc.save(`Invoice-HF-${order.orderNumber}.pdf`);
      showToast(`Invoice receipt HF-${order.orderNumber}.pdf downloaded successfully!`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      showToast("Failed to generate PDF receipt. Please try again.", "error");
    }
  };

  // -------------------------------------------------------------
  // VIEW RENDERERS
  // -------------------------------------------------------------

  if (authLoading) {
    return (
      <div className="login-bg">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p className="admin-role" style={{ marginTop: "10px" }}>Securing connection...</p>
        </div>
      </div>
    );
  }

  // Render Login state
  if (!user) {
    return (
      <div className="login-bg">
        <form className="login-card" onSubmit={handleLogin}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <img 
              src="/Creatives/darkLogo.png" 
              alt="Hadoti Farms Logo" 
              style={{ height: "64px", objectFit: "contain" }} 
            />
          </div>
          <h1 className="login-title">Hadoti Farms</h1>
          <p className="login-subtitle">Administrative Ecosystem Control</p>
          
          {loginError && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px", fontSize: "13px", color: "var(--accent-danger)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <span>⚠️</span> {loginError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@hadotifarms.com"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                style={{ paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  zIndex: 10
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "10px" }} disabled={isLoggingIn}>
            {isLoggingIn ? (
              <span className="spinner" style={{ width: "18px", height: "18px", borderTopColor: "var(--bg-primary)" }}></span>
            ) : (
              <>
                <Lock size={16} /> Authenticate Session
              </>
            )}
          </button>
          
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-glass)", fontSize: "11px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <p>Showcase Mode: Any email and password will grant access.</p>
            <p style={{ color: "var(--accent-gold)", fontWeight: "600" }}>🔒 Admin session persists securely inside local storage.</p>
          </div>
        </form>
      </div>
    );
  }

  // Sidebar Layout Navigation
  return (
    <div className="app-container animate-fade-in">
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      {/* Toast Alert Popups */}
      {successMessage && (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, background: "rgba(16, 185, 129, 0.95)", backdropFilter: "blur(8px)", color: "#000", padding: "14px 24px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600", fontSize: "14px", animation: "fadeInUp 0.3s" }}>
          <span>✨</span> {successMessage}
        </div>
      )}

      {error && (
        <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, background: "rgba(239, 68, 68, 0.95)", backdropFilter: "blur(8px)", color: "#fff", padding: "14px 24px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600", fontSize: "14px", animation: "fadeInUp 0.3s" }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ----------------- SIDEBAR ----------------- */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "20px 16px", borderBottom: "1px solid var(--border-glass)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <img src="/Creatives/darkLogo.png" alt="Hadoti Farms" style={{ height: "48px", objectFit: "contain" }} />
            <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1.5px", fontWeight: 700, textTransform: "uppercase", marginTop: "6px" }}>Admin Dashboard</div>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            title="Close Menu"
          >
            <X size={18} />
          </button>
        </div>
        
        <ul className="sidebar-nav">
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleTabClick("dashboard")}
            >
              <LayoutDashboard size={18} /> Dashboard
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => handleTabClick("users")}
            >
              <Users size={18} /> Users
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "products" ? "active" : ""}`}
              onClick={() => handleTabClick("products")}
            >
              <ShoppingBag size={18} /> Products
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => handleTabClick("orders")}
            >
              <ShoppingCart size={18} /> Orders
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "farmers" ? "active" : ""}`}
              onClick={() => handleTabClick("farmers")}
            >
              <Users size={18} /> Farmers Collective
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "blogs" ? "active" : ""}`}
              onClick={() => handleTabClick("blogs")}
            >
              <BookOpen size={18} /> Sun-Dried Blogs
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "dalOptions" ? "active" : ""}`}
              onClick={() => handleTabClick("dalOptions")}
            >
              <Sliders size={18} /> Bespoke Crops / Dals
            </a>
          </li>
          <li>
            <a 
              className={`sidebar-nav-item ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => handleTabClick("reviews")}
            >
              <MessageSquare size={18} /> Customer Reviews
            </a>
          </li>
        </ul>

        <div className="sidebar-footer" style={{ borderTop: "none", background: "transparent", padding: "20px 16px" }}>
          <button 
            className="btn-secondary" 
            style={{ 
              width: "100%", 
              background: "#e2e8f0", 
              border: "none", 
              color: "#334155", 
              fontWeight: 700, 
              padding: "11px", 
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }} 
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW ----------------- */}
      <main className="main-content">
        
        {/* TOP HEADER */}
        <header className="top-header">
          <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(true)}
              title="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <h2 className="header-title">
              {activeTab === "dashboard" && "Platform Diagnostic Health"}
              {activeTab === "products" && "Heritage Inventory Management"}
              {activeTab === "orders" && "Fulfillment Pipeline Operations"}
              {activeTab === "farmers" && "Hadoti Cooperatives Directory"}
              {activeTab === "blogs" && "Heirloom Stories & Recipes"}
              {activeTab === "dalOptions" && "Bespoke Customizer Configuration"}
              {activeTab === "reviews" && "Customer Review Feedback Control"}
              {activeTab === "users" && "User Access & Permissions Directory"}
              {activeTab === "blend-details" && "Bespoke Customizer Formulation Details"}
            </h2>
          </div>
          
          <div className="header-actions">
            <div className={isMockMode ? "mock-badge" : "live-badge"} onClick={toggleMockMode} title="Toggle Mock Environment Overrides">
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: isMockMode ? "var(--accent-secondary)" : "var(--accent-primary)" }}></span>
              {isMockMode ? "Showcase Sandbox Enforced" : "Live MongoDB Connected"}
            </div>
            
            <button className="btn-secondary" style={{ padding: "8px 12px" }} onClick={loadTabData} title="Refresh Database sync">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* PAGE DYNAMIC CONTAINER */}
        <div className="page-container">
          
          {loading && (
            <div className="spinner-wrapper" style={{ height: "400px" }}>
              <div className="spinner"></div>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Consulting database nodes...</p>
            </div>
          )}

          {!loading && (
            <div className="animate-fade-in-up">
              
              {/* ============================================================= */}
              {/* VIEW: DASHBOARD */}
              {/* ============================================================= */}
              {activeTab === "dashboard" && stats && (
                <div>
                  {/* Dashboard greetings block matching reference */}
                  <div className="dashboard-greeting animate-fade-in">
                    <div className="dashboard-greeting-subtitle">Welcome back,</div>
                    <h1 className="dashboard-greeting-title">Super Admin</h1>
                  </div>

                  <div className="stats-grid">
                    {/* Card 1: TOTAL SALES REVENUE */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Total Gross Sales</div>
                        <div className="kpi-info-val">₹{(stats.summary.totalSales || 0).toLocaleString()}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge green">Real-Time Receipts</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Gross revenue from orders</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box gold">
                        <ShoppingBag size={20} />
                      </div>
                    </div>

                    {/* Card 2: TOTAL CUSTOMER ORDERS */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Total Orders</div>
                        <div className="kpi-info-val">{stats.summary.totalOrders || 0}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge purple">Order Volume</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Pipeline registry items</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box purple">
                        <ShoppingCart size={20} />
                      </div>
                    </div>

                    {/* Card 3: PRODUCTS IN CATALOG */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Catalog Products</div>
                        <div className="kpi-info-val">{stats.summary.totalProducts || 0}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge green">Inventory Items</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Active crops & spices</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box green">
                        <Sliders size={20} />
                      </div>
                    </div>

                    {/* Card 4: COOPERATIVE GROWERS */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Cooperative Farmers</div>
                        <div className="kpi-info-val">{stats.summary.totalFarmers || 0}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge blue">Grower Members</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Hadoti farms collectives</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box blue">
                        <Users size={20} />
                      </div>
                    </div>

                    {/* Card 5: REGISTERED CUSTOMERS */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Registered Customers</div>
                        <div className="kpi-info-val">{stats.summary.totalUsers || 0}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge purple">Synced Accounts</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Active platform consumers</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box purple">
                        <UserCheck size={20} />
                      </div>
                    </div>

                    {/* Card 6: CUSTOMER REVIEWS */}
                    <div className="kpi-card">
                      <div>
                        <div className="kpi-info-label">Customer Reviews</div>
                        <div className="kpi-info-val">{stats.summary.totalReviews || 0}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                          <span className="trend-badge gold">Feedback Logs</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Active review entries</span>
                        </div>
                      </div>
                      <div className="kpi-icon-box gold">
                        <MessageSquare size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Charts grid */}
                  <div className="dashboard-main-grid">
                    
                    {/* SVG Interactive Line Chart */}
                    <div className="dashboard-panel">
                      <div className="panel-header">
                        <h3 className="panel-title">User Enrollment & Sales Timeline (Last 7 Days)</h3>
                        <div className="chart-legend">
                          <div className="chart-legend-item">
                            <span className="chart-legend-dot" style={{ background: "var(--accent-info)" }}></span> Gross Transactions (₹)
                          </div>
                        </div>
                      </div>
                      
                      <div className="chart-container">
                        <svg className="chart-svg" viewBox="0 0 500 220" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent-info)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="var(--accent-info)" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal Grid lines */}
                          <line x1="20" y1="30" x2="480" y2="30" className="chart-grid-line" />
                          <line x1="20" y1="80" x2="480" y2="80" className="chart-grid-line" />
                          <line x1="20" y1="130" x2="480" y2="130" className="chart-grid-line" />
                          <line x1="20" y1="180" x2="480" y2="180" className="chart-grid-line" />

                          {/* Render line path dynamically from stats */}
                          {(() => {
                            const data = stats.salesChartData || [];
                            if (data.length === 0) return null;
                            const maxVal = Math.max(...data.map(d => d.sales), 1000);
                            
                            // Transform coords: Width 20 to 480, Height 180 (min) to 30 (max)
                            const points = data.map((d, index) => {
                              const x = 20 + (index / (data.length - 1)) * 460;
                              const y = 180 - (d.sales / maxVal) * 150;
                              return { x, y, data: d };
                            });

                            const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                            const areaPath = `${linePath} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

                            return (
                              <>
                                <path d={areaPath} className="chart-area" />
                                <path d={linePath} className="chart-line" />
                                
                                {points.map((p, idx) => (
                                  <circle 
                                    key={idx} 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r="4" 
                                    className="chart-point"
                                    onMouseEnter={() => {
                                      setChartTooltip({
                                        x: p.x,
                                        y: p.y,
                                        text: `${p.data.date}: ₹${p.data.sales.toLocaleString()} (${p.data.count} Orders)`
                                      });
                                    }}
                                    onMouseLeave={() => setChartTooltip(null)}
                                  />
                                ))}
                              </>
                            );
                          })()}
                        </svg>

                        {/* Chart tooltip popup */}
                        {chartTooltip && (
                          <div 
                            className="chart-tooltip" 
                            style={{ 
                              left: `${(chartTooltip.x / 500) * 100}%`, 
                              top: `${(chartTooltip.y / 220) * 100}%` 
                            }}
                          >
                            {chartTooltip.text}
                          </div>
                        )}
                      </div>
                      
                      {/* X Axis Date Strings */}
                      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "15px", paddingRight: "15px", marginTop: "12px" }}>
                        {(stats.salesChartData || []).map((h, i) => (
                          <span key={i} className="chart-axis-text">{h.date}</span>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Product Category Distribution Bar Chart */}
                    <div className="dashboard-panel">
                      <h3 className="panel-title" style={{ marginBottom: "20px" }}>Catalog Category Distribution</h3>
                      <div className="chart-container" style={{ height: "200px" }}>
                        <svg className="chart-svg" viewBox="0 0 300 180" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="1" />
                              <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="1" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal Grid lines */}
                          <line x1="20" y1="20" x2="280" y2="20" className="chart-grid-line" />
                          <line x1="20" y1="60" x2="280" y2="60" className="chart-grid-line" />
                          <line x1="20" y1="100" x2="280" y2="100" className="chart-grid-line" />
                          <line x1="20" y1="140" x2="280" y2="140" className="chart-grid-line" />

                          {/* Render rounded gold vertical bars representing crops */}
                          {(() => {
                            const categoryDisplayNames: Record<string, string> = {
                              dals: "Dals",
                              masalas: "Spices",
                              grains: "Grains",
                              ration: "Ration",
                              hampers: "Hampers"
                            };

                            const categories = ["dals", "masalas", "grains", "ration", "hampers"];
                            const counts = categories.map(cat => stats?.categoriesCount?.[cat] || 0);
                            const maxVal = Math.max(...counts, 1);
                            
                            const barData = categories.map((cat) => {
                              const value = stats?.categoriesCount?.[cat] || 0;
                              const y = 140 - (value / maxVal) * 100;
                              return {
                                label: categoryDisplayNames[cat] || cat.toUpperCase(),
                                value,
                                y
                              };
                            });

                            return (
                              <>
                                {barData.map((bar, idx) => {
                                  const x = 32 + idx * 52;
                                  const width = 20;
                                  const height = 140 - bar.y;
                                  return (
                                    <g key={idx}>
                                      <rect 
                                        x={x} 
                                        y={bar.y} 
                                        width={width} 
                                        height={height} 
                                        rx="4" 
                                        fill="url(#bar-gradient)" 
                                        style={{ cursor: "pointer", transition: "var(--transition-smooth)" }}
                                      />
                                      <text x={x + 10} y="158" textAnchor="middle" className="chart-axis-text" style={{ fontSize: "9px", fontWeight: "700" }}>{bar.label}</text>
                                      <text x={x + 10} y={bar.y - 6} textAnchor="middle" style={{ fill: "var(--text-primary)", fontSize: "9px", fontWeight: "800" }}>{bar.value}</text>
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      <div className="chart-legend" style={{ marginTop: "10px", justifyContent: "center" }}>
                        <div className="chart-legend-item" style={{ fontSize: "11px" }}>
                          <span className="chart-legend-dot" style={{ background: "var(--accent-gold)" }}></span> Active items in database catalog
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Recent orders grid */}
                  <div className="dashboard-panel" style={{ marginBottom: "40px" }}>
                    <div className="panel-header">
                      <h3 className="panel-title">Pipeline Orders Waiting Fulfillment</h3>
                      <button className="btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => setActiveTab("orders")}>
                        Pipeline Registry <ArrowUpRight size={14} />
                      </button>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Order No</th>
                            <th>Customer Address</th>
                            <th>Date Place</th>
                            <th>Payment</th>
                            <th>Fulfillment Status</th>
                            <th>Total Gross</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(stats.recentOrders || []).map((ord) => (
                            <tr key={ord._id}>
                              <td style={{ fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--accent-gold)" }}>{ord.orderNumber}</td>
                              <td>
                                <div style={{ fontWeight: "600" }}>{ord.shippingAddress?.name}</div>
                                <div className="text-muted" style={{ fontSize: "12px" }}>{ord.shippingAddress?.city}, {ord.shippingAddress?.pin}</div>
                              </td>
                              <td className="text-muted">{new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                              <td>
                                <span className={`badge ${ord.paymentStatus === "cod" ? "cod" : "paid"}`}>{ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</span>
                              </td>
                              <td>
                                <span className={`badge ${ord.status}`}>{ord.status}</span>
                              </td>
                              <td style={{ fontWeight: "700" }}>₹{ord.total}</td>
                              <td>
                                <button className="btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => triggerViewOrder(ord)}>
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(stats.recentOrders || []).length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                📭 No orders processed yet in database.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Custom user blends logs */}
                  <div className="dashboard-panel">
                    <h3 className="panel-title" style={{ marginBottom: "20px" }}>Active Custom Blend Activity</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {(stats.recentBlends || []).map((blnd, i) => (
                        <div 
                          key={i} 
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "rgba(16, 185, 129, 0.04)", borderRadius: "12px", border: "1px solid var(--border-glass)", borderLeft: "4px solid var(--accent-primary)", cursor: "pointer", transition: "var(--transition-smooth)" }}
                          onClick={() => { setSelectedBlend(blnd); setActiveTab("blend-details"); }}
                          className="blend-card-hover"
                        >
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-dark)" }}>{blnd.name}</div>
                            <div className="text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>Custom Split Ratio: {blnd.customizationSummary} ({blnd.weight})</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="text-success" style={{ fontWeight: "750" }}>₹{blnd.price}</div>
                            <div className="text-muted" style={{ fontSize: "11px", marginTop: "2px" }}>{new Date(blnd.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                      {(stats.recentBlends || []).length === 0 && (
                        <p className="text-muted" style={{ fontSize: "13px", textAlign: "center" }}>No bespoke client blends mixed yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: PRODUCTS */}
              {/* ============================================================= */}
              {activeTab === "products" && (
                <div>
                  <div className="manager-toolbar">
                    <div className="search-input-wrapper">
                      <Search size={16} className="search-icon" />
                      <input 
                        type="text" 
                        className="form-control search-input" 
                        placeholder="Search product inventory..." 
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    
                    <button className="btn-primary" style={{ width: "auto" }} onClick={triggerAddProduct}>
                      <Plus size={16} /> Heritage Item
                    </button>
                  </div>

                  {/* Categories bar filter */}
                  <div className="category-filter-tabs" style={{ marginBottom: "30px" }}>
                    {["all", "dals", "masalas", "ration", "hampers", "grains"].map((cat) => (
                      <button 
                        key={cat} 
                        className={`filter-tab ${productCategory === cat ? "active" : ""}`}
                        onClick={() => setProductCategory(cat)}
                      >
                        {cat === "all" ? "All Grains & Spices" : cat.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Products Grid list */}
                  <div className="products-grid">
                    {products
                      .filter(p => {
                        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.shortDesc.toLowerCase().includes(productSearch.toLowerCase());
                        const matchesCat = productCategory === "all" || p.category === productCategory;
                        return matchesSearch && matchesCat;
                      })
                      .map((prod) => (
                        <div key={prod._id} className="product-admin-card">
                          <div className="product-card-img-box">
                            <img src={prod.image || "/images/panchratan_dal.png"} className="product-card-img" alt={prod.name} onError={(e) => { e.currentTarget.src = "/images/panchratan_dal.png" }} />
                            <span className="product-card-category">{prod.category}</span>
                          </div>
                          
                          <div className="product-card-body">
                            <h4 className="product-card-name">{prod.name}</h4>
                            <p className="product-card-desc">{prod.shortDesc}</p>
                            
                            <div className="product-card-meta" style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
                              <div>
                                {prod.originalPrice && prod.originalPrice > prod.price ? (
                                  <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                                    <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "12px" }}>₹{prod.originalPrice}</span>
                                    <span className="product-card-price" style={{ color: "var(--accent-primary)" }}>₹{prod.price}</span>
                                    <span style={{ color: "var(--accent-secondary)", fontSize: "11px", fontWeight: "bold" }}>
                                      ({Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF)
                                    </span>
                                  </span>
                                ) : (
                                  <span className="product-card-price">₹{prod.price}</span>
                                )}
                              </div>
                              <span className="product-card-weight">{prod.weight} baseweight</span>
                            </div>

                            <div style={{ marginTop: "14px", fontSize: "11px", color: "var(--accent-gold)", fontWeight: "600" }}>
                              ⚙️ Customizable: {prod.customizable || "Standard"}
                            </div>

                            <div style={{ marginTop: "6px", fontSize: "11.5px", fontWeight: "650", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: prod.stock === undefined || prod.stock > 0 ? (prod.stock !== undefined && prod.stock <= 3 ? "var(--accent-gold)" : "var(--accent-secondary)") : "var(--accent-danger)" }}></span>
                              <span>Stock Level: {prod.stock === undefined ? "10" : prod.stock} units</span>
                            </div>

                            <div className="product-card-actions">
                              <button className="btn-secondary" onClick={() => triggerEditProduct(prod)}>
                                <Edit2 size={12} /> Modify
                              </button>
                              <button className="btn-danger" onClick={() => setDeleteConfirm({
                                id: prod._id || "",
                                type: "product",
                                title: prod.name
                              })}>
                                <Trash2 size={12} /> Scrap
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {products.length === 0 && (
                      <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                        🗃️ Hadoti inventory catalog is currently empty. Start adding products.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: ORDERS */}
              {/* ============================================================= */}
              {activeTab === "orders" && (
                <div>
                  <div className="manager-toolbar">
                    <div className="search-input-wrapper">
                      <Search size={16} className="search-icon" />
                      <input 
                        type="text" 
                        className="form-control search-input" 
                        placeholder="Search order number or client..." 
                        value={orderSearch}
                        onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                      />
                    </div>

                    <div className="category-filter-tabs">
                      {["all", "placed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                        <button 
                          key={status}
                          className={`filter-tab ${orderStatusFilter === status ? "active" : ""}`}
                          onClick={() => { setOrderStatusFilter(status); setOrderPage(1); }}
                        >
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Tabular view */}
                  <div className="dashboard-panel">
                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Order Registry</th>
                            <th>Fulfillment Consignee</th>
                            <th>Transaction Timestamp</th>
                            <th>Total (Fee Included)</th>
                            <th>Financial Settlement</th>
                            <th>Logistics Status</th>
                            <th>Quick Dispatch Options</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const filtered = orders.filter(ord => {
                              const matchesSearch = ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                (ord.shippingAddress?.name || "").toLowerCase().includes(orderSearch.toLowerCase());
                              const matchesStatus = orderStatusFilter === "all" || ord.status === orderStatusFilter;
                              return matchesSearch && matchesStatus;
                            });

                            // Pagination slicing
                            const startIdx = (orderPage - 1) * ordersPerPage;
                            const paginated = filtered.slice(startIdx, startIdx + ordersPerPage);

                            return (
                              <>
                                {paginated.map((ord) => (
                                  <tr key={ord._id}>
                                    <td style={{ fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--accent-gold)" }}>{ord.orderNumber}</td>
                                    <td>
                                      <div style={{ fontWeight: "600" }}>{ord.shippingAddress?.name}</div>
                                      <div className="text-muted" style={{ fontSize: "12px" }}>{ord.shippingAddress?.phone}</div>
                                    </td>
                                    <td className="text-muted">{new Date(ord.createdAt).toLocaleString("en-US")}</td>
                                    <td style={{ fontWeight: "700" }}>₹{ord.total}</td>
                                    <td>
                                      <span className={`badge ${ord.paymentStatus === "cod" ? "cod" : "paid"}`}>{ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</span>
                                    </td>
                                    <td>
                                      <span className={`badge ${ord.status}`}>{ord.status}</span>
                                    </td>
                                    <td>
                                      <select 
                                        className="form-control" 
                                        style={{ fontSize: "12px", padding: "4px 8px", width: "130px", background: "#fff", border: "1px solid var(--border-glass)", color: "var(--text-primary)" }}
                                        value={ord.status}
                                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                      >
                                        <option value="placed">Placed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                      </select>
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", gap: "6px" }}>
                                        <button className="btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => triggerViewOrder(ord)}>
                                          Inspect
                                        </button>
                                        {ord.status !== "delivered" && ord.status !== "cancelled" && (
                                          <button className="btn-danger" style={{ padding: "6px 10px", fontSize: "12px", background: "var(--accent-danger)", color: "#fff", border: "none" }} onClick={() => handleUpdateOrderStatus(ord._id, "cancelled")}>
                                            Cancel
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {filtered.length === 0 && (
                                  <tr>
                                    <td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                                      📦 Order ledger contains no matched records.
                                    </td>
                                  </tr>
                                )}
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination buttons */}
                    {(() => {
                      const filtered = orders.filter(ord => {
                        const matchesSearch = ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          (ord.shippingAddress?.name || "").toLowerCase().includes(orderSearch.toLowerCase());
                        const matchesStatus = orderStatusFilter === "all" || ord.status === orderStatusFilter;
                        return matchesSearch && matchesStatus;
                      });
                      const totalPages = Math.ceil(filtered.length / ordersPerPage);
                      if (totalPages <= 1) return null;

                      return (
                        <div className="pagination-container">
                          <span className="text-muted" style={{ fontSize: "13px" }}>Displaying {Math.min(filtered.length, (orderPage - 1) * ordersPerPage + 1)}-{Math.min(filtered.length, orderPage * ordersPerPage)} of {filtered.length} orders</span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn-secondary" style={{ padding: "6px 10px" }} disabled={orderPage === 1} onClick={() => setOrderPage(p => p - 1)}>
                              <ChevronLeft size={16} />
                            </button>
                            <button className="btn-secondary" style={{ padding: "6px 10px" }} disabled={orderPage === totalPages} onClick={() => setOrderPage(p => p + 1)}>
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FARMERS */}
              {/* ============================================================= */}
              {activeTab === "farmers" && (
                <div>
                  <div className="manager-toolbar" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-primary" style={{ width: "auto" }} onClick={triggerAddFarmer}>
                      <Plus size={16} /> Add Farmer Profile
                    </button>
                  </div>

                  <div className="farmers-grid">
                    {farmers.map((farm) => (
                      <div key={farm._id} className="farmer-admin-card">
                        <div className="farmer-card-header">
                          <img src={farm.image || "/images/farmer_ramesh.png"} className="farmer-card-avatar" alt={farm.name} onError={(e) => { e.currentTarget.src = "/images/farmer_ramesh.png" }} />
                          <div>
                            <h4 className="farmer-card-name">{farm.name}</h4>
                            <div className="farmer-card-village">
                              <MapPin size={13} style={{ color: "var(--accent-gold)" }} /> Village: {farm.village}
                            </div>
                          </div>
                        </div>

                        <div className="farmer-card-stats">
                          <div className="farmer-stat-item">
                            <div className="farmer-stat-label">Heritage Experience</div>
                            <div className="farmer-stat-val text-success">{farm.years} Years</div>
                          </div>
                          <div className="farmer-stat-item">
                            <div className="farmer-stat-label">Native Primary Crop</div>
                            <div className="farmer-stat-val" style={{ color: "var(--accent-gold)" }}>{farm.crop}</div>
                          </div>
                        </div>

                        <p className="farmer-card-quote">"{farm.quote}"</p>

                        <div className="product-card-actions" style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "14px" }}>
                          <button className="btn-secondary" onClick={() => triggerEditFarmer(farm)}>
                            <Edit2 size={12} /> Edit Profile
                          </button>
                          <button className="btn-danger" onClick={() => setDeleteConfirm({
                            id: farm._id || "",
                            type: "farmer",
                            title: farm.name
                          })}>
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {farmers.length === 0 && (
                      <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                        👨‍🌾 Cooperative Farmers Ledger is empty. Get started adding growers.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: BLOGS */}
              {/* ============================================================= */}
              {activeTab === "blogs" && (
                <div>
                  <div className="manager-toolbar" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-primary" style={{ width: "auto" }} onClick={triggerAddBlog}>
                      <Plus size={16} /> Compose Article
                    </button>
                  </div>

                  <div className="blogs-grid">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="blog-admin-card">
                        <div className="blog-card-header">
                          <img src={blog.image || "/images/blog_dal_mix.png"} className="blog-card-img" alt={blog.title} onError={(e) => { e.currentTarget.src = "/images/blog_dal_mix.png" }} />
                          <span className="blog-card-type">{blog.type}</span>
                        </div>

                        <div className="blog-card-body">
                          <span className="blog-card-date">Published: {blog.date}</span>
                          <h4 className="blog-card-title">{blog.title}</h4>
                          <p className="blog-card-excerpt">{blog.excerpt}</p>
                          
                          <div className="blog-card-actions">
                            <button className="btn-secondary" onClick={() => triggerEditBlog(blog)}>
                              <Edit2 size={12} /> Edit Article
                            </button>
                            <button className="btn-danger" onClick={() => setDeleteConfirm({
                              id: blog._id || "",
                              type: "blog",
                              title: blog.title
                            })}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {blogs.length === 0 && (
                      <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                        ✍️ Hadoti storytelling blog repository is currently empty.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: BESPOKE CUSTOMIZATION OPTIONS */}
              {/* ============================================================= */}
              {activeTab === "dalOptions" && (
                <div>
                  <div className="manager-toolbar" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-primary" style={{ width: "auto" }} onClick={triggerAddDal}>
                      <Plus size={16} /> Blend Ingredient
                    </button>
                  </div>

                  <div className="dal-options-grid">
                    {dalOptions.map((opt) => (
                      <div key={opt._id} className="dal-option-card">
                        <h4 className="dal-option-name">{opt.name}</h4>
                        <p className="dal-option-desc">{opt.desc}</p>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "14px" }}>
                          ID: <code style={{ color: "var(--accent-primary)" }}>{opt.id}</code>
                        </div>

                        <div className="dal-option-actions">
                          <button className="btn-secondary" onClick={() => triggerEditDal(opt)}>
                            <Edit2 size={10} />
                          </button>
                          <button className="btn-danger" onClick={() => setDeleteConfirm({
                            id: opt._id || "",
                            type: "dal",
                            title: opt.name
                          })}>
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {dalOptions.length === 0 && (
                      <p className="text-muted" style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>No custom blend ingredients defined in system configurations.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: SYNERGETIC USERS */}
              {/* ============================================================= */}
              {activeTab === "users" && (
                <div className="dashboard-panel animate-fade-in">
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Synced User</th>
                          <th>Registered Email</th>
                          <th>Firebase Authentication UID</th>
                          <th>Authority Role Tier</th>
                          <th>Authority Operations</th>
                          <th>Integration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((cli) => (
                          <tr key={cli._id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img src={cli.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80"} style={{ width: "32px", height: "32px", borderRadius: "50%" }} alt={cli.displayName} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80" }} />
                                <span style={{ fontWeight: "600" }}>{cli.displayName || "Hadoti Customer"}</span>
                              </div>
                            </td>
                            <td>{cli.email}</td>
                            <td className="text-muted" style={{ fontSize: "12px" }}><code>{cli.uid}</code></td>
                            <td>
                              <span className={`badge ${cli.role === "admin" ? "delivered" : "placed"}`}>
                                {cli.role}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button 
                                  className="btn-secondary" 
                                  style={{ padding: "6px 12px", fontSize: "11px", width: "auto" }}
                                  onClick={() => fetchUserAddresses(cli)}
                                >
                                  Saved Addresses ({cli.addresses?.length || 0})
                                </button>
                                <button 
                                  className={cli.role === "admin" ? "btn-danger" : "btn-primary"} 
                                  style={{ padding: "6px 12px", fontSize: "11px", width: "auto" }}
                                  onClick={() => handleUpdateUserRole(cli._id, cli.role)}
                                >
                                  {cli.role === "admin" ? "Revoke System Admin" : "Promote to Admin"}
                                </button>
                              </div>
                            </td>
                            <td className="text-muted">{new Date(cli.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                              👥 No customer accounts synced to database yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: CUSTOMER REVIEWS */}
              {/* ============================================================= */}
              {activeTab === "reviews" && (
                <div className="dashboard-panel animate-fade-in">
                  <div className="manager-toolbar">
                    <div className="search-input-wrapper">
                      <Search size={18} className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search reviews by user, product, or comment..." 
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        className="form-control search-input"
                      />
                    </div>
                  </div>

                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Product</th>
                          <th>Rating</th>
                          <th>Comment</th>
                          <th>Date</th>
                          <th>Operations</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews
                          .filter((r) => {
                            const query = reviewSearch.toLowerCase();
                            return (
                              r.userName?.toLowerCase().includes(query) ||
                              r.productSlug?.toLowerCase().includes(query) ||
                              r.comment?.toLowerCase().includes(query)
                            );
                          })
                          .map((r, i) => (
                            <tr key={r._id || i}>
                              <td>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: "600" }}>{r.userName}</span>
                                  <span className="text-muted" style={{ fontSize: "10px" }}><code>{r.userUid}</code></span>
                                </div>
                              </td>
                              <td style={{ fontWeight: "500" }}>
                                <code style={{ color: "var(--accent-primary)" }}>{r.productSlug}</code>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "2px", color: "var(--accent-gold)" }}>
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star 
                                      key={idx} 
                                      size={12} 
                                      fill={idx < r.rating ? "currentColor" : "none"} 
                                      stroke="currentColor" 
                                      strokeWidth={idx < r.rating ? 0 : 1}
                                    />
                                  ))}
                                </div>
                              </td>
                              <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                                {r.comment}
                              </td>
                              <td className="text-muted">
                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Just now"}
                              </td>
                              <td>
                                <button 
                                  className="btn-danger" 
                                  style={{ padding: "6px 12px", fontSize: "11px", width: "auto" }}
                                  onClick={() => setDeleteConfirm({
                                    id: r._id || "",
                                    type: "review",
                                    title: `${r.userName}'s review on ${r.productSlug}`
                                  })}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        {reviews.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                              💬 No reviews found in the database.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE PRODUCT CREATION/UPDATE */}
              {/* ============================================================= */}
              {activeTab === "product-form" && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <h3 className="panel-title">{editingProduct ? "Modify Heritage Inventory Item" : "Introduce New Catalog Crop"}</h3>
                    <button className="btn-secondary" onClick={() => setActiveTab("products")}>
                      ← Back to Products
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveProduct} style={{ maxWidth: "600px" }}>
                    <div className="form-group">
                      <label className="form-label">Product Crop Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={productForm.name}
                        onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Pure Moong Dhuli"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Diagnostic slug URL (Unique ID) *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={productForm.slug}
                        onChange={(e) => setProductForm(p => ({ ...p, slug: e.target.value }))}
                        placeholder="e.g. pure-moong-dhuli"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Classification Category *</label>
                      <select 
                        className="form-control form-select"
                        value={productForm.category}
                        onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value as any }))}
                        required
                      >
                        <option value="dals">Split Dals</option>
                        <option value="masalas">Spices / Masalas</option>
                        <option value="grains">Whole Grains / Atta</option>
                        <option value="ration">Seasonal Ration Boxes</option>
                        <option value="hampers">Heritage Gift Hampers</option>
                      </select>
                    </div>

                    <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Original Price (MRP ₹) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={productForm.originalPrice || 0}
                          onChange={(e) => setProductForm(p => ({ ...p, originalPrice: Number(e.target.value) }))}
                          min="0"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={{ display: "flex", justifyContent: "between", alignItems: "center", width: "100%" }}>
                          <span style={{ flexGrow: 1 }}>Offer Price (Selling ₹) *</span>
                          {productForm.originalPrice && productForm.price && productForm.originalPrice > productForm.price ? (
                            <span style={{ color: "var(--accent-secondary)", fontSize: "11px", fontWeight: "bold" }}>
                              ({Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)}% OFF)
                            </span>
                          ) : null}
                        </label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={productForm.price}
                          onChange={(e) => setProductForm(p => ({ ...p, price: Number(e.target.value) }))}
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Baseline Weight Indicator *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={productForm.weight}
                          onChange={(e) => setProductForm(p => ({ ...p, weight: e.target.value }))}
                          placeholder="e.g. 500g, 1kg, 3kg"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Stock Quantity *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={productForm.stock === undefined ? 10 : productForm.stock}
                          onChange={(e) => setProductForm(p => ({ ...p, stock: Number(e.target.value) }))}
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bespoke Customizer Flag</label>
                      <select 
                        className="form-control form-select"
                        value={productForm.customizable || ""}
                        onChange={(e) => setProductForm(p => ({ ...p, customizable: e.target.value ? e.target.value : null }))}
                      >
                        <option value="">Standard Catalog Item (No Blend)</option>
                        <option value="dal">Split Custom Dal Configurator</option>
                        <option value="masala">Bespoke Kitchen Masala Blend</option>
                        <option value="grain">Calibrated Stone-Ground Atta</option>
                        <option value="ration">Seasonal Custom Staples box</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image Asset URL (Cloudinary or local)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={productForm.image || ""}
                        onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))}
                        placeholder="/images/panchratan_dal.png"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: "24px" }}>
                      <label className="form-label">Short Marketing Excerpt / Pitch *</label>
                      <textarea 
                        className="form-control" 
                        style={{ height: "120px", resize: "none" }}
                        value={productForm.shortDesc}
                        onChange={(e) => setProductForm(p => ({ ...p, shortDesc: e.target.value }))}
                        placeholder="Gently sun dried heirloom grains split the traditional way..."
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-glass)", paddingTop: "20px" }}>
                      <button className="btn-secondary" type="button" onClick={() => setActiveTab("products")} style={{ width: "auto" }}>Cancel</button>
                      <button className="btn-primary" type="submit" style={{ width: "auto" }}>Save Product Crop</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE DETAILED ORDER INSPECTOR */}
              {/* ============================================================= */}
              {activeTab === "order-details" && selectedOrder && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <div>
                      <h3 className="panel-title" style={{ fontSize: "18px" }}>Fulfillment Order Master Sheet</h3>
                      <span className="text-muted" style={{ fontSize: "12px" }}>Database ID: {selectedOrder._id}</span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button className="btn-primary" style={{ width: "auto", display: "flex", alignItems: "center", gap: "6px" }} onClick={() => handleDownloadInvoice(selectedOrder)}>
                        <span>📄</span> Download Invoice Receipt
                      </button>
                      <button className="btn-secondary" onClick={() => setActiveTab("orders")}>
                        ← Back to Orders
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px" }}>
                    {/* Left Column: Items and Billing */}
                    <div>
                      <div style={{ marginBottom: "24px" }}>
                        <h4 style={{ fontSize: "13px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                          📦 Items Scheduled for Dispatch
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {selectedOrder.items?.map((item) => (
                            <div key={item.id} style={{ display: "flex", gap: "14px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid var(--border-glass)", alignItems: "center" }}>
                              <img src={item.image || "/images/panchratan_dal.png"} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} alt={item.name} onError={(e) => { e.currentTarget.src = "/images/panchratan_dal.png" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "700", fontSize: "14px" }}>{item.name} ({item.weight})</div>
                                {item.customization && (
                                  <div style={{ color: "var(--accent-primary)", fontSize: "12.5px", marginTop: "2px", fontWeight: "600" }}>
                                    ✨ Bespoke Ratios: {item.customization}
                                  </div>
                                )}
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: "800", color: "var(--text-primary)" }}>₹{item.price}</div>
                                <div className="text-muted" style={{ fontSize: "12px" }}>Qty: {item.qty}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Billing invoice sum */}
                      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-glass)", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                        <div className="flex-between">
                          <span className="text-muted">Items Subtotal:</span>
                          <span>₹{selectedOrder.subtotal}</span>
                        </div>
                        <div className="flex-between">
                          <span className="text-muted">Eco Dispatch Delivery:</span>
                          <span>₹{selectedOrder.deliveryFee}</span>
                        </div>
                        <div className="flex-between" style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent-primary)", borderTop: "1px dashed var(--border-glass)", paddingTop: "10px", marginTop: "4px" }}>
                          <span>Gross Invoice:</span>
                          <span>₹{selectedOrder.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Status & Delivery Consignee */}
                    <div>
                      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-glass)", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                        <h4 style={{ fontSize: "13px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                          ⚙️ Fulfillment Pipeline Controls
                        </h4>
                        
                        <div className="flex-between">
                          <span className="text-muted">Order Registry Number:</span>
                          <span style={{ fontWeight: "800", color: "var(--accent-gold)", fontFamily: "var(--font-display)" }}>{selectedOrder.orderNumber}</span>
                        </div>

                        <div className="flex-between">
                          <span className="text-muted">Order Date:</span>
                          <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                        </div>

                        <div className="flex-between">
                          <span className="text-muted">Logistics State:</span>
                          <span className={`badge ${selectedOrder.status}`}>{selectedOrder.status}</span>
                        </div>

                        <div className="flex-between">
                          <span className="text-muted">Payment settlement:</span>
                          <span className={`badge ${selectedOrder.paymentStatus === "cod" ? "cod" : "paid"}`}>{selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})</span>
                        </div>

                        {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--border-glass)", paddingTop: "16px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {selectedOrder.status === "placed" && (
                                <button className="btn-primary" style={{ flex: 1, padding: "10px", fontSize: "13px" }} onClick={() => handleUpdateOrderStatus(selectedOrder._id, "processing")}>
                                  Process Order
                                </button>
                              )}
                              {(selectedOrder.status === "placed" || selectedOrder.status === "processing") && (
                                <button className="btn-primary" style={{ flex: 1, padding: "10px", fontSize: "13px", background: "var(--accent-primary)", border: "none" }} onClick={() => handleUpdateOrderStatus(selectedOrder._id, "shipped")}>
                                  Dispatch Order
                                </button>
                              )}
                              {selectedOrder.status === "shipped" && (
                                <button className="btn-primary" style={{ flex: 1, padding: "10px", fontSize: "13px", background: "var(--accent-gold)", border: "none", color: "#fff" }} onClick={() => handleUpdateOrderStatus(selectedOrder._id, "delivered", "paid")}>
                                  Deliver Order & Mark Paid
                                </button>
                              )}
                            </div>
                            <button className="btn-danger" style={{ width: "100%", padding: "10px", fontSize: "13px", background: "var(--accent-danger)", color: "#fff", border: "none" }} onClick={() => handleUpdateOrderStatus(selectedOrder._id, "cancelled")}>
                              Cancel Order & Return items to inventory
                            </button>
                          </div>
                        ) : (
                          <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", fontStyle: "italic", borderTop: "1px solid var(--border-glass)", paddingTop: "16px", margin: 0 }}>
                            ✅ Fulfillment transaction finalized.
                          </p>
                        )}
                      </div>

                      {/* Consignee Address */}
                      <div>
                        <h4 style={{ fontSize: "13px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                          📍 Consignee Shipping Address
                        </h4>
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-glass)", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div className="flex-between">
                            <span className="text-muted">Receiver Name:</span>
                            <span style={{ fontWeight: "700" }}>{selectedOrder.shippingAddress?.name}</span>
                          </div>
                          <div className="flex-between">
                            <span className="text-muted">Contact Phone:</span>
                            <span style={{ fontWeight: "700" }}>{selectedOrder.shippingAddress?.phone}</span>
                          </div>
                          <div className="flex-between">
                            <span className="text-muted">Deliver Address:</span>
                            <span style={{ fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{selectedOrder.shippingAddress?.address}</span>
                          </div>
                          <div className="flex-between">
                            <span className="text-muted">Location Hub:</span>
                            <span style={{ fontWeight: "700" }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pin}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE FARMER CREATION/UPDATE */}
              {/* ============================================================= */}
              {activeTab === "farmer-form" && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <h3 className="panel-title">{editingFarmer ? "Revise Cooperative Member" : "Induct New Grower"}</h3>
                    <button className="btn-secondary" onClick={() => setActiveTab("farmers")}>
                      ← Back to Farmers
                    </button>
                  </div>

                  <form onSubmit={handleSaveFarmer} style={{ maxWidth: "600px" }}>
                    <div className="form-group">
                      <label className="form-label">Grower Full Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Savitri Devi"
                        required
                      />
                    </div>

                    <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Heritage Village District *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={farmerForm.village}
                          onChange={(e) => setFarmerForm(p => ({ ...p, village: e.target.value }))}
                          placeholder="e.g. Bundi, Kota"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Farming Heritage Tenure (Years) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={farmerForm.years}
                          onChange={(e) => setFarmerForm(p => ({ ...p, years: Number(e.target.value) }))}
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Heirloom Crop *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={farmerForm.crop}
                        onChange={(e) => setFarmerForm(p => ({ ...p, crop: e.target.value }))}
                        placeholder="e.g. Urad Dal, Single-origin Haldi"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Farmer Profile Image URL</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={farmerForm.image || ""}
                        onChange={(e) => setFarmerForm(p => ({ ...p, image: e.target.value }))}
                        placeholder="/images/farmer_savitri.png"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: "24px" }}>
                      <label className="form-label">Direct Farm Quote / Philosophy *</label>
                      <textarea 
                        className="form-control" 
                        style={{ height: "120px", resize: "none" }}
                        value={farmerForm.quote}
                        onChange={(e) => setFarmerForm(p => ({ ...p, quote: e.target.value }))}
                        placeholder="Farming chemical-free keeps the Bundi black soil rich..."
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-glass)", paddingTop: "20px" }}>
                      <button className="btn-secondary" type="button" onClick={() => setActiveTab("farmers")} style={{ width: "auto" }}>Cancel</button>
                      <button className="btn-primary" type="submit" style={{ width: "auto" }}>Save Grower Profile</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE BLOG COMPOSER */}
              {/* ============================================================= */}
              {activeTab === "blog-form" && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <h3 className="panel-title">{editingBlog ? "Edit Farm Story / Recipe" : "Write Sun-Dried Story"}</h3>
                    <button className="btn-secondary" onClick={() => setActiveTab("blogs")}>
                      ← Back to Blogs
                    </button>
                  </div>

                  <form onSubmit={handleSaveBlog} style={{ maxWidth: "700px" }}>
                    <div className="form-group">
                      <label className="form-label">Article Headline *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. The Story of Mathania Chilli"
                        required
                      />
                    </div>

                    <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">SEO Permalink Slug *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm(p => ({ ...p, slug: e.target.value }))}
                          placeholder="e.g. mathania-chilli"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Publication Classification *</label>
                        <select 
                          className="form-control form-select"
                          value={blogForm.type}
                          onChange={(e) => setBlogForm(p => ({ ...p, type: e.target.value }))}
                          required
                        >
                          <option value="Recipe">Culinary Recipe</option>
                          <option value="Farm Story">Cooperative Farm Story</option>
                          <option value="Seasonal Guide">Seasonal Pantry Guide</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Thumbnail Image URL</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={blogForm.image || ""}
                        onChange={(e) => setBlogForm(p => ({ ...p, image: e.target.value }))}
                        placeholder="/images/blog_mathania_chilli.png"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short excerpt summary *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm(p => ({ ...p, excerpt: e.target.value }))}
                        placeholder="Brief synopsis shown on cards..."
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: "24px" }}>
                      <label className="form-label">Full Article Markdown Content *</label>
                      <textarea 
                        className="form-control" 
                        style={{ height: "240px", fontFamily: "var(--font-body)", resize: "vertical", fontSize: "13px" }}
                        value={blogForm.content}
                        onChange={(e) => setBlogForm(p => ({ ...p, content: e.target.value }))}
                        placeholder="Write complete heirloom content here. Supports markdown syntax..."
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-glass)", paddingTop: "20px" }}>
                      <button className="btn-secondary" type="button" onClick={() => setActiveTab("blogs")} style={{ width: "auto" }}>Cancel</button>
                      <button className="btn-primary" type="submit" style={{ width: "auto" }}>Publish article</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE BLEND OPTION WRAPPER */}
              {/* ============================================================= */}
              {activeTab === "dal-form" && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <h3 className="panel-title">{editingDal ? "Edit Ingredient specifications" : "Induct Blend Option"}</h3>
                    <button className="btn-secondary" onClick={() => setActiveTab("dalOptions")}>
                      ← Back to Options
                    </button>
                  </div>

                  <form onSubmit={handleSaveDal} style={{ maxWidth: "600px" }}>
                    <div className="form-group">
                      <label className="form-label">Ingredient Common Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={dalForm.name}
                        onChange={(e) => setDalForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Horse Gram"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ingredient Unique Identifier *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={dalForm.id}
                        onChange={(e) => setDalForm(p => ({ ...p, id: e.target.value }))}
                        placeholder="e.g. horsegram, kulthi"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: "24px" }}>
                      <label className="form-label">Ingredient Description / Properties *</label>
                      <textarea 
                        className="form-control" 
                        style={{ height: "120px", resize: "none" }}
                        value={dalForm.desc}
                        onChange={(e) => setDalForm(p => ({ ...p, desc: e.target.value }))}
                        placeholder="Highly protein dense monsoon crop traditional to Bundi wells..."
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-glass)", paddingTop: "20px" }}>
                      <button className="btn-secondary" type="button" onClick={() => setActiveTab("dalOptions")} style={{ width: "auto" }}>Cancel</button>
                      <button className="btn-primary" type="submit" style={{ width: "auto" }}>Save configurations</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW: FULL-PAGE DETAILED BESPOKE FORMULATION INSPECTOR */}
              {/* ============================================================= */}
              {activeTab === "blend-details" && selectedBlend && (
                <div className="dashboard-panel animate-fade-in-up">
                  <div className="panel-header" style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px", marginBottom: "24px" }}>
                    <div>
                      <h3 className="panel-title" style={{ fontSize: "18px" }}>Bespoke Customizer Formulation Sheet</h3>
                      <span className="text-muted" style={{ fontSize: "12px" }}>Database ID: {selectedBlend._id}</span>
                    </div>
                    <button className="btn-secondary" onClick={() => setActiveTab("dashboard")}>
                      ← Back to Dashboard
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px" }}>
                    {/* Left Column: Formulation details */}
                    <div>
                      <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-glass)", borderLeft: "5px solid var(--accent-primary)", marginBottom: "24px" }}>
                        <span className="badge processing" style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "800", marginBottom: "12px" }}>
                          ✨ Custom {selectedBlend.blendType?.toUpperCase() || "DAL"} formulation
                        </span>
                        
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px" }}>
                          {selectedBlend.name}
                        </h2>
                        
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
                          This recipe represents a client-configured personalized custom crop split mixed at Hadoti Farms.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                          <div className="flex-between" style={{ padding: "8px 0", borderBottom: "1px dashed var(--border-glass)" }}>
                            <span className="text-muted">Weight Selection:</span>
                            <span style={{ fontWeight: "700" }}>{selectedBlend.weight}</span>
                          </div>
                          <div className="flex-between" style={{ padding: "8px 0", borderBottom: "1px dashed var(--border-glass)" }}>
                            <span className="text-muted">Customizer Split Description:</span>
                            <span style={{ fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{selectedBlend.customizationSummary}</span>
                          </div>
                          <div className="flex-between" style={{ padding: "8px 0", fontSize: "18px", fontWeight: "800", color: "var(--accent-primary)", paddingTop: "10px" }}>
                            <span>Price Rate:</span>
                            <span>₹{selectedBlend.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Formulation Ratio Visualizer */}
                      <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-glass)" }}>
                        <h4 style={{ fontSize: "13px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
                          📊 Formulation Split Visualizer
                        </h4>

                        {(() => {
                          const summary = selectedBlend.customizationSummary || "";
                          const matches = Array.from(summary.matchAll(/([A-Za-z\s]+):\s*(\d+)%/g));
                          
                          if (matches.length === 0) {
                            return (
                              <p className="text-muted" style={{ fontSize: "13.5px", fontStyle: "italic", margin: 0 }}>
                                Standard preset formulation ratio. No individual ingredient split.
                              </p>
                            );
                          }

                          const colors = ["#10b981", "#f59e0b", "#6366f1", "#8b5cf6", "#ef4444"];

                          return (
                            <div>
                              {/* Segmented bar */}
                              <div style={{ display: "flex", height: "24px", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}>
                                {matches.map((match: any, idx: number) => {
                                  const name = match[1].trim();
                                  const percentage = Number(match[2]);
                                  const color = colors[idx % colors.length];
                                  return (
                                    <div 
                                      key={idx} 
                                      style={{ width: `${percentage}%`, background: color, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: "700" }}
                                      title={`${name}: ${percentage}%`}
                                    >
                                      {percentage}%
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Legend */}
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                                {matches.map((match: any, idx: number) => {
                                  const name = match[1].trim();
                                  const percentage = Number(match[2]);
                                  const color = colors[idx % colors.length];
                                  return (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                                      <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: color }}></span>
                                      <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{name}</span>
                                      <span className="text-muted">({percentage}%)</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Right Column: Synced Customer Meta */}
                    <div>
                      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-glass)", fontSize: "14px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        <h4 style={{ fontSize: "13px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                          👤 Creator Customer Record
                        </h4>

                        <div className="flex-between">
                          <span className="text-muted">Customer Firebase UID:</span>
                          <span style={{ fontWeight: "700" }}><code>{selectedBlend.userUid}</code></span>
                        </div>

                        <div className="flex-between">
                          <span className="text-muted">Date Created:</span>
                          <span>{new Date(selectedBlend.createdAt).toLocaleString()}</span>
                        </div>

                        <div className="flex-between">
                          <span className="text-muted">Synchronized state:</span>
                          <span className="badge delivered" style={{ fontSize: "9px" }}>active crop model</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* DIALOGUE: CONFIRMATION PROMPTS */}
      {/* ------------------------------------------------------------- */}
      {selectedUserForAddresses && (
        <div className="dialog-overlay" style={{ zIndex: 1100 }}>
          <div className="dialog-box" style={{ maxWidth: "480px", width: "90%" }}>
            <h3 className="dialog-title" style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "4px" }}>
              Saved Addresses
            </h3>
            <p className="dialog-desc" style={{ marginBottom: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
              Account Holder: <strong>{selectedUserForAddresses.displayName || "Hadoti Customer"}</strong> ({selectedUserForAddresses.email})
            </p>

            {loadingAddresses ? (
              <div className="spinner-wrapper" style={{ minHeight: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner"></div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "10px" }}>Retrieving address ledger...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
                {selectedUserAddresses.map((addr: any, idx: number) => (
                  <div key={addr._id || idx} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px", padding: "14px", fontSize: "13px", textAlign: "left" }}>
                    <div style={{ fontWeight: "700", marginBottom: "6px", color: "var(--accent-primary)", fontSize: "14px" }}>{addr.name}</div>
                    <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>{addr.address}</div>
                    <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>{addr.city}, {addr.state} - {addr.pin}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "8px", borderTop: "1px dashed var(--border-glass)", paddingTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>📞</span> {addr.phone}
                    </div>
                  </div>
                ))}
                {selectedUserAddresses.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "30px 10px" }}>
                    📍 No saved addresses associated with this customer profile.
                  </div>
                )}
              </div>
            )}

            <div className="dialog-actions" style={{ marginTop: "20px", borderTop: "1px solid var(--border-glass)", paddingTop: "14px" }}>
              <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setSelectedUserForAddresses(null)}>Close Addresses Ledger</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-icon">
              <Trash2 size={24} />
            </div>
            
            <h3 className="dialog-title">Execute Database Deletion</h3>
            <p className="dialog-desc">
              Are you absolutely sure you want to permanently delete the <strong>{deleteConfirm.title}</strong> record? This node operations cannot be undone.
            </p>

            <div className="dialog-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Abort</button>
              <button className="btn-primary" style={{ background: "var(--accent-danger)", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.15)" }} onClick={executeDelete}>Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminPanelContent />
    </AuthProvider>
  );
}

export default App;
