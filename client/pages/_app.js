import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultProvider } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';

const { chains, provider } = configureChains(
  [chain.localhost, chain.hardhat, chain.polygonMumbai, chain.polygon],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'Kopo',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }) => {
  const notify = () => toast('Hello Kopo!');

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
        <button
          onClick={notify}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Toastify test
        </button>
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
