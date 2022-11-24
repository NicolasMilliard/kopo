import { getDefaultProvider } from 'ethers';
import { createClient, WagmiConfig } from 'wagmi';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

let App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default App;
