import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import RealEstateTokenAbi from "../../abi/RealEstateToken";

const SPVControls = ({ contractAddress, userAddress }) => {
  const [contract, setContract] = useState(null);
  const [isRented, setIsRented] = useState(false);
  const [rentalAmount, setRentalAmount] = useState("");

  useEffect(() => {
    const setupContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, RealEstateTokenAbi, signer);
        setContract(tokenContract);
      }
    };

    setupContract();
  }, [contractAddress]);

  const handleSetRentalStatus = async () => {
    if (!contract) return alert("Contract not initialized!");
    
    try {
      const tx = await contract.setRentalStatus(isRented, ethers.parseEther(rentalAmount));
      await tx.wait();
      alert("Rental status updated!");
    } catch (error) {
      console.error("Failed to set rental status:", error);
    }
  };

  const handleDistributeRent = async () => {
    if (!contract) return alert("Contract not initialized!");
  
    try {
      // Fetch rental income from the smart contract
      const rentalIncome = await contract.rentalIncome();
      const rentalIncomeInEther = ethers.formatEther(rentalIncome);
  
      if (rentalIncomeInEther <= 0) return alert("No rental income to distribute!");
  
      console.log(`Distributing ${rentalIncomeInEther} ETH as rent...`);
  
      const tx = await contract.distributeRentalIncome({
        value: rentalIncome, // Pass the fetched rental income as msg.value
      });
  
      await tx.wait();
      alert("Rent distributed successfully!");
    } catch (error) {
      console.error("Failed to distribute rent:", error);
    }
  };
  

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4">SPV Controls</h2>

      {/* Set Rental Status */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="font-semibold">Rental Status:</label>
        <select
          value={isRented}
          onChange={(e) => setIsRented(e.target.value === "true")}
          className="bg-gray-700 p-2 rounded"
        >
          <option value="true">Rented</option>
          <option value="false">Not Rented</option>
        </select>
      </div>

      {/* Rental Amount */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="font-semibold">Rental Amount (ETH):</label>
        <input
          type="number"
          min="0"
          className="bg-gray-700 text-white border border-gray-600 p-1 w-32"
          value={rentalAmount}
          onChange={(e) => setRentalAmount(e.target.value)}
        />
      </div>

      <button
        onClick={handleSetRentalStatus}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg mr-4"
      >
        Set Rental Status
      </button>

      {/* Distribute Rent */}
      <button
        onClick={handleDistributeRent}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Distribute Rent
      </button>
    </div>
  );
};

export default SPVControls;
