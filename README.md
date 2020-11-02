# ethers-to-web3

Exports a function which takes an ethers.js Signer or Provider of any type, and gives you a Web3-compatible provider you can use with libraries which need it.

## Usage

```js

const { Wallet } = require('@ethersproject/wallet');
const { InfuraProvider } = require('@ethersproject/providers');
const signer = new Wallet(pvtKey).connect(new InfuraProvider('mainnet'));
const toWeb3Provider = require('ethers-to-web3');

const web3Provider = toWeb3Provider(signer); // now you can use this with Web3 or something that needs a Web3 provider

```

## Author

Raymond Pulver IV
