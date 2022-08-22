import { ethers } from "hardhat";

const main = async () =>{
    const rsvpContractF= await ethers.getContractFactory("Web3RSVP")
    const rsvpContract = await rsvpContractF.deploy();
    await  rsvpContract.deployed()
    console.log("RSVP Contract deployed to:", rsvpContract.address)

    const [deployer, address1, address2] = await ethers.getSigners();

    let deposit = ethers.utils.parseEther('1');
    let maxCapacity = 3;
    let timestamp = 1661017008;
    let eventDataCID = 'bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi'

    let txn = await rsvpContract.creatNewEvent(
        timestamp,
        deposit,
        maxCapacity,
        eventDataCID
    );

    let wait = await txn.wait();
    console.log("NEW EVENT CREATED:", wait.events![0].event, wait.events![0].args)
    let eventID = wait.events![0].args?.eventID;
    console.log("EVENT ID:", eventID);

}

const runMain = async() => {
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain();