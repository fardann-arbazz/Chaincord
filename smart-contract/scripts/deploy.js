const hre = require("hardhat")

const tokens = (n) => {
    return hre.ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
    const [deployer] = await ethers.getSigners()

    const NAME = "Chaincord"
    const SYMBOL = "CD"

    const Chaincord = await ethers.getContractFactory("ChainCord");
    const chaincord = await Chaincord.deploy(NAME, SYMBOL);

    console.log(`Deployed Chaincord Contract at: ${chaincord.target}`);

    const CHANNELS_NAMES = ['general', 'intro', 'secret-information']
    const COSTS = [tokens(0), tokens(0), tokens(5)]

    for (let i = 0; i < 3; i++) {
        const transaction = await chaincord.connect(deployer).createChannel(CHANNELS_NAMES[i], COSTS[i])
        await transaction.wait()

        console.log(`Created text channel #${CHANNELS_NAMES[i]}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})