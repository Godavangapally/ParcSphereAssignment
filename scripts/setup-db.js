const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function setupDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("pracsphere");

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("tasks").createIndex({ userId: 1 });
    console.log("✅ Created indexes");

    // Check if demo user exists
    const existingUser = await db.collection("users").findOne({
      email: "demo@pracsphere.com",
    });

    if (!existingUser) {
      // Create demo user
      const hashedPassword = await bcrypt.hash("Demo123!", 10);
      await db.collection("users").insertOne({
        name: "Demo User",
        email: "demo@pracsphere.com",
        password: hashedPassword,
        createdAt: new Date(),
      });
      console.log("✅ Created demo user (demo@pracsphere.com / Demo123!)");
    } else {
      console.log("ℹ️  Demo user already exists");
    }

    console.log("\n🎉 Database setup complete!");
    console.log("\nYou can now:");
    console.log("1. Run 'pnpm dev' to start the application");
    console.log("2. Login with: demo@pracsphere.com / Demo123!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  require("dotenv").config({ path: "./apps/web/.env.local" });
  setupDatabase();
}

module.exports = { setupDatabase };