import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import RealEstateTokenFactoryAbi from "../abi/RealEstateTokenFactory";
import { motion } from "framer-motion";

const FACTORY_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with deployed address

const CreatePropertyToken = () => {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const createRealEstateToken = async () => {
        if (!window.ethereum) return alert("MetaMask is not installed!");

        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const factoryContract = new ethers.Contract(
                FACTORY_CONTRACT_ADDRESS,
                RealEstateTokenFactoryAbi,
                signer
            );

            const spv = await signer.getAddress();
            const tx = await factoryContract.createRealEstateToken(spv, name, symbol);
            const receipt = await tx.wait();

            // Extract the contract address from the event logs
            const event = receipt.logs.find(log => log.address === FACTORY_CONTRACT_ADDRESS);
            if (!event) throw new Error("Contract address not found in event logs!");

            const newContractAddress = event.args[0];
            console.log("New contract deployed at:", newContractAddress);
            
            // Call backend API to store contract and location
            await axios.post("http://localhost:3000/api/token/setlocation", {
                contractId: newContractAddress,
                location: location,
            });

            alert(`Real estate token "${name}" created successfully!`);
            setName("");
            setSymbol("");
            setLocation("");
        } catch (error) {
            console.error("Error creating token:", error);
            alert("Transaction failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <motion.div 
                className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-center mb-6">Create Real Estate Token</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Property Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <motion.button
                        onClick={createRealEstateToken}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Token"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePropertyToken;
