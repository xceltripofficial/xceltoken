pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

/*
    Prereq for deploying this contracts
    1) Team allocation Vesting contract (StepVesting) is already deployed
    2) TeamVesting beneficiary address is created
    3) TokenBuyer address is created
*/

contract XcelToken is PausableToken {
  string public constant name = "XCELTOKEN";
  string public constant symbol = "XCEL";

  /* see issue 724 where Vitalik is proposing mandatory 18 decimal places for erc20 tokens
   https://github.com/ethereum/EIPs/issues/724  */
  uint8 public constant decimals = 18;

  // 50 Billion tokens
  uint256 public constant INITIAL_SUPPLY = 50 * (10**9) * (10 ** uint256(decimals));

  // fundation supply 10%
  uint256 public constant foundationSupply = 5 * (10**9) * (10 ** uint256(decimals));
  // founders supply 15%
  uint256 public constant teamSupply = 7.5 * (10**9) * (10 ** uint256(decimals));
  // public sale supply 60%
  uint256 public publicSaleSupply = 30 * (10**9) * (10 ** uint256(decimals));
  //imp/cmp supply 5%
  uint256 public constant loyaltySupply = 2.5 * (10**9) * (10 ** uint256(decimals));
  //reserve fund supply 10%
  uint256 public constant reserveFundSupply = 5 * (10**9) * (10 ** uint256(decimals));

  // Total amount of tokens allocated so far
  uint256 public totalAllocatedTokens;


  // Only Address that can buy public sale supply
  address public tokenBuyerAddr;
  //address where vesting contract will relase the vested tokens
  address public teamVestingAddress;

  //events
  //Sale from public allocation via tokenBuyerAddr
  event TokensBought(address _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash);


  // Token Buyer has special right like transer from public sale supply
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


  function XcelToken(address _tokenBuyerAddr, address _teamVestingAddress,address _teamVestingContractAddress) public {
    teamVestingAddress = _teamVestingAddress;
    tokenBuyerAddr = _tokenBuyerAddr;
    totalSupply_ = INITIAL_SUPPLY;

    //mint all tokens
    balances[msg.sender] = totalSupply_;
    Transfer(address(0x0), msg.sender, totalSupply_);

    //transfer team supply to team vesting contract
    transfer(_teamVestingContractAddress, teamSupply);


    //Allow  token buyer to transfer public sale allocation
    //need to revisit to see if this needs to be broken into 3 parts so that
    //one address does not compromise 60% of token
    approve(tokenBuyerAddr, 0);
    approve(tokenBuyerAddr, publicSaleSupply);

    //TODO Allocate the rest

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
