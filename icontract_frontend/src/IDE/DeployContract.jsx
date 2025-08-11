import { useMyContext } from "@/Context/AppContext";
import axios from "axios";
import { ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import { useChainId } from 'wagmi';
import { filecoinCalibration} from '../Chainconfig';

export function useContractDeployment() {
  const { api_endpoint } = useMyContext();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  async function cleanCode(code) {
    try {
     /* if (!code || typeof code !== 'string') {
        throw new Error("Invalid Solidity code");
      }*/

      const response = await axios.post(`${api_endpoint}/compile_code`, { code });
      
      if (!response.data?.abi || !response.data?.bytecode) {
        throw new Error("Compilation failed - no ABI or bytecode returned");
      }

      return response.data;
    } catch (error) {
      console.error("Compilation error:", error);
      throw new Error(`Compilation failed: ${error.message}`);
    }
  }

  async function deployContract(code) {
    try {
      // 1. Validate wallet and network
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      if (!address) {
        throw new Error("No connected account");
      }

      const currentChain = [filecoinCalibration].find(chain => chain.id === chainId);
      const networkName = currentChain?.name || 'unknown';

      console.log(`Deploying to network: ${networkName} (ID: ${chainId})`);

      // 2. Compile the contract
      const { abi, bytecode } = await cleanCode(code);

      // 3. Set up provider and signer
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // 4. Deploy with gas estimation
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      
      // Optional: Estimate gas first
      try {
        const estimatedGas = await factory.signer.estimateGas(
          factory.getDeployTransaction()
        );
        console.log("Estimated deployment gas:", estimatedGas.toString());
      } catch (gasError) {
        console.warn("Gas estimation failed:", gasError);
      }

      // 5. Execute deployment
      const contract = await factory.deploy();
      
      if (!contract?.deployTransaction?.hash) {
        throw new Error("Failed to initiate deployment transaction");
      }

      const txHash = contract.deployTransaction.hash;
      console.log("Deployment TX Hash:", txHash);

      // 6. Wait for confirmation
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();
      
      const explorerUrl = getExplorerLink(chainId, txHash);
      console.log("✅ Contract deployed to:", contractAddress);
      console.log("🔗 Explorer link:", explorerUrl);

      return {
        contractAddress,
        abi,
        txHash,
        network: networkName,
        explorerUrl
      };

    } catch (error) {
      console.error("🚨 Deployment failed:", error);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }

  // Helper function to generate explorer links
  function getExplorerLink(chainId, txHash) {
   const explorers = {
  314159: `https://calibration.filfox.info/en/tx/${txHash}`,
};
    return explorers[chainId] || `https://etherscan.io/tx/${txHash}`;
  }

  return { deployContract };
}