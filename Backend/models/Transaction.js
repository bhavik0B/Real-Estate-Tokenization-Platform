const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: String,
        required: true,
    },
    transactionDetails: [
        {
            amount: {
                type: Number,
                required: true
            },
            propertyName: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            isBuy: {
                type: Boolean,
                required: true
            }
        }
    ]
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
