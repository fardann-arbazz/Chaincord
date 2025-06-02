// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChainCord is ERC721 {
    uint256 public totalSupply;
    uint256 public totalChannels;
    address public owner;

    mapping (uint256 => Channel) channels;
    mapping (uint256 => mapping(address => bool)) public hasJoined;

    event ChannelCreated(uint256 id, string name, uint256 cost);
    event ChannelJoined(uint256 channelId, address user, uint256 cost);
    event Withdraw(address _user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function mint(uint256 _id) public payable {
        require(_id != 0, "Invalid ID");
        require(_id <= totalChannels, "Channel does not exist");
        require(!hasJoined[_id][msg.sender], "Already Joined");
        require(msg.value >= channels[_id].cost, "Insufficient payment");

        hasJoined[_id][msg.sender] = true;

        totalSupply++;
        _safeMint(msg.sender, totalSupply);

        emit ChannelJoined(_id, msg.sender, msg.value);
    }

    function getJoinedChannel(address _user) public view returns(Channel[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i <= totalChannels ; i++) {
            if(hasJoined[i][_user]) {
                count++;
            }
        }

        Channel[] memory joined = new Channel[](count);
        uint256 index = 0;

        for (uint i = 1; i <= totalChannels; i++) {
            if(hasJoined[i][_user]) {
                joined[index] = channels[i];
                index++;
            }
        }

        return joined;
    }

    function createChannel(string memory _name, uint256 _cost) public onlyOwner {
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);

        emit ChannelCreated(totalChannels, _name, _cost);
    }

    function getChannel(uint256 _id) public view returns (Channel memory) {
        return channels[_id];
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient contract balance");

        (bool success, ) = owner.call{ value: _amount }("");

        require(success, "Withdraw failed");

        emit Withdraw(owner, _amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}