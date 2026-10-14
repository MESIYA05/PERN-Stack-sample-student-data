require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();