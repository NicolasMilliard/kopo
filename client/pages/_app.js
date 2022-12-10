import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultProvider } from 'ethers';
import { ToastContainer } from 'react-toastify';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.css';

import Layout from '../components/Layout/Layout';
import { KopoProvider } from '../context/KopoContext';

const { chains, provider } = configureChains([chain.localhost, chain.polygonMumbai], [publicProvider()]);

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
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={lightTheme({
          accentColor: '#22c55e',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        <KopoProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </KopoProvider>

        <ToastContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
