var XclToken = artifacts.require("./XclToken.sol");

module.exports = function(deployer) {
   //When deploying in mainnet we need to pass this and not have it pick up from the
   //current provider wallet to make user we don't accidently set addresses not desired
   const founderMultiSig = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
   const tokenBuyer = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"

  // deployer.deploy(XclToken, founderMultiSig, tokenBuyer);
  deployer.deploy(XclToken, web3.eth.accounts[1], web3.eth.accounts[2]);

};
