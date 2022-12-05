import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultProvider } from 'ethers';
import { ToastContainer } from 'react-toastify';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '../components/Navbar/navbar';

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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact" theme={lightTheme({
        accentColor: '#22c55e',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
        overlayBlur: 'small',
      })}>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
