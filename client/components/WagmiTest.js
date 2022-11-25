import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

let WagmiTest = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return <ConnectButton showBalance={false} />;
};

export default WagmiTest;
