# 🏠 Real Estate Tokenization Platform

A decentralized platform that enables tokenization of real estate properties, facilitates fractional ownership through token trading, and allows users to stake ETH in a liquidity pool for profit sharing.

---

## 🚀 Features

- **Token Factory**: Create and deploy token contracts for properties.
- **Liquidity Pool**: Stake ETH and earn profit from transaction fees.
- **Sell Requests**: Property token holders can request to sell their tokens.
- **SPV Role**: Authorized users (SPVs) can buy back tokens and update property details.
- **Real-Time Dashboard**: View staked ETH, profits, tokens in pool, and ongoing sell requests.

---

## 🧱 Tech Stack

### Frontend
- React
- TailwindCSS
- Framer Motion
- Ethers.js

### Backend
- Node.js
- Express
- MongoDB
- Axios

### Blockchain
- Solidity
- Hardhat
- Ethers.js

---

## 📦 Contracts Overview

- `RealEstateTokenFactory.sol`: Deploys new property tokens
- `RealEstateToken.sol`: ERC20-based token with SPV role
- `LiquidityPool.sol`: Manages ETH staking, profits, and token buyback

---

## 💡 How It Works

1. SPV deploys new property tokens using the factory.
2. Users can purchase tokens and stake ETH in the liquidity pool.
3. Token holders can request to sell their tokens.
4. Buyer sees requests and buys tokens from the pool.
5. Liquidity providers earn a share of the profits.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/bhavik0B/Real-Estate-Tokenization-Platform.git

cd RealEstateTokenization
```
### 2. Install Dependencies

Frontend
```bash
cd Frontend
npm install
```

Backend
```bash
cd Backend
npm install
```

### 3. Run Contracts with Hardhat

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deployLP.js --network localhost
```

### 4. Start the Backend Server

```bash
cd Backend
npm run dev
```

### 5. Start the Frontend Server

```bash
cd Frontend
npm run dev
```
