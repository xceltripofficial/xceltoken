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
  //Not needed as sale only happesn via token buyer calling buyTokens ?
  address public xclPublicSaleFundDepositAddress;

  address public founderMultiSigAddress;

  // Only Address that can buy
  address public tokenBuyer;

  //events
  event XcelPublicSaleMultiSigAddressChange(address _to);
  event TokensBought(address _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash);
  event PassedPointX(string msg);

  // Token Buyer has special rights
  modifier onlyTokenBuyer() {
      require(msg.sender == tokenBuyer);
      _;
  }

  // No dust transactions
  modifier nonZeroEth() {
      require(msg.value > 0);
      _;
  }

  // No zero address transaction
  modifier nonZeroAddress(address _to) {
      require(_to != 0x0);
      _;
  }


  function XclToken(address _founderMultiSigAddress, address _tokenBuyer) public {
    founderMultiSigAddress = _founderMultiSigAddress;
    tokenBuyer = _tokenBuyer;
    totalSupply = 50 * 10**27;        // 100% - 1 billion total xcltokens with 18 decimals
    publicSaleSupply = 25 * 10**27;   // 50% for public sale

    //to be replaced with a vesting contract that will dispense to _founderMultiSigAddress
    balances[founderMultiSigAddress] =  20 * totalSupply / 100; // 20%
    allocateTokens(balances[founderMultiSigAddress]);

    //tranfser public token sale to owner addresses
    //TODO revisit this to see if this needs to be moved to separate public allocation address;
    balances[tokenBuyer] =  publicSaleSupply;

    //TODO Allocate the rest

  }

 function setXCLPublicSaleFundDepositAddress(address _address) public nonZeroAddress(_address) {
      xclPublicSaleFundDepositAddress = _address;
 }

 // Add to totalAllocatedTokens
function allocateTokens(uint _amount) internal {
     	totalAllocatedTokens = totalAllocatedTokens.add(_amount);
}

// We don't want to support a payable function as we are not doing ICO and instead doing private
//sale. Therefore we want to maintain exchange rate that is pegged to USD.

function buyTokens(address _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash)
external
onlyTokenBuyer
nonZeroAddress(_to)
returns(bool) {
    require(_totalAmount > 0 && publicSaleSupply >= _totalAmount);

    if(transfer(_to, _totalAmount)) {
        publicSaleSupply =  publicSaleSupply.sub(_totalAmount);
        allocateTokens(_totalAmount);
        TokensBought(_to, _totalAmount, _currency, _txHash);
        return true;
    }
    revert();
}

}
