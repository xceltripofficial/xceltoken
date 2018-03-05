pragma solidity ^0.4.19;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/XcelToken.sol";


contract TestXcelToken {

  address tokenBuyerAddress = 0x123;
  address teamVestingAddress = 0x456;
  address teamVestingContractAddress = 0x789;
  //testing pause variable set and unset

  function testPauseUsingDeployedContract() public {
    XcelToken xcelToken = XcelToken(DeployedAddresses.XcelToken());
    Assert.equal(xcelToken.paused(),false,"paused should be initialized to false");

    //xcelToken.pause();  // this doesn't work here and throws some event emit error

  }

  function testPauseUsingNewContract() public {

    XcelToken xcelToken = new XcelToken(tokenBuyerAddress, teamVestingAddress, teamVestingContractAddress);
    Assert.equal(xcelToken.paused(),false,"paused should be initialized to false");
    xcelToken.pause();
    Assert.equal(xcelToken.paused(),true,"paused should be set to true");
    xcelToken.unpause();
    Assert.equal(xcelToken.paused(),false,"paused should be set back to false");
    Assert.equal(xcelToken.tokenBuyerAddr(),tokenBuyerAddress,"tokenBuyerAddr not same");

   }

}
