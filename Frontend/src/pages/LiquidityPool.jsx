import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowUpDown, DollarSign, ShoppingCart } from 'lucide-react';
import { ethers } from 'ethers';
import LiquidityPoolAbi from '../abi/LiquidityPoolAbi';
import axios from 'axios';
import RealEstateTokenAbi from '../abi/RealEstateToken';
import RealEstateTokenFactoryAbi from '../abi/RealEstateTokenFactory';

const LIQUIDITY_POOL_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const FACTORY_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const LiquidityPool = () => {
  const [contract, setContract] = useState(null);
  const [factoryContract, setfactoryContract] = useState(null);
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  const [totalStakers, setTotalStakers] = useState('0');
  const [amount, setAmount] = useState('');
  const [sellRequests, setSellRequests] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [userStake, setUserStake] = useState('0');
  const [userProfit, setUserProfit] = useState('0');
  const [signer, setSigner] = useState(null);
  const [buyAmount, setBuyAmount] = useState({});
  const [availableTokens, setAvailableTokens] = useState([]);
  const [sellAmount, setSellAmount] = useState({});


  useEffect(() => {
    const set = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const poolContract = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, LiquidityPoolAbi, signer);
      setContract(poolContract);
      const factoryContract = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, RealEstateTokenFactoryAbi, signer);
      setfactoryContract(factoryContract);
      fetchPoolData(poolContract, signer);
      checkOwner(poolContract, signer);
      const det = await axios.get('http://localhost:3000/api/liquidityPool/sell-requests');
      setSellRequests(det.data);
      let tokens = [];
      const tokenCount = await factoryContract.getTokenCount();
      for (let i = 0; i < tokenCount; i++) {
        const tokenData = await factoryContract.getToken(i);
        const tokenAddress = tokenData[0];
        const tokenAmount = await poolContract.totalTokensInPool(tokenAddress);
        if (tokenAmount > 0){
          const tokenContract = new ethers.Contract(tokenAddress, RealEstateTokenAbi, signer);
          const tokenName = await tokenContract.name();
          const price = await tokenContract.tokenPrice();
          tokens.push({
            tokenAddress,
            tokenName,
            tokenAmount,
            price,
          });
        }
      }
      setAvailableTokens(tokens);

    }
    set();
  }, []);

  const fetchPoolData = async (contract, signer) => {
    const liquidity = await contract.totalLiquidity();
    const stakers = await contract.getTotalStakers();
    const user = await contract.investors(signer.address);
    setTotalLiquidity(ethers.formatEther(liquidity));
    setTotalStakers(stakers.toString());
    setUserStake(ethers.formatEther(user.ethInvested));
    setUserProfit(ethers.formatEther(user.profitShare));
  };

  const checkOwner = async (contract, signer) => {
    const owner = await contract.owner();
    setIsOwner(owner === signer.address);
  };

  const stakeEth = async () => {
    if (!contract || !amount) return;
    try {
      console.log(ethers.parseEther(amount));
      const tx = await contract.addLiquidity({ value: ethers.parseEther(amount) });
      await tx.wait();
      fetchPoolData(contract, signer);
    } catch (error) {
      console.error("Staking failed", error);
    }
  };

  const withdrawEth = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.withdrawEquity(ethers.parseEther(amount));
      await tx.wait();
      fetchPoolData(contract, signer);
    } catch (error) {
      console.error("Withdrawal failed", error);
    }
  };

  const withdrawProfit = async () => {
    if (!contract) return;
    try {
      const tx = await contract.withdrawProfits();
      await tx.wait();
      fetchPoolData(contract, signer);
    } catch (error) {
      console.error("Profit withdrawal failed", error);
    }
  };

  const distribute = async () => {
    if (!contract) return;
    try {
      console.log(ethers.parseEther(amount));
      const tx = await contract.distributeRent(ethers.parseEther(amount));
      await tx.wait();
    } catch (error) {
      console.error("Profit withdrawal failed", error);
    }
  };

  const buyToken = async (tokenAddress, amount, id, seller) => {
    if (!contract || !amount) return;
    console.log(tokenAddress, amount, seller)
    try {
      const ab = new ethers.Contract(tokenAddress, RealEstateTokenAbi, signer)
      const cc = await ab.balanceOf(seller);
      console.log(cc)
      const tx = await contract.sellTokens(tokenAddress, amount, seller);
      await tx.wait();
      await axios.post("http://localhost:3000/api/liquidityPool/buy-tokens", {
        requestId: id,
        amount: amount
      })
      fetchPoolData(contract, signer);
      setSellRequests((prevReq) =>
        prevReq
          .map((s) =>
            s._id === id
              ? { ...s, totalTokens: s.totalTokens - amount }
              : s
          )
          .filter((s) => s.totalTokens !== 0)
      );
    } catch (error) {
      console.error("Token purchase failed", error);
    }
  };

  const createSellRequest = async (tokenAddress, amount) => {
    if (!amount || isNaN(amount)) return;
    try {
      await axios.post("http://localhost:3000/api/token/add", {
        walletID: LIQUIDITY_POOL_ADDRESS,
        numTokens: Number(amount),
        contractId: tokenAddress,
      });
      setSellAmount((prev) => ({ ...prev, [tokenAddress]: '' }));
    } catch (err) {
      console.error("Failed to create sell request", err);
    }
  };
  

  return (
    <div className="pt-20 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Liquidity Pool</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6">Stake ETH</h2>
            <div className="space-y-4">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-slate-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={stakeEth} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <Coins className="h-5 w-5" />
                <span>Stake ETH</span>
              </button>
              <button onClick={withdrawEth} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <ArrowUpDown className="h-5 w-5" />
                <span>Withdraw ETH</span>
              </button>
              <button onClick={distribute} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <ArrowUpDown className="h-5 w-5" />
                <span>Distribute Profit</span>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold">Your Stake</h3>
              <p className="text-2xl font-bold text-blue-400">{userStake} ETH</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-lg font-semibold">Your Profit</h3>
              <p className="text-2xl font-bold text-green-400">{userProfit} ETH</p>
              <button onClick={withdrawProfit} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 mt-2 rounded-lg">Withdraw Profit</button>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <Coins className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="text-lg font-semibold">Total Stakers</h3>
              <p className="text-2xl font-bold text-purple-400">{totalStakers}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold">Total Liquidity</h3>
              <p className="text-2xl font-bold text-blue-400">{totalLiquidity} ETH</p>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold mb-6">Available Tokens in Pool</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th>Token Name</th>
                  <th>Amount in Pool</th>
                  <th>Token Price</th>
                  {isOwner && <th>Sell Amount</th>}
                  {isOwner && <th>Action</th>}
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {availableTokens.map((token) => (
                  <tr key={token.tokenAddress} className="border-t border-gray-700">
                    <td>{token.tokenName}</td>
                    <td>{token.tokenAmount.toString()}</td>
                    <td>{ethers.formatEther(token.price)} ETH</td>
                    {isOwner && (
                      <>
                        <td>
                          <input
                            type="number"
                            value={sellAmount[token.tokenAddress] || ''}
                            onChange={(e) =>
                              setSellAmount({
                                ...sellAmount,
                                [token.tokenAddress]: e.target.value,
                              })
                            }
                            placeholder="Amount"
                            className="w-20 bg-slate-700/50 rounded-lg py-1 px-2 text-white placeholder-gray-400 focus:outline-none"
                          />
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              createSellRequest(
                                token.tokenAddress,
                                sellAmount[token.tokenAddress]
                              )
                            }
                            className="bg-yellow-600 px-3 py-2 rounded-lg text-white"
                          >
                            List
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {isOwner && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6">Sell Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th>Seller</th>
                    <th>Tokens</th>
                    <th>Token Name</th>
                    <th>Buy Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {sellRequests.map((request) => (
                    <tr key={request._id} className="border-t border-gray-700">
                      <td>{request.seller}</td>
                      <td>{request.totalTokens}</td>
                      <td>{request.tokenName}</td>
                      <td>
                        <input
                          type="number"
                          value={buyAmount[request._id] || ''}
                          min="1"
                          max={request.totalTokens}
                          onChange={(e) => setBuyAmount({ ...buyAmount, [request._id]: e.target.value })}
                          placeholder="Amount"
                          className="w-20 bg-slate-700/50 rounded-lg py-1 px-2 text-white placeholder-gray-400 focus:outline-none"
                        />
                      </td>
                      <td>
                        <button onClick={() => buyToken(request.tokenAddress, buyAmount[request._id], request._id, request.seller)} className="bg-green-600 px-3 py-2 rounded-lg text-white flex items-center">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LiquidityPool;
