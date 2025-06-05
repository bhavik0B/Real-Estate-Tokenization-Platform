const mongoose = require("mongoose");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE URL is missing in .env file.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;