'use strict';

const {
  network: {
    provider: testProvider
  }
} = require('hardhat');
const constants = require('@ethersproject/constants');

const {
  JsonRpcProvider,
  Web3Provider
} = require('@ethersproject/providers');
const { parseEther } = require('@ethersproject/units');

const toWeb3Provider = require('../');

const provider = new (class extends JsonRpcProvider {})('');

Object.getPrototypeOf(provider).send = testProvider.send.bind(testProvider);
const signer = provider.getSigner(0);
const wrapped = new Web3Provider(toWeb3Provider(signer)).getSigner();

describe('ethers-to-web3', () => {
  it('should coerce a signer to a web3 provider', async () => {
    const tx = await wrapped.sendTransaction({
      value: parseEther('1'),
      to: constants.AddressZero
    });
    await tx.wait();
  });
  it('should work with regular calls', async () => {
    await wrapped.provider.getNetwork();
  });
});
