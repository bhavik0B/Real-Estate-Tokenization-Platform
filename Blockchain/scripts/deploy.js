const hre = require("hardhat");

async function main() {
    const RealEstateTokenFactory = await hre.ethers.getContractFactory("RealEstateTokenFactory");
    const factory = await RealEstateTokenFactory.deploy();
    await factory.waitForDeployment();
    console.log(`Factory deployed at: ${await factory.getAddress()}`);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
