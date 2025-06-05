const express = require("express");
const Contract = require("../models/Contract.js");

const getTokens = async (req, res) => {
    try {
        const {contractId } = req.params;
        const contract = await Contract.findOne({ contractId });
        if (!contract) {
            throw new Error("Contract not found");
        }
        res.status(200).json(contract.contractDetails);
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
}

const getAllTokens = async (req, res) => {
    try {
        const contracts = await Contract.find();
        // if (!contracts.length) {
        //     throw new Error("Contract not found");
        // }
        let contractMap = {};
        contracts.forEach(contract => {
            contractMap[contract.contractId] = {
                totalTokens: contract.totalTokens,
                location: contract.location
            };
        });

        res.status(200).json(contractMap);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong - please try again later!"
        });
    }
};


const setLocation = async (req, res) => {
    try {
        const { contractId, location } = req.body;
        const newContract = new Contract({
            contractId,
            location,
            totalTokens: 0,
            contractDetails: []
        });
        await newContract.save();
        res.status(201).json({ message: "Contract created successfully" });
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
};

const addTokens = async (req, res) => {
    try {
        const { walletID, numTokens, contractId } = req.body;

        let contract = await Contract.findOne({ contractId });

        const contractDetails = contract.contractDetails;

        const existingIndex = contractDetails.findIndex(detail => detail.walletId === walletID);

        const tokensToAdd = Number(numTokens);

        if (existingIndex !== -1) {
            const previousTokens = contractDetails[existingIndex].numOfTokens;
            contract.totalTokens += tokensToAdd - previousTokens;
            contractDetails[existingIndex].numOfTokens = tokensToAdd;
        }
        else {
            const newContract = { walletId: walletID, numOfTokens: tokensToAdd };
            contract.totalTokens += tokensToAdd;
            contractDetails.push(newContract);
        }

        await contract.save();

        res.status(200).json({ message: "Tokens updated successfully" });
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
};


const delTokens = async (req, res) => {
    try {
        const { walletID, numTokens, contractId } = req.body;

        const contract = await Contract.findOne({ contractId });

        if (!contract) {
            throw new Error("Contract not found");
        }

        const contractDetails = contract.contractDetails;

        const existingIndex = contractDetails.findIndex(detail => detail.walletId === walletID);

        if (existingIndex !== -1) {
            contractDetails[existingIndex].numOfTokens -= numTokens;
            contract.totalTokens -= numTokens;
            if (contractDetails[existingIndex].numOfTokens <= 0) {
                contractDetails.splice(existingIndex, 1);
            }
        }

        await contract.save();

        res.status(200).json({ message: "Tokens updated successfully" });
    } catch (error) {
        res.status(500).json({
            message:
                error.message ||
                "Something went wrong - please try again later!"
        });
    }
}

const deleteAllContracts = async (req, res) => {
    try {
        await Contract.deleteMany({});
        res.status(200).json({ message: "All contracts deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong - please try again later!"
        });
    }
};

module.exports = { getTokens, addTokens, delTokens, getAllTokens, setLocation ,deleteAllContracts};