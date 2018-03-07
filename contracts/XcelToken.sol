pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

/*
    Prereq for deploying this contracts
    1) TokenBuyer address is created

    To start team vesting
    1) Create TeamVesting beneficiary address
    2) Deploy team allocation Vesting contract (StepVesting)
    3) Call XcelToken.initiateTeamVesting using the contact owner account

    //TODO Support allocation of Foundation, loyalty and reserve supply 
*/

contract XcelToken is PausableToken  {

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

  // Only Address that can buy public sale supply
  address public tokenBuyerWallet;

  //address where team vesting contract will relase the team vested tokens
  address public teamVestingContractAddress;

  bool public isTeamVestingInitiated = false;

  //Sale from public allocation via tokenBuyerWallet
  event TokensBought(address indexed _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash);

  // Token Buyer has special right like transer from public sale supply
  modifier onlyTokenBuyer() {
      require(msg.sender == tokenBuyerWallet);
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


  function XcelToken(address _tokenBuyerWallet) public {

    tokenBuyerWallet = _tokenBuyerWallet;
    totalSupply_ = INITIAL_SUPPLY;

    //mint all tokens
    balances[msg.sender] = totalSupply_;
    Transfer(address(0x0), msg.sender, totalSupply_);

    //Allow  token buyer to transfer public sale allocation
    //need to revisit to see if this needs to be broken into 3 parts so that
    //one address does not compromise 60% of token
    approve(tokenBuyerWallet, 0);
    approve(tokenBuyerWallet, publicSaleSupply);

  }

  /**
  @dev Initiate the team vesting by transferring the teamSupply t0 _teamVestingContractAddress
  @param _teamVestingContractAddress  address of the team vesting contract alreadt deployed with the
        beneficiary address
  */
  function initiateTeamVesting(address _teamVestingContractAddress)
    external
    onlyOwner
    nonZeroAddress(_teamVestingContractAddress) {
         if(isTeamVestingInitiated) {
             revert();
         }
        isTeamVestingInitiated = true;
        teamVestingContractAddress = _teamVestingContractAddress;
        //transfer team supply to team vesting contract
        transfer(_teamVestingContractAddress, teamSupply);


  }

// We don't want to support a payable function as we are not doing ICO and instead doing private
//sale. Therefore we want to maintain exchange rate that is pegged to USD.

  function buyTokens(address _to, uint256 _totalWeiAmount, bytes4 _currency, bytes32 _txHash)
   external
   onlyTokenBuyer
   nonZeroAddress(_to)
   returns(bool) {
    require(_totalWeiAmount > 0 && publicSaleSupply >= _totalWeiAmount);

    if(transferFrom(owner,_to, _totalWeiAmount)) {
        publicSaleSupply =  publicSaleSupply.sub(_totalWeiAmount);
        TokensBought(_to, _totalWeiAmount, _currency, _txHash);
        return true;
    }
    revert();
  }

/**
 @dev This unnamed function is called whenever someone tries to send ether to it  and we don't want payment
coming directly to the contracts
*/
  function () public payable {
         revert();
  }

}
