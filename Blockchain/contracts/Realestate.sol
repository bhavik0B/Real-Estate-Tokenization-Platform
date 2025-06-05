// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateTokenFactory is Ownable {
    struct RealEstateToken {
        address tokenAddress;
        address spv;
        uint256 tokenPrice;
        uint256 lastPriceUpdate;
        bool isRented;
        uint256 rentalIncome;
    }

    uint256 public constant UPDATE_INTERVAL = 180 days;
    uint256 public constant PENALTY_AMOUNT = 5 ether;

    RealEstateToken[] public realEstateTokens;

    event TokenCreated(address indexed tokenAddress, address indexed spv);

    constructor() Ownable(msg.sender) {}

    function createRealEstateToken(
        address _spv,
        string memory name,
        string memory symbol
    ) external {
        require(_spv != address(0), "Invalid SPV address");
        RealEstate newToken = new RealEstate(_spv, name, symbol);
        realEstateTokens.push(
            RealEstateToken({
                tokenAddress: address(newToken),
                spv: _spv,
                tokenPrice: 0.01 ether,
                lastPriceUpdate: block.timestamp,
                isRented: false,
                rentalIncome: 0
            })
        );
        emit TokenCreated(address(newToken), _spv);
    }

    function getTokenCount() public view returns (uint256) {
        return realEstateTokens.length;
    }

    function getToken(
        uint256 index
    ) public view returns (RealEstateToken memory) {
        require(index < realEstateTokens.length, "Index out of bounds");
        return realEstateTokens[index];
    }
}

contract RealEstate is ERC20, Ownable {
    address public spv;
    uint256 public constant TOTAL_SUPPLY = 1_000_000;
    uint256 public constant SPV_MINIMUM_SHARE = (TOTAL_SUPPLY * 51) / 100;
    uint256 public tokenPrice;
    uint256 public lastPriceUpdate;
    uint256 public constant UPDATE_INTERVAL = 180 days;
    uint256 public constant PENALTY_AMOUNT = 5 ether;
    bool public isRented;
    uint256 public rentalIncome;

    mapping(address => uint256) public equity;
    address[] public investors;

    constructor(
        address _spv,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(_spv) {
        require(_spv != address(0), "Invalid SPV address");
        spv = _spv;
        _mint(spv, TOTAL_SUPPLY);
        equity[spv] = TOTAL_SUPPLY;
        lastPriceUpdate = block.timestamp;
        tokenPrice = 0.01 ether;
        investors.push(_spv);
    }

    function setTokenPrice(uint256 newPrice) external payable onlyOwner {
        require(msg.sender == spv, "Only SPV can update price");
        if (block.timestamp > lastPriceUpdate + UPDATE_INTERVAL) {
            require(msg.value == PENALTY_AMOUNT, "SPV must pay penalty in ETH");
            _distributePenalty();
        }
        tokenPrice = newPrice;
        lastPriceUpdate = block.timestamp;
    }

    function transferToken(
        address seller,
        address buyer,
        uint256 amount
    ) public payable {
        require(
            balanceOf(seller) >= amount,
            "Seller does not have enough tokens"
        );
        require(msg.value == amount * tokenPrice, "Incorrect ETH amount sent");
        if (seller == spv) {
            require(
                balanceOf(seller) - amount >= SPV_MINIMUM_SHARE,
                "SPV must retain at least 51%"
            );
        }
        payable(seller).transfer(msg.value);
        _transfer(seller, buyer, amount);
        equity[seller] -= amount;
        equity[buyer] += amount;
        if (equity[buyer] == amount) {
            investors.push(buyer);
        }
    }

    function _distributePenalty() internal {
        uint256 totalInvestorTokens = TOTAL_SUPPLY - balanceOf(spv);
        if (totalInvestorTokens == 0) return;
        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 investorShare = (equity[investor] * PENALTY_AMOUNT) /
                totalInvestorTokens;
            if (investorShare > 0) payable(investor).transfer(investorShare);
        }
    }

    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setRentalStatus(bool status, uint256 amount) external onlyOwner {
        require(msg.sender == spv, "Only SPV can set rental status");
        isRented = status;
        rentalIncome += amount; // Accumulate rental income instead of resetting
    }

    function distributeRentalIncome() external payable onlyOwner {
        require(msg.sender == spv, "Only SPV can distribute rent");
        require(
            msg.value == rentalIncome,
            "Incorrect rental income amount sent"
        );
        require(rentalIncome > 0, "No rental income to distribute");

        uint256 totalInvestorTokens = TOTAL_SUPPLY;
        if (totalInvestorTokens == 0) return;

        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 investorShare = (equity[investor] * rentalIncome) /
                totalInvestorTokens;
            if (investorShare > 0) {
                payable(investor).transfer(investorShare);
            }
        }
    }
}

