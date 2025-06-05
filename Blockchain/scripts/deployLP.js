const hre = require("hardhat");

async function main() {
    const RealEstateLiquidityPool = await hre.ethers.getContractFactory("RealEstateLiquidityPool");
    const factory = await RealEstateLiquidityPool.deploy();
    await factory.waitForDeployment();
    console.log(`Factory deployed at: ${await factory.getAddress()}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
