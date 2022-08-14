// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Web3RSVP{
    struct CreateEvent{
        bytes32 eventId;
        string eventDataCID;
        address eventOwner;
        uint256 eventTimestamp;
        uint256 deposit;
        uint256 maxCapacity;
        address[] confirmedRSVP;
        address[] claimedRSVPs;
        bool paidOut;
    }

    mapping(bytes32 => CreateEvent) public idToEvent;

    function creatNewEvent(uint256 eventTimestamp, uint256 deposit, uint256 maxCapacity, string calldata eventDataCID) external{
        // generating eventID by hashing the parameters
        bytes32 eventId = keccak256(abi.encodePacked(msg.sender, address(this), eventTimestamp,deposit,maxCapacity));

        require(idToEvent[eventId].eventTimestamp == 0, "ALREADY REGISTERED");

        address[] memory confirmedRSVPs;
        address[] memory claimedRSVPs;

        idToEvent[eventId] = CreateEvent(
            eventId,eventDataCID,msg.sender, eventTimestamp,deposit,maxCapacity,confirmedRSVPs, claimedRSVPs, false
        );
    }

    function createNewRSVP(bytes32 eventId) external payable{
        CreateEvent storage myEvent = idToEvent[eventId];

        require(msg.value == myEvent.deposit, "NOT ENOUGH");
        require(block.timestamp <= myEvent.eventTimestamp, "ALREADY HPPENED");
        require(myEvent.confirmedRSVP.length < myEvent.maxCapacity, "This event has reached it's max");

        for(uint8 i = 0; i < myEvent.confirmedRSVP.length; i++){
            require(myEvent.confirmedRSVP[i] != msg.sender, "ALREADY CONFIRMED");
        }

        myEvent.confirmedRSVP.push(payable(msg.sender));
    }
}