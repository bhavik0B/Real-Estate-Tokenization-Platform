const express = require("express");
const Transaction = require("../models/Transaction.js");

const getTransaction = async (req, res) => {
    try {
        const { walletID } = req.params;
        
        const transaction = await Transaction.findOne({ walletId: walletID });
        console.log(transaction)
        if (!transaction) {
            return res.status(200).json([]);
        }

        res.status(200).json(transaction.transactionDetails);
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
}

const setTransaction = async (req, res) => {
    try {
        const { walletID, amount, propertyName, isBuy } = req.body;

        let transaction = await Transaction.findOne({ walletId: walletID });

        if (!transaction) {
            transaction = new Transaction({
                walletId : walletID,
                transactionDetails: []
            });
        }

        const transactionDetails = transaction.transactionDetails;

        const newTransaction = {
            amount: amount,
            propertyName: propertyName,
            isBuy: isBuy
        }

        transactionDetails.push(newTransaction);

        await transaction.save();

        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
};

const deleteAllContracts = async (req, res) => {
    try {
        await Transaction.deleteMany({});
        res.status(200).json({ message: "All contracts deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong - please try again later!"
        });
    }
};

module.exports = { getTransaction, setTransaction , deleteAllContracts};
