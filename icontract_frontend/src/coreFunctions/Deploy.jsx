import { ethers } from 'ethers'

async function deployContract(abi, bytecode) {
  if (!walletClient) return console.log('Wallet not connected')

  // Convert wagmi walletClient to ethers signer
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const factory = new ethers.ContractFactory(abi, bytecode, signer)

  // Estimate gas
  const tx = factory.getDeployTransaction()
  const gasEstimate = await signer.estimateGas(tx)

  const gasPrice = await provider.getGasPrice()
  const estimatedCost = gasEstimate * gasPrice

  console.log('Estimated gas (ETH):', ethers.formatEther(estimatedCost.toString()))

  // Optionally deploy
  const contract = await factory.deploy()
  await contract.waitForDeployment()

  const contractAddress = await contract.getAddress()
  console.log('Deployed at:', contractAddress)

  return contractAddress
}
