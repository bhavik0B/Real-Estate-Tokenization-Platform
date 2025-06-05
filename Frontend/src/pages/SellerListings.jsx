import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import RealEstateTokenAbi from "../abi/RealEstateToken";
import SPVControls from "../components/common/SPVControls";
const SellerListings = () => {
  const { id } = useParams();
  const [sellers, setSellers] = useState([]);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [contract, setContract] = useState(null);
  const [buyAmount, setBuyAmount] = useState({});
  const [spvAddress, setSpvAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [newTokenAmount, setNewTokenAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [liquidityAmount, setLiquidityAmount] = useState(0);
  const [listedTokens, setListedTokens] = useState(0);
  const [listedLiquidityTokens, setListedLiquidityTokens] = useState(0);

  useEffect(() => {
    if(!window.ethereum)return;
    const transformContractDetails = (contractDetails) => {
      return contractDetails.map((item) => ({
        seller: item.walletId,
        tokensForSale: item.numOfTokens.toString(),
      }));
    };

    const fetchSellers = async () => {
      try {
        console.log(id)
        const response = await axios.get(`http://localhost:3000/api/token/get/${id}`)
        console.log(response.data)
        if (!Array.isArray(response.data)) {
          console.error("Expected an array, but got:", response.data);
          setSellers([]); // Set an empty array to prevent errors
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddr = await signer.getAddress();
        const newarr=transformContractDetails(response.data);
        const t=newarr.filter(s=>s.seller===userAddr);
        console.log(t)
        if(t.length>0){
          setListedTokens(t[0].tokensForSale);
        }
        setSellers(newarr);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    const setupContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddr = await signer.getAddress();
        setUserAddress(userAddr);
        const tokenContract = new ethers.Contract(id, RealEstateTokenAbi, signer);
        setContract(tokenContract);
        try {
          const price = await tokenContract.tokenPrice();
          console.log(price)

          setTokenPrice(ethers.formatEther(price));

          const spv = await tokenContract.spv();
          setSpvAddress(spv);

          const bal = await tokenContract.balanceOf(userAddr);
          const bigBal = BigInt(bal); // Convert bal to BigInt explicitly
          if (userAddr === spv) {
            setBalance(bigBal - BigInt(500000)); // Ensure subtraction involves BigInt values
          }
          else setBalance(bal)
          handleDisplayListing(id,userAddr)
        } catch (error) {
          console.error("Error fetching contract details:", error);
        }
      }
    };

    if (id) {
      fetchSellers();
      setupContract();
    }
  }, [id]);

  useEffect(() => {
    const bigBal = BigInt(balance);
    if (userAddress === spvAddress) {
      setBalance(bigBal - BigInt(500000)); // Ensure subtraction involves BigInt values
    }
  }, [userAddress, spvAddress])

  const handleUpdateListing = async () => {
    if (!contract) return alert("Contract not initialized!");

    if (balance <= 0) return alert("No tokens to list!");
    console.log(userAddress)

    const updatedAmount = newTokenAmount;
    if (updatedAmount < 0) return alert("Invalid token amount!");

    try {
      await axios.post("http://localhost:3000/api/token/add", {
        walletID: userAddress,
        numTokens: updatedAmount,
        contractId: id,
      });
      setListedTokens(Number(updatedAmount))
      setSellers((prevSellers) => {
        const updatedSellers = prevSellers.filter((s) => s.seller !== userAddress);
        return [{ seller: userAddress, tokensForSale: updatedAmount }, ...updatedSellers];
      });
    } catch (error) {
      console.error("Failed to update listing:", error);
    }
  };

  const handleBuy = async (seller) => {
    if (!contract) return alert("Contract not initialized!");
    
    const amount = Number(buyAmount[seller.seller]) || 0;
    
    if (amount <= 0 || amount > seller.tokensForSale) {
      
      return alert("Invalid amount!");
    }
    const val=amount * tokenPrice;
    try {
      const tx = await contract.transferToken(seller.seller, userAddress, amount, {
        value: ethers.parseEther((amount * tokenPrice).toString()),
      });

      await tx.wait();
      alert("Purchase successful!");

      // Update backend
      await axios.post("http://localhost:3000/api/token/del", {
        walletID: seller.seller,
        numTokens: amount,
        contractId: id
      });

      // Update frontend seller list
      setSellers((prevSellers) =>
        prevSellers.map((s) =>
          s.seller === seller.seller
            ? { ...s, tokensForSale: s.tokensForSale - amount }
            : s
        )
      );
      const name=await contract.name();
      axios.post("http://localhost:3000/api/transaction/set",{
        walletID:seller.seller,
        amount:val,
        propertyName:name,
        isBuy:true,
      })
      axios.post("http://localhost:3000/api/transaction/set",{
        walletID:userAddress,
        amount:val,
        propertyName:name,
        isBuy:false,
      })
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  const handleUpdateTokenPrice = async () => {
    if (!contract) return alert("Contract not initialized!");
    if (!newPrice || newPrice <= 0) return alert("Enter a valid price!");

    try {
      const tx = await contract.setTokenPrice(ethers.parseEther(newPrice));
      await tx.wait();
      setTokenPrice(newPrice);
      alert("Token price updated successfully!");
    } catch (error) {
      console.error("Error updating token price:", error);
    }
  };

  const handleListInLiquidityPool = async () => {
    if (!contract) return alert("Contract not initialized!");
    console.log(typeof(liquidityAmount))
    if (liquidityAmount <= 0 || liquidityAmount > balance) return alert("Invalid amount!");
    const tokenName = await contract.name();
    try {
      await axios.post("http://localhost:3000/api/liquidityPool/sell-request", {
        seller: userAddress,
        totalTokens: Number(liquidityAmount),
        tokenAddress: id,
        tokenName: tokenName,
      });
      setListedLiquidityTokens(liquidityAmount);
      alert("Tokens listed in liquidity pool successfully!");
    } catch (error) {
      console.error("Failed to list in liquidity pool:", error);
    }
  };

  const handleDisplayListing=async(contractAddress,userAdd)=>{
    try{
      const liquidity=await axios.get(`http://localhost:3000/api/liquidityPool/${contractAddress}/${userAdd}`);
      console.log(liquidity);
      setListedLiquidityTokens(liquidity.data.liquidityTokens);
           
    }catch(err){

    }
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-900 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {userAddress === spvAddress && (
            <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h2 className="text-xl font-bold text-center mb-4">SPV Controls</h2>

              {/* Update Token Price */}
              <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-3">
                <input
                  type="number"
                  className="bg-gray-800 text-white border border-gray-600 p-2 w-28"
                  placeholder="New Price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                <motion.button
                  onClick={handleUpdateTokenPrice}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                >
                  Update Price
                </motion.button>
              </div>

              <SPVControls contractAddress={id} userAddress={userAddress} />
            </motion.div>
          )}

          <motion.div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h1 className="text-2xl font-bold">Sellers for Token</h1>
            <p className="text-gray-400 break-all">Contract: {id}</p>
            {tokenPrice && <p className="mt-2 text-lg font-semibold text-blue-400">Price per Token: {tokenPrice} ETH</p>}
          </motion.div>
          <motion.div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
              <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <p className="text-white">Listed in Contract: {listedTokens}</p>
                <p className="text-white">Listed in Liquidity Pool: {listedLiquidityTokens}</p>
              </div>
            </motion.div>
          <motion.div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h2 className="text-xl font-semibold mb-4">Your Listing</h2>
            <div className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
              <p className="font-semibold break-all">Your Listing</p>
              <input
                type="number"
                min="0"
                max={(BigInt(balance)-BigInt(listedLiquidityTokens)).toString()}
                className="bg-gray-800 text-white border border-gray-600 p-1 w-20"
                value={newTokenAmount}
                onChange={(e) => setNewTokenAmount(e.target.value)}
              />
              <motion.button onClick={handleUpdateListing} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg">Save</motion.button>
            </div>

            <h2 className="text-xl font-semibold mb-4">List Tokens in Liquidity Pool</h2>
            <div className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
              <input
                type="number"
                min="0"
                max={(BigInt(balance) - BigInt(listedTokens)).toString()}
                className="bg-gray-800 text-white border border-gray-600 p-1 w-20"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
              />
              <motion.button onClick={handleListInLiquidityPool} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">List in Liquidity Pool</motion.button>
            </div>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">Available Sellers</h2>
            {sellers.filter((s) => s.seller !== userAddress && s.tokensForSale>0).length > 0 ? (
              <motion.div className="grid gap-4">
                {sellers.filter((s) => s.seller !== userAddress && s.tokensForSale>0).map((seller, index) => (
                  <motion.div key={index} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
                    {/* Seller Address */}
                    <p className="font-semibold break-all">{seller.seller}</p>

                    {/* Tokens Available */}
                    <p className="text-lg font-bold text-green-400">{seller.tokensForSale}</p>

                    {/* Buy Token Input and Button */}
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={seller.tokensForSale}
                        className="bg-gray-800 text-white border border-gray-600 p-1 w-20"
                        value={buyAmount[seller.seller] || ""}
                        onChange={(e) =>
                          setBuyAmount({ ...buyAmount, [seller.seller]: e.target.value })
                        }
                      />
                      <motion.button
                        onClick={() => handleBuy(seller)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Buy
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-gray-400 text-center">No sellers found for this token.</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerListings;
