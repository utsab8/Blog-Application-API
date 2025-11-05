const express = require("express");
const db = require("./src/Config/db");
const config = require("./src/Config/config");

// Import routes
const authRoutes = require("./src/Routes/authRoute");
const blogRoutes = require("./src/Routes/blogRoute");
const userRoutes = require("./src/Routes/userRoute");

const app = express();

const port = config.PORT || 10000;
app.use(express.json());

// Connect to the database
db.connect();

// Root route - fixes "Cannot GET /" error
app.get("/", (req, res) => {
  res.json({
    message: "Blog Application API is running",
    status: "success",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      blogs: "/api/v1/blogs"
    }
  });
});

// Static files
app.use("/public", express.static("public"));

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ 
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler (must have 4 parameters and come last)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    error: "Internal server error",
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});