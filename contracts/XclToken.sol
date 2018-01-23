pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/PausableToken.sol";

contract XclToken is PausableToken {
  string public name = "XCELTOKEN";
  string public symbol = "XCL";

  /* see issue 724 where Vitalik is proposing mandatory 18 decimal places for erc20 tokens
   https://github.com/ethereum/EIPs/issues/724  */
  uint public constant decimals = 18;

  //55 billion initial supply with {$decimals} decimal places
  uint256 public constant INITIAL_SUPPLY = 55 * (10 ** 9) * (10 ** decimals);
  // reserve fund
  uint256 public reserveFundTokensAllocation;

  // reserve fund
  uint256 public devFundTokensAllocation;

  // Total amount of Public Tokens released by xcltrip
  uint256 public publicSaleTokensAllocation;

  // Total amount of Public Tokens released by W3 for the public
  uint256 public foundersFundTokensAllocation;

  //imp allocation
  uint256 public independentMarketingPartner;

  // cmp allocation
  uint256 public countryMarketingPartner;

  // Total amount of tokens allocated so far
  uint256 public totalAllocatedTokens;

  // Address of the founder's multi signature wallet
  // This address can hold deposited Ether when purchased via ETH
  // Also has special access rights
  address public founderMultiSigAddress;

  //Address to deposit fund collected from token sale
  address public xcelFundDepositAddress;

  bool public isPurchaseActive = false;

  // Flag for the transfers to be active or inactive
  bool public isActive = true;

  //events
  event founderMultiSigAddressChanged(address _to);

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
    totalSupply = INITIAL_SUPPLY;

    balances[_founderMultiSigAddress] =  20 * INITIAL_SUPPLY / 100; // 20%
    //Todo Allocate the rest
    totalAllocatedTokens = balances[_founderMultiSigAddress];


  }

 function setXcelFundDepositAddress(address _address) public nonZeroAddress(_address) {
      xcelFundDepositAddress = _address;
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
