# Usage

## Install

```console
$ npm install
```

## Run

**Run a dev version**

```console
$ npm run dev
```

**Build for production**

```console
$ npm run build
```

# Choices of technologies

## Next.js

[Next.js](https://nextjs.org/)

The choice of the technology for the Dapp was ported to Next.js:

- It offers a fully compatible React environment.
- Powerful server backend.

Strong support and frequent updates.

## Ethers

[Ethers](https://docs.ethers.io/v5/)

- We were taught Web3.js at Alyra. We wanted to show we could also adapt to other frameworks.
- The smart contracts were deployed with Hardhat which uses Ethers to interact with blockchains.
- Ethers is quite a powerful and proven library.

## Wagmi

[Wagmi](https://wagmi.sh/)

Wagmi is used in this project to support the initial connection with the wallet and the Dapp.
It already supports various chains and wallets which saved us time.

# Rainbowkit

[RainbowKit](https://www.rainbowkit.com/)

RainbowKit handles the choice of the wallet, it supports many different wallets:

- MetaMask
- WalletConnect
- LedgerLive
- Coinbase Wallet
- Argent

As we want the project to be used by the most people possible, it was important to support as many wallets and types of connection as possible.

## Tailwind

[Tailwind](https://www.tailwindapp.com/)

## Vercel

[Vercel](https://vercel.com/)

Because of its Github integration, native support of Next.js made Vercel the perfect platform to host the first version of Kopo.
