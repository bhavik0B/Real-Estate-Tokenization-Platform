import React from 'react';
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from "axios"

import RealEstateTokenFactoryAbi from "../abi/RealEstateTokenFactory";
import RealEstateTokenAbi from '../abi/RealEstateToken';
const FACTORY_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const TokenListing = () => {
  const navigate = useNavigate();

  const image=["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80","https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"]
  const [properties, setProperties] = useState([]);
  function getRandomImage(imageArray) {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  }
  
    useEffect(() => {
      async function fetchTokens() {
        if (!window.ethereum) return alert("MetaMask not detected");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factoryContract = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, RealEstateTokenFactoryAbi, signer);

        const tokenCount = await factoryContract.getTokenCount();
        let tokenList = [];

        const propData=await axios.get('http://localhost:3000/api/token/getall');
        console.log(propData.data);
        for (let i = 0; i < tokenCount; i++) {
          const tokenData = await factoryContract.getToken(i);
          console.log(tokenData[0])
          const tokenContract = new ethers.Contract(tokenData[0], RealEstateTokenAbi, signer);
          // Fetching additional details from the token contract
          console.log(propData.data[tokenData[0]].location);
          const name = await tokenContract.name();
          const symbol = await tokenContract.symbol();
          const totalTokens = await tokenContract.totalSupply();
          const tokenPrice = await tokenContract.tokenPrice();
          console.log(tokenPrice,totalTokens)
          tokenList.push({
            id: tokenData.tokenAddress,
            name: name,
            // location: "Unknown",
            location: propData.data[tokenData[0]].location,
            price: ethers.formatEther(totalTokens * tokenPrice), 
            tokens: ethers.formatUnits(totalTokens, 0),
            tokenPrice: ethers.formatEther(tokenPrice),
            occupancy: tokenData.isRented ? "Rented" : "Vacant",
            image: getRandomImage(image),
            tokensAvailable:propData.data[tokenData[0]].totalTokens,
            // tokensAvailable:0,
          });
        }

        setProperties(tokenList);
      }
      fetchTokens();
    }, []);




    return (
      <div className="pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            onClick={() => navigate('/create-token')}
          >
            Create Tokens
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Available Properties</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse our selection of tokenized properties. Each property has been carefully
              vetted and verified for secure, transparent investment opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                <div className="relative h-48">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {property.occupancy} 
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{property.name}</h3>
                  <p className="text-gray-400 mb-4">{property.location}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Property Value</p>
                      <p className="text-xl font-semibold">{property.price} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Token Price</p>
                      <p className="text-xl font-semibold">{property.tokenPrice} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Tokens</p>
                      <p className="text-xl font-semibold">{property.tokens}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Available Tokens</p>
                      <p className="text-xl font-semibold text-green-500">
                        {property.tokensAvailable}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors" onClick={()=>
                      navigate(`/seller-listing/${property.id}`)
                    }>
                      Buy Tokens
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  export default TokenListing;