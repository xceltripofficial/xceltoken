pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/XcelToken.sol";


contract TestXcelToken {

  address buyerAddress = 0x123;
  /* mapping (string => address) variable;

  function beforeEach() {
    variable["1"] = "0xa462d983B4b8C855e1876e8c24889CBa466A67EB";
    buyerAddress = variable["1"];
  } */
  //testing pause variable set and unset

  function testPauseUsingDeployedContract() public {
    XcelToken xcelToken = XcelToken(DeployedAddresses.XcelToken());
    Assert.equal(xcelToken.paused(),false,"paused should be initialized to false");

    //xcelToken.pause();  // this doesn't work here and throws some event emit error

  }

  function testPauseUsingNewContract() public {

    XcelToken xcelToken = new XcelToken(DeployedAddresses.XcelToken(),buyerAddress);
    Assert.equal(xcelToken.paused(),false,"paused should be initialized to false");
    xcelToken.pause();
    Assert.equal(xcelToken.paused(),true,"paused should be set to true");
    xcelToken.unpause();
    Assert.equal(xcelToken.paused(),false,"paused should be set back to false");
    Assert.equal(xcelToken.founderMultiSigAddr(),DeployedAddresses.XcelToken(),"founderMultiSigAddress not same");

    //validate that foundersSupply is 20% of the totalSupply
    Assert.equal(xcelToken.balanceOf(DeployedAddresses.XcelToken()), 20 * xcelToken.totalSupply() / 100, "founders supply is 20% of totalsupply");

   }

}