contract RealEstateLiquidityPool is Ownable{
    struct Investor {
        uint256 ethInvested;
        uint256 profitShare;
    }
    constructor() Ownable(msg.sender) {}
    mapping(address => Investor) public investors; // Tracks investors' ETH deposits
    mapping(address => uint256) public totalTokensInPool; // Tracks tokens of different real estate in pool
    mapping(address => uint256) public totalETHInPool; // ETH balance of pool
    uint256 public totalLiquidity; // Total ETH in the pool from all investors
    address[] public investor;

    event LiquidityAdded(address indexed investor, uint256 amount);
    event TokensSold(
        address indexed seller,
        address indexed token,
        uint256 tokenAmount,
        uint256 ethReceived
    );
    event RentDistributed(uint256 totalRent, uint256 totalLiquidity);
    event EquityWithdrawn(address indexed investor, uint256 amount);

    /**
     * @notice Adds liquidity (ETH) to the pool
     */
    function addLiquidity() external payable {
        require(msg.value > 0, "Must send ETH to add liquidity");

        // Update investor's contribution
        if (investors[msg.sender].ethInvested == 0) {
            investor.push(msg.sender);
        }
        investors[msg.sender].ethInvested += msg.value;
        totalLiquidity += msg.value;
        emit LiquidityAdded(msg.sender, msg.value);
    }

    /**
     * @notice Returns the total number of investors in the liquidity pool
     */
    function getTotalStakers() external view returns (uint256) {
        return investor.length;
    }

    /**
     * @notice Allows investors to withdraw part of their equity
     * @param amount The amount of ETH to withdraw
     */
    function withdrawEquity(uint256 amount) external {
        require(investors[msg.sender].ethInvested >= amount, "Insufficient equity");
        require(amount > 0, "Withdraw amount must be greater than 0");

        investors[msg.sender].ethInvested -= amount;
        totalLiquidity -= amount;

        payable(msg.sender).transfer(amount);
        emit EquityWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Sells real estate tokens for ETH from the liquidity pool
     * @param realEstateToken Address of the RealEstate token being sold
     * @param tokenAmount Amount of tokens to sell
     */
    function sellTokens(address realEstateToken, uint256 tokenAmount,address seller) external {
        require(tokenAmount > 0, "Invalid token amount");
        require(totalLiquidity > 0, "No liquidity in pool");

        RealEstate token = RealEstate(realEstateToken);
        require(
            token.balanceOf(seller) >= tokenAmount,
            "Insufficient token balance"
        );

        uint256 tokenVal = token.tokenPrice() * tokenAmount;
        require(
            tokenVal <= address(this).balance,
            "Not Enough Liquidity in pool."
        );

        // Call the transferToken function from the RealEstate contract
        token.transferToken{value: tokenAmount * token.tokenPrice()}(
            seller,
            address(this),
            tokenAmount
        );

        // Update token reserves
        totalTokensInPool[realEstateToken] += tokenAmount;

        emit TokensSold(msg.sender, realEstateToken, tokenAmount, tokenVal);
    }

    /**
     * @notice Distributes rent profit proportionally to liquidity providers
     */
    function distributeRent(uint256 val) external  {
        // require(msg.value == rentProfit, "Sent ETH must match rent profit");
        // require(msg.value > 0, "No investors in pool");
        // require(msg.value>0,"No ETH Sent");

        uint256 totalDistributed = 0;

        // Distribute profit proportionally
        for (uint i = 0; i < investor.length; i++) {
            address investorAddress = investor[i];
            uint256 share = (investors[investorAddress].ethInvested *
                val) / totalLiquidity;
            investors[investorAddress].profitShare += share;
            totalDistributed += share;
        }

        emit RentDistributed(totalDistributed, totalLiquidity);
    }

    /**
     * @notice Allows investors to withdraw profits
     */
    function withdrawProfits() external {
        uint256 profit = investors[msg.sender].profitShare;
        require(profit > 0, "No profit to withdraw");

        investors[msg.sender].profitShare = 0;
        payable(msg.sender).transfer(profit);
    }

    /**
     * @notice Receives ETH from external sources
     */
    receive() external payable {}
}

