const express = require("express");
const cookieParser = require("cookie-parser");
//const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
//const cartRoutes = require("./routes/cart.routes");
//const orderRoutes = require("./routes/order.routes");

const app = express();

/* ✅ CORS Setup
app.use(cors({
  origin: "https://your-netlify-site.netlify.app", // <-- এখানে তোমার Netlify frontend URL দাও
  credentials: true, // Cookie পাঠানোর অনুমতি দেবে
}));
*/
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
//app.use("/api/cart", cartRoutes);
//app.use("/api/order", orderRoutes);

module.exports = app;
