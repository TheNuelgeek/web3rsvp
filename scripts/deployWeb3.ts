import { ethers, network } from "hardhat";

const main = async () => {
  const rsvpContractFactory = await ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

//0x1C2031fe17c0aBBb2eB166D57D7C51117326c1E9 on poly