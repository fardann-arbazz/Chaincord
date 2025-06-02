const { expect } = require("chai");
const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.parseUnits(n.toString(), "ether");
};

describe("Chaincord", function () {
  let chaincord;
  let results;
  let deployer, user;

  const NAME = "Chaincord";
  const SYMBOL = "CD";

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    const Chaincord = await ethers.getContractFactory("ChainCord");
    chaincord = await Chaincord.deploy(NAME, SYMBOL);
    await chaincord.waitForDeployment();

    const transaction = await chaincord
      .connect(deployer)
      .createChannel("general", tokens(0));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Sets the name", async () => {
      results = await chaincord.name();
      expect(results).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      results = await chaincord.symbol();
      expect(results).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      results = await chaincord.owner();
      expect(results).to.equal(deployer.address);
    });
  });

  describe("Creating Channels", () => {
    it("Returns total channels", async () => {
      results = await chaincord.totalChannels();
      expect(results).to.equal(1);
    });

    it("Returns channels attribute", async () => {
      results = await chaincord.getChannel(1);
      expect(results.id).to.be.equal(1);
      expect(results.name).to.be.equal("general");
      expect(results.cost).to.be.equal(tokens(0));
    });
  });

  describe("Joining channels", () => {
    const ID = 1;
    const AMOUNT = hre.ethers.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await chaincord
        .connect(user)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("Joins the user", async () => {
      results = await chaincord.hasJoined(ID, user.address);
      expect(results).to.be.equal(true);
    });

    it("Increases total supply", async () => {
      results = await chaincord.totalSupply();
      expect(results).to.be.equal(ID);
    });

    it("Update the contract balance", async () => {
      const address = await chaincord.getAddress();
      results = await ethers.provider.getBalance(address);
      expect(results).to.be.equal(AMOUNT);
    });
  });

  describe("Get Joined Channels", () => {
    const ID = 1;
    const AMOUNT = hre.ethers.parseUnits("1", "ether");

    beforeEach(async () => {
      const tx = await chaincord.connect(user).mint(ID, { value: AMOUNT });
      await tx.wait();
    });

    it("Returns the joined channels for user", async () => {
      results = await chaincord.getJoinedChannel(user.address);

      expect(results.length).to.equal(1);
      expect(results[0].id).to.equal(ID);
      expect(results[0].name).to.equal("general");
      expect(results[0].cost).to.equal(tokens(0));
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = hre.ethers.parseUnits("5", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let transaction = await chaincord
        .connect(user)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      transaction = await chaincord.connect(deployer).withdraw(tokens(2));
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const address = await chaincord.getAddress();
      const contractBalance = await ethers.provider.getBalance(address);
      expect(contractBalance).to.equal(tokens(3));
    });

    it("Get saldo ETH", async () => {
      await deployer.sendTransaction({
        to: chaincord.target,
        value: oneETH
      })

      const balance = await chaincord.getContractBalance()
      expect(balance).to.equal(tokens(4))
    })
  });
});
