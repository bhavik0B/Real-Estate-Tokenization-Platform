import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, LineChart, Building2, History, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { ethers } from 'ethers';
import RealEstateTokenAbi from '../abi/RealEstateToken';
import RealEstateTokenFactoryAbi from '../abi/RealEstateTokenFactory';

const FactoryAdd = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [signer, setSigner] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [properties, setProperties] = useState(0);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddr = await signer.getAddress();
        setSigner(signer);
        const response = await axios.get(`http://localhost:3000/api/transaction/${userAddr}`);
        setRecentTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    const fetchStats = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factory = new ethers.Contract(FactoryAdd, RealEstateTokenFactoryAbi, signer);
        const tokenCount = await factory.getTokenCount();

        let totalTokens = BigInt(0);
        let totalValue = BigInt(0);
        let prop = 0;
        for (let i = 0; i < tokenCount; i++) {
          const tokenData = await factory.getToken(i);
          const tokenContract = new ethers.Contract(tokenData[0], RealEstateTokenAbi, signer);

          // Fetch token price and user balance
          const tokenPrice = await tokenContract.tokenPrice(); // Returns BigInt
          const userBalance = await tokenContract.balanceOf(await signer.getAddress()); // Returns BigInt
          console.log(userBalance)
          if (userBalance > 0) prop++;
          // Accumulate total tokens and total value
          totalTokens += userBalance;
          totalValue += userBalance * tokenPrice;
        }

        // Convert BigInt values to readable format
        const formattedTotalTokens = ethers.formatUnits(totalTokens, 0); // Integer value
        const formattedTotalValue = ethers.formatEther(totalValue); // ETH value

        console.log("Total Tokens:", formattedTotalTokens);
        console.log("Total Value:", formattedTotalValue);
        setTotalTokens(formattedTotalTokens);
        setTotalValue(formattedTotalValue);
        setProperties(prop);

      } catch (err) {
        console.error("Error fetching stats:", err);
        return { totalTokens: "0", totalValue: "0" };
      }
    };

    fetchTransactions();
    fetchStats();
  }, []);
  console.log(recentTransactions)
  const portfolioStats = {
    totalValue: '125,000',
    totalTokens: '50,000',
    properties: '3',
    profit: '+12.5%'
  };



  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Dashboard Overview
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[{
            icon: <Wallet className="h-8 w-8 text-blue-400" />,
            label: 'Portfolio Value',
            value: `${totalValue} ETH`,
            color: 'blue'
          },
          {
            icon: <Building2 className="h-8 w-8 text-purple-400" />,
            label: 'Total Tokens',
            value: totalTokens,
            color: 'purple'
          },
          {
            icon: <LineChart className="h-8 w-8 text-green-400" />,
            label: 'Properties',
            value: properties,
            color: 'green'
          }].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700 hover:border-opacity-80 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="bg-gray-700 p-4 rounded-lg">{stat.icon}</div>
                <ArrowUpRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-2 text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
              <History className="h-6 w-6" /> Recent Transactions
            </h2>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-gray-400">No recent transactions.</p>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {recentTransactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                      <div>
                        <p className="font-medium text-white">{tx.propertyName}</p>
                        <p className="text-sm text-gray-400">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.isBuy ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.isBuy ? '+' : '-'}{tx.amount} ETH
                        </p>
                        <p className="text-sm text-gray-400">{tx.isBuy ? "Sold" : "Bought"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
