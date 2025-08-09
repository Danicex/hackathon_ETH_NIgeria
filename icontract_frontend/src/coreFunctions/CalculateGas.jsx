async function estimateGas(sourceCode) {
    const { abi, bytecode } = compileContract(sourceCode);
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
  
    const estimate = await factory.signer.estimateGas({
      data: factory.bytecode,
    });
  
    console.log("Estimated Gas:", estimate.toString());
    return estimate;
  }
  