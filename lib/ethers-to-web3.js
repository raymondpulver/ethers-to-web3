"use strict";

const RpcEngine = require("json-rpc-engine");
const providerFromEngine = require("eth-json-rpc-middleware/providerFromEngine");


const toWeb3Provider = (module.exports = exports = (providerOrSigner) => {
  const engine = new RpcEngine();
  engine.push((req, res, next, end) => {
    (async () => {
      switch (req.method) {
        case "eth_sendTransaction":
          if (!exports._isSignerLike(providerOrSigner))
            throw Error(req.method + " requires a signer");
          const tx = req.params[0];
          return (await providerOrSigner.sendTransaction({
            nonce: tx.nonce,
            gasLimit: tx.gas || tx.gasLimit,
            value: tx.value,
            gasPrice: tx.gasPrice,
            to: tx.to,
            data: tx.data
          })).hash
          break;
        case "eth_sign":
        case "eth_accounts":
          return [ exports._isSignerLike(providerOrSigner) ? await providerOrSigner.getAddress() : await providerOrSigner.listAccounts() ]
        case "personal_sign":
          if (!exports._isSignerLike(providerOrSigner))
            throw Error(req.method + " requires a signer");
          return await providerOrSigner.signMessage(req.params[0]);
        default:
          return await exports
            ._coerceToProvider(providerOrSigner)
            .send(req.method, req.params);
      }
    })()
      .then((result) => {
        res.result = result;
        end();
      })
      .catch((err) => {
        res.error = {
          message: err.message,
        };
        end();
      });
  });
  return Object.assign(providerFromEngine(engine), {
    _ethers: providerOrSigner,
    asEthers() {
      return this._ethers;
    }
  });
});

exports._coerceToHexString = (v) => v && v.toHexString ? v.toHexString() : v;

const isSignerLike = (providerOrSigner) => {
  return Boolean(
    providerOrSigner.provider &&
      !Object.getOwnPropertyDescriptor(providerOrSigner, "send")
  );
};

exports._isSignerLike = isSignerLike;

const coerceToProvider = (providerOrSigner) => {
  return isSignerLike(providerOrSigner) ? providerOrSigner.provider : providerOrSigner;
};

exports._coerceToProvider = coerceToProvider;
