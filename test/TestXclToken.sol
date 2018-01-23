pragma solidity ^0.4.18;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/XclToken.sol";

contract TestXclToken {

/*
  //testing pause variable set and unset
  function testPauseUsingDeployedContract() public {
    XclToken xclToken = XclToken(DeployedAddresses.XclToken());
    Assert.equal(xclToken.paused(),false,"paused should be initialized to false");

    //xclToken.pause();  // this doesn't work here

  }
  */
/*
  function testPauseUsingNewContract() public {

    XclToken xclToken = new XclToken(DeployedAddresses.XclToken());
    Assert.equal(xclToken.paused(),false,"paused should be initialized to false");
    xclToken.pause();
    Assert.equal(xclToken.paused(),true,"paused should be set to true");
    xclToken.unpause();
    Assert.equal(xclToken.paused(),false,"paused should be set back to false");
   }
*/
}
