const mongoose = require("mongoose");

const LiquidityPoolRequestsSchema = new mongoose.Schema({
    seller: { type: String, required: true }, // Investor's wallet address
    tokenAddress: { type: String, required: true }, // Real estate token contract address
    totalTokens: { type: Number, required: true }, // Total tokens the seller wants to sell
    tokenName: { type: String, required: true }, // Name of the token
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LiquidityPoolRequests", LiquidityPoolRequestsSchema);
