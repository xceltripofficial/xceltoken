pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/PausableToken.sol";

contract XclToken is PausableToken {
  string public name = "XCELTOKEN";
  string public symbol = "XCL";

  /* see issue 724 where Vitalik is proposing mandatory 18 decimal places for erc20 tokens
   https://github.com/ethereum/EIPs/issues/724  */
  uint public constant decimals = 18;

  // fundation supply
  uint256 public foundationSupply;
  // founders supply
  uint256 public foundersSupply;
  //advisor supply
  uint256 public advisorSupply;
  // public sale supply`
  uint256 public publicSaleSupply;
  //imp/cmp supply
  uint256 public marketProviderSupply;
  //reserve fund supply
  uint256 public reserveFundTokensSupply;

  // Total amount of tokens allocated so far
  uint256 public totalAllocatedTokens;

  //Address to deposit fund collected from public token sale , multisig
  address public xclPublicSaleFundDepositAddress;

  address public founderMultiSigAddress;

  // Flag for the transfers to be active or inactive
  bool public isActive = true;

  //events
  event xclPublicSaleMultiSigAddressChange(address _to);

  // Only the founder's address has special rights
  modifier onlyFounders() {
      require(msg.sender == founderMultiSigAddress);
      _;
  }

  // No dust transactions
  modifier nonZeroEth() {
      require(msg.value > 0);
      _;
  }

  // Ensure no zero address, for user protection
  modifier nonZeroAddress(address _to) {
      require(_to != address(0));
      _;
  }

  function XclToken(address _founderMultiSigAddress) public {
    founderMultiSigAddress = _founderMultiSigAddress;
    totalSupply = 55 * 10**27;        // 100% - 1 billion total xcltokens with 18 decimals

    balances[_founderMultiSigAddress] =  20 * totalSupply / 100; // 20%
    //TODO Allocate the rest

    allocateTokens(balances[_founderMultiSigAddress]);

  }

 function setXCLPublicSaleFundDepositAddress(address _address) public nonZeroAddress(_address) {
      xclPublicSaleFundDepositAddress = _address;
 }

 // Add to totalAllocatedTokens
function allocateTokens(uint _amount) internal {
     	totalAllocatedTokens = totalAllocatedTokens.add(_amount);
}

// Placeholder to be added
 function buyTokens() internal nonZeroEth returns (bool) {
    return false;
 }

  // First entry to buy tokens. Here, all you have to do is send ether to the contract address
  // With at least 200 000 gas
  function() public payable {
      buyTokens();
  }

}
