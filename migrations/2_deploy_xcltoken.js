const XcelToken = artifacts.require("./XcelToken.sol");
const StepVesting = artifacts.require("./StepVesting.sol");

module.exports = function(deployer) {
   //When deploying in mainnet we need to pass this and not have it pick up from the
   //current provider wallet to make user we don't accidently set addresses not desired
   //using address from the Ganache accounts
   // const tokenBuyer = "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"
   // const beneficiary = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"

   const tokenBuyer = web3.eth.accounts[1]
   const beneficiary = web3.eth.accounts[2]

   const start = web3.eth.getBlock('latest').timestamp + 60
   const cliffDuration = 90 // ~1 yr
   //const duration = 1050 // ~4yrs    (cliff + (stepVestingDuration * numberOfPartitions))
   const amount = 100 * 1e18


   const cliffPercent = 20;
   const numberOfPartitions = 8;
   //const stepVestingDuration = 30 * 24 * 60 * 60;
   const stepVestingDuration = 120;
   const stepVestingPercent = 10;

   //passing all these params for now as ethereum doesn't handle floating or fixed point very well right now
   deployer.deploy(StepVesting, beneficiary, start, cliffDuration, cliffPercent,stepVestingDuration,stepVestingPercent,numberOfPartitions, true).then(() => {
     return deployer.deploy(XcelToken,tokenBuyer);
   }).then(() => {
     console.log('tokenBuyer address :' + tokenBuyer);
     console.log('beneficiary address :' + beneficiary);
     console.log('StepVesting.address :' + StepVesting.address);
     return XcelToken.at(XcelToken.address);
 }).then((xcelToken) => {
     console.log('XcelToken.address :' + XcelToken.address);
     console.log('StepVesting.address balance :' + xcelToken.balanceOf(StepVesting.address));
     return xcelToken.initiateTeamVesting(StepVesting.address);
   })

};
