const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
    contractId: {
        type: String,
        required: true,
        unique: true
    },
    totalTokens: {
        type: Number,
        default: 0,
        required: true,
    },
    location: {
        type: String,
        default: "Pune",
        required: true,
    },
    contractDetails: [
        {
            walletId: {
                type: String,
                required: true
            },
            numOfTokens: {
                type: Number,
                required: true,
            }
        }
    ]
}, { timestamps: true });

const Contract = mongoose.model("Contract", ContractSchema);
module.exports = Contract;
