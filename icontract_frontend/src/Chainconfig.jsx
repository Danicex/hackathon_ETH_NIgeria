import { defineChain } from 'viem'

export const filecoinCalibration = defineChain({
  id: 314159, // Calibration testnet decimal
  name: 'Filecoin Calibration Testnet',
  network: 'filecoin-calibration',
  nativeCurrency: { name: 'Filecoin', symbol: 'FIL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
    public: { http: ['https://api.calibration.node.glif.io/rpc/v1'] }
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://calibration.filfox.info/en' }
  }
});
