pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

/*
    Prereq for deploying this contracts
    1) TokenBuyer address is created

    To start team vesting
    1) Create TeamVesting beneficiary address
    2) Deploy team allocation Vesting contract (StepVesting)
    3) Call XcelToken.initiateTeamVesting using the contact owner account
    4) Call assignFoundationSupply to manage founcation allocation via contract
    5) Call assignReserveSupply to manage reserveFundSupply via contracts
    6) Set Loyalty wallet address .
    7) Call allocateLoyaltySpend to move some tokens from loyalty pool to Loyalty wallet as needed

*/

contract XcelToken is PausableToken, BurnableToken  {

    string public constant name = "XCELTOKEN";

    string public constant symbol = "XCEL";

    /* see issue 724 where Vitalik is proposing mandatory 18 decimal places for erc20 tokens
    https://github.com/ethereum/EIPs/issues/724
    */
    uint8 public constant decimals = 18;

    // 50 Billion tokens
    uint256 public constant INITIAL_SUPPLY = 50 * (10**9) * (10 ** uint256(decimals));

    // foundation supply 10%
    uint256 public constant foundationSupply = 5 * (10**9) * (10 ** uint256(decimals));

    // founders supply 15%
    uint256 public constant teamSupply = 7.5 * (10**9) * (10 ** uint256(decimals));

    // public sale supply 60%
    uint256 public publicSaleSupply = 30 * (10**9) * (10 ** uint256(decimals));

    //imp/cmp supply 5%
    uint256 public loyaltySupply = 2.5 * (10**9) * (10 ** uint256(decimals));

    //reserve fund supply 10%
    uint256 public constant reserveFundSupply = 5 * (10**9) * (10 ** uint256(decimals));

    // Only Address that can buy public sale supply
    address public tokenBuyerWallet =0x0;

    //wallet to disperse loyalty points as needed.
    address public loyaltyWallet = 0x0;

    //address where team vesting contract will relase the team vested tokens
    address public teamVestingContractAddress;

    bool public isTeamVestingInitiated = false;

    bool public isFoundationSupplyAssigned = false;

    bool public isReserveSupplyAssigned = false;

    //Sale from public allocation via tokenBuyerWallet
    event TokensBought(address indexed _to, uint256 _totalAmount, bytes4 _currency, bytes32 _txHash);
    event LoyaltySupplyAllocated(address indexed _to, uint256 _totalAmount);
    event LoyaltyWalletAddressChanged(address indexed _oldAddress, address indexed _newAddress);

    // Token Buyer has special to transfer from public sale supply
    modifier onlyTokenBuyer() {
        require(msg.sender == tokenBuyerWallet);
        _;
    }

    // No zero address transaction
    modifier nonZeroAddress(address _to) {
        require(_to != 0x0);
        _;
    }


    function XcelToken(address _tokenBuyerWallet)
        public
        nonZeroAddress(_tokenBuyerWallet){

        tokenBuyerWallet = _tokenBuyerWallet;
        totalSupply_ = INITIAL_SUPPLY;

        //mint all tokens
        balances[msg.sender] = totalSupply_;
        Transfer(address(0x0), msg.sender, totalSupply_);

        //Allow  token buyer to transfer public sale allocation
        //need to revisit to see if this needs to be broken into 3 parts so that
        //one address does not compromise 60% of token
        require(approve(tokenBuyerWallet, 0));
        require(approve(tokenBuyerWallet, publicSaleSupply));

    }

    /**
        Allow contract owner to burn token
    **/
    function burn(uint256 _value)
      public
      onlyOwner {
        super.burn(_value);
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
        require(!isTeamVestingInitiated);
        teamVestingContractAddress = _teamVestingContractAddress;

        isTeamVestingInitiated = true;
        //transfer team supply to team vesting contract
        require(transfer(_teamVestingContractAddress, teamSupply));


    }

    /**
    @dev allow changing of loyalty wallet as these wallets might be used
    externally by web apps to dispense loyalty rewards and may get compromised
    @param _loyaltyWallet new loyalty wallet address
    **/

    function setLoyaltyWallet(address _loyaltyWallet)
    external
    onlyOwner
    nonZeroAddress(_loyaltyWallet){
        require(loyaltyWallet != _loyaltyWallet);
        loyaltyWallet = _loyaltyWallet;
        LoyaltyWalletAddressChanged(loyaltyWallet, _loyaltyWallet);
    }

    /**
    @dev allocate loyalty as needed from loyalty pool into the current
    loyalty wallet to be disbursed. Note only the allocation needed for a disbursment
    is to be moved to the loyalty wallet as needed.
    @param _totalWeiAmount  amount to move to the wallet in wei
    **/
    function allocateLoyaltySpend(uint256 _totalWeiAmount)
    external
    onlyOwner
    nonZeroAddress(loyaltyWallet)
    returns(bool){
        require(_totalWeiAmount > 0 && loyaltySupply >= _totalWeiAmount);
        loyaltySupply = loyaltySupply.sub(_totalWeiAmount);
        require(transfer(loyaltyWallet, _totalWeiAmount));
        LoyaltySupplyAllocated(loyaltyWallet, _totalWeiAmount);
        return true;
    }

    /**
    @dev assign foundation supply to a contract address
    @param _foundationContractAddress  contract address to dispense the
            foundation alloction
    **/
    function assignFoundationSupply(address _foundationContractAddress)
    external
    onlyOwner
    nonZeroAddress(_foundationContractAddress){
        require(!isFoundationSupplyAssigned);
        isFoundationSupplyAssigned = true;
        require(transfer(_foundationContractAddress, foundationSupply));
    }

    /**
    @dev assign reserve supply to a contract address
    @param _reserveContractAddress  contract address to dispense the
            reserve alloction
    **/
    function assignReserveSupply(address _reserveContractAddress)
    external
    onlyOwner
    nonZeroAddress(_reserveContractAddress){
        require(!isReserveSupplyAssigned);
        isReserveSupplyAssigned = true;
        require(transfer(_reserveContractAddress, reserveFundSupply));
    }

/** We don't want to support a payable function as we are not doing ICO and instead doing private
sale. Therefore we want to maintain exchange rate that is pegged to USD.
**/

    function buyTokens(address _to, uint256 _totalWeiAmount, bytes4 _currency, bytes32 _txHash)
    external
    onlyTokenBuyer
    nonZeroAddress(_to)
    returns(bool) {
        require(_totalWeiAmount > 0 && publicSaleSupply >= _totalWeiAmount);
        publicSaleSupply = publicSaleSupply.sub(_totalWeiAmount);
        require(transferFrom(owner,_to, _totalWeiAmount));
        TokensBought(_to, _totalWeiAmount, _currency, _txHash);
        return true;
    }

    /**
    @dev This unnamed function is called whenever someone tries to send ether to it  and we don't want payment
    coming directly to the contracts
    */
    function () public payable {
        revert();
    }

}
