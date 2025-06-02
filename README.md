# 📱 Chaincord - Web3-Based Decentralized Discord

Chaincord is a decentralized messaging platform inspired by Discord, built on top of Ethereum. In Chaincord, **channels are token-gated using smart contracts**, meaning you must **pay in ETH** to join certain exclusive communities. This brings a new layer of ownership, access control, and economic model to social communication.

---

## 🚀 Features

* ✅ **Decentralized Channels**
  Every channel is a smart contract. Joining means minting a token.

* 🔐 **Token-Gated Access**
  Users must pay ETH to join a channel, just like minting an NFT.

* 🧀 **Smart Contract Powered**
  All join/payment logic is handled on-chain.

* 👛 **Web3 Authentication**
  Login with your Ethereum wallet (MetaMask).

* 🛠️ **Channel Creation (for Owners)**
  Channel owners can create new paid or free channels.

* ⚡ **Real-time UI**
  A sleek and responsive UI with support for both **desktop and mobile** views.

---

## 🧹 Tech Stack

| Layer          | Stack                                |
| -------------- | ------------------------------------ |
| Smart Contract | Solidity, Hardhat                    |
| Frontend       | React, TailwindCSS, Vite             |
| Web3           | Ethers.js                            |
| Routing        | React Router                         |
| Icons & UI     | React Icons                          |

---

## 🎮 Demo Preview

Comming Soon

---

## 🦪 How It Works

1. **Connect Wallet**
   The user connects their Ethereum wallet via MetaMask.

2. **Browse Channels**
   Channels are listed on the sidebar. Users can click to join.

3. **Join via Smart Contract**
   When a user clicks a channel:

   * The system checks if they already joined (`hasJoined()`).
   * If not, they must pay the specified ETH cost.
   * After the transaction is mined, access is granted.

4. **Access & Chat**
   Once joined, users can participate in the channel community.

---

## 🧵 Smart Contract Flow (Simplified)

```solidity
function mint(uint256 channelId) external payable {
    require(msg.value >= channelCost[channelId], "Insufficient ETH");
    require(!hasJoined(channelId, msg.sender), "Already joined");
    // Grant access token / NFT
    _mint(msg.sender, channelId);
}
```

---

## 💻 Local Development

### Prerequisites

* Node.js 18+
* MetaMask (browser extension)
* Hardhat / Ganache for local blockchain (optional for local dev)

### Install Dependencies

```bash
npm install
```

### Run the Frontend

```bash
npm run dev
```

### Deploy Smart Contracts (optional)

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

## 📱 Mobile Support

* On mobile devices, the sidebar condenses into a single icon.
* Clicking the sidebar icon opens the **ChannelList** modal.
* Fully responsive and optimized for smaller screens.

---

## 🛡️ Security Notes

* All join/pay transactions are validated on-chain.
* Contract logic ensures:

  * No duplicate joins
  * Correct ETH amount
  * Ownership verification for channel creation

---

## 🙌 Contribution Guide

1. Fork this repo
2. Clone it locally
3. Create a new branch: `git checkout -b feature/yourFeature`
4. Make your changes
5. Push and open a PR

---

## 📖 License

MIT License © 2025 Fardan Arbaz

---

## ✨ Future Plans

* 💬 Real-time chat (via sockets or decentralized messaging)
* 🛠️ Admin tools for banning/kicking users
* 🌉 Layer 2 support for cheaper transactions
* 🎨 NFT avatars / profile customization

---

## 🤝 Let's Connect

Built by a blockchain & fullstack developer who believes in the power of decentralized communities.

> 💬 Want to contribute or chat? Reach out via [Instagram](https://www.instagram.com/frdn.arbzz/)
