const hre = require('hardhat');

async function main() {
    const HelloWorld = await hre.ethers.getContractFactory('HelloWorld');
    const helloWorld = await HelloWorld.deploy();

    await helloWorld.deployed();

    console.log('HelloWorld is deployed');
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});