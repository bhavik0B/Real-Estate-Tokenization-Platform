const express = require("express");
const Contract = require("../models/LiquidityPoolRequests.js");

const postSellRequests = async (req, res) => {
    try {
        console.log(req.body)
        const { seller, tokenAddress, totalTokens , tokenName } = req.body;

        let existingRequest = await Contract.findOne({ seller, tokenAddress });

        if (existingRequest) {
            console.log("hr")
            existingRequest.totalTokens = totalTokens;
            await existingRequest.save();
            res.status(200).json({ message: "Sell request updated successfully", request: existingRequest });
        } else {
            const newRequest = new Contract({ seller, tokenAddress, totalTokens ,tokenName});
            await newRequest.save();
            res.status(201).json({ message: "Sell request created successfully", request: newRequest });
        }
    } catch (error) {
        res.status(500).json({ error: "Error creating/updating sell request" });
    }
}

const getSingleSellRequest=async(req,res)=>{
    try {
        const { seller, tokenAddress } = req.params;
        let existingRequest = await Contract.findOne({ seller, tokenAddress });
        console.log(existingRequest)

        if (existingRequest) {
            console.log("here")
            return res.status(200).json({ liquidityTokens:existingRequest.totalTokens});
        } else {
            return res.status(200).json({ liquidityTokens:0 });
        }
    } catch (error) {
        res.status(500).json({ error: "Get" });
    }
}

const getSellRequests = async (req, res) => {
    try {
        const requests = await Contract.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching sell requests" });
    }
}

const buyTokens = async (req, res) => {
    try {
        const { requestId, amount } = req.body;

        const request = await Contract.findById(requestId);
        if (!request) return res.status(404).json({ error: "Sell request not found" });

        if (amount >= request.totalTokens) {
            await Contract.findByIdAndDelete(requestId);
        } else {
            request.totalTokens -= amount;
            await request.save();
        }

        res.status(200).json({ message: "Tokens purchased successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error processing token purchase" });
    }
}

const mySellRequests = async (req, res) => {
    try {
        const seller = req.params.seller;
        const requests = await Contract.find({ seller });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching your sell requests" });
    }
}

const deleteSellRequest = async (req, res) => {
    try {
        await Contract.deleteMany({});
        res.status(200).json({ message: "All sell requests deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting sell requests" });
    }
}

module.exports = {getSingleSellRequest, getSellRequests, postSellRequests, mySellRequests, buyTokens, deleteSellRequest };
