# 🛠️ I-contract a Low-Code Smart Contract Builder

A **low-code smart contract builder** that lets anyone create Solidity smart contracts using a **drag-and-drop interface** — no deep coding knowledge required.  
Once built, users can **deploy their contracts directly to the blockchain** (testnets or mainnet) **with a single click**.

---

## ✨ Features

- **Visual Contract Builder** – Design contracts by dragging and dropping logic blocks.
- **Solidity Code Generation** – Automatically generates clean, production-ready Solidity code.
- **One-Click Deployment** – Connect your wallet and deploy directly from the browser.
- **Testnet Support** – file coin testnets (FVM).
- **Wallet Integration** – Powered by [Wagmi](https://wagmi.sh/) and [ethers.js](https://docs.ethers.org/).
- **Customizable Templates** – Start from scratch or use prebuilt contract templates.
- **Live Preview** – See the generated Solidity code update in real time.
- **AI code assistant** – use ai to vibe code while building with i contract.
- **Team share** - project can be shared between parties (teams)

---

## 🖼️ How It Works

1. **Connect Wallet** – Use MetaMask, WalletConnect, or other supported wallets.
2. **Design Your Contract** – Use the drag-and-drop interface to add functions, variables, and events.
3. **Generate Solidity** – The tool compiles your design into valid Solidity code.
4. **Deploy** – Click the deploy button, confirm in your wallet, and your contract is live!

---

## 🚀 Tech Stack

- **Frontend**: React, Wagmi, ethers.js
- **Smart Contracts**: Solidity
- **Compiler**: solc-js / Backend Solidity compilation API
- **Blockchain Networks**: Filecoin (FVM)
- **Deployment**: Browser-based deployment via connected wallet

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lowcode-smartcontract-builder.git
cd lowcode-smartcontract-builder

# Install dependencies
npm install

# Start development server
npm run dev
