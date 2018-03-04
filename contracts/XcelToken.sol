pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

contract XcelToken is PausableToken {
  string public name = "XCELTOKEN";
  string public symbol = "XCEL";

  /* see issue 724 where Vitalik is proposing mandatory 18 decimal places for erc20 tokens
   https://github.com/ethereum/EIPs/issues/724  */
  uint8 public constant decimals = 18;

  // 50 Billion tokens
  uint256 public constant MAX_SUPPLY = 50 * (10**9) * (10 ** uint256(decimals));

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
  address public xclPublicSaleFundDepositAddr;

  address public founderMultiSigAddr;

  // Only Address that can buy
  address public tokenBuyerAddr;

  //events
  event XcelPublicSaleMultiSigAddressChange(address _to);
  event TokensBought(address _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash);
  event PassedPointX(string msg);

  // Token Buyer has special rights
  modifier onlyTokenBuyer() {
      require(msg.sender == tokenBuyerAddr);
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


  function XcelToken(address _founderMultiSigAddr, address _tokenBuyerAddr) public {
    founderMultiSigAddr = _founderMultiSigAddr;
    tokenBuyerAddr = _tokenBuyerAddr;
    totalSupply_ = MAX_SUPPLY;
    publicSaleSupply = 25 * 10**27;   // 50% for public sale

    //mint all tokens
    balances[msg.sender] = totalSupply_;
    Transfer(address(0x0), msg.sender, totalSupply_);

    //to be replaced with a vesting contract that will dispense to _founderMultiSigAddress
    balances[founderMultiSigAddr] =  20 * totalSupply_ / 100; // 20%
    allocateTokens(balances[founderMultiSigAddr]);

    //Allow  token buyer to transfer public sale allocation
    approve(tokenBuyerAddr, 0);
    approve(tokenBuyerAddr, publicSaleSupply);

    //TODO Allocate the rest

  }

  function setXCLPublicSaleFundDepositAddress(address _address) public nonZeroAddress(_address) {
      xclPublicSaleFundDepositAddr = _address;
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

    if(transferFrom(owner,_to, _totalAmount)) {
        publicSaleSupply =  publicSaleSupply.sub(_totalAmount);
        allocateTokens(_totalAmount);
        TokensBought(_to, _totalAmount, _currency, _txHash);
        return true;
    }
    revert();
  }

/* This unnamed function is called whenever someone tries to send ether to it */
  function () public payable {
         revert();
  }

}
