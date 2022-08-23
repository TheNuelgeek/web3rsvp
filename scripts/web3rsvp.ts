import { ethers, network } from "hardhat";

const main = async () =>{
    const rsvpContractF= await ethers.getContractFactory("Web3RSVP")
    const rsvpContract = await rsvpContractF.deploy();
    await  rsvpContract.deployed()
    console.log("RSVP Contract deployed to:", rsvpContract.address)

    const [deployer, address1, address2] = await ethers.getSigners();

    let deposit = ethers.utils.parseEther('1');
    let maxCapacity = 3;
    let timestamp = 2008514208;
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

    txn = await rsvpContract.createNewRSVP(eventID, {value: deposit});
    wait = await txn.wait();
    console.log('NEW RSVP:', wait.events![0].event, wait.events![0].args);

    txn = await rsvpContract.connect(address1).createNewRSVP(eventID,{value: deposit});
    wait = await txn.wait();
    console.log('NEW RSVP:', wait.events![0].event, wait.events![0].args);

    txn = await rsvpContract.connect(address2).createNewRSVP(eventID, {value: deposit});
    wait = await txn.wait();
    console.log('NEW RSVP:', wait.events![0].event, wait.events![0].args);

    txn = await rsvpContract.confirmAllAttendee(eventID);
    wait = await txn.wait();
    wait.events?.forEach((event) => console.log('CONFIRMED:', event!.args?.attendeeAddress)
    );

    // wait 1 year
    await network.provider.send("evm_increaseTime", [2040050208])

    txn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
    wait = await txn.wait();
    console.log('WITHDRAWN:', wait.events![0].event, wait.events![0].args)

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