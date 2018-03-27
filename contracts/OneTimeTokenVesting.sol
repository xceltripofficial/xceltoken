pragma solidity ^0.4.18;


import "zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";
import "zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract OneTimeTokenVesting is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for ERC20Basic;

  event Released(uint256 amount);
  event Revoked();

  // beneficiary of tokens after they are released
  address public beneficiary;

  uint256 public start;
  uint256 public duration;
  uint256 public changeVestingTimeframe;

  bool public revocable;

  mapping (address => uint256) public released;
  mapping (address => bool) public revoked;

  /**
   * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
   * _beneficiary, all in one step.
   * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
   * @param _duration duration in seconds of the period in which the tokens will vest
   * @param _changeVestingTimeframe time in seconds of the time frame from latest blockchain time in which changing vesting duration is allowed
   * @param _revocable whether the vesting is revocable or not
   */
  function OneTimeTokenVesting(address _beneficiary, uint256 _start, uint256 _duration, uint256 _changeVestingTimeframe, bool _revocable) public {
    require(_beneficiary != address(0));
    require(_start >= block.timestamp);
    require(_duration > 0);
    require(_changeVestingTimeframe > 0);

    beneficiary = _beneficiary;
    revocable = _revocable;
    duration = _duration;
    start = _start;
    changeVestingTimeframe = _changeVestingTimeframe;
  }

  /**
   * @notice Transfers vested tokens to beneficiary.
   * @param token ERC20 token which is being vested
   */
  function release(ERC20Basic token) public {
    uint256 unreleased = releasableAmount(token);

    require(unreleased > 0);

    released[token] = released[token].add(unreleased);

    token.safeTransfer(beneficiary, unreleased);

    Released(unreleased);
  }

  /**
   * @notice Allows the owner to revoke the vesting. Tokens already vested
   * remain in the contract, the rest are returned to the owner.
   * @param token ERC20 token which is being vested
   */
  function revoke(ERC20Basic token) public onlyOwner {
    require(revocable);
    require(!revoked[token]);

    uint256 balance = token.balanceOf(this);

    uint256 unreleased = releasableAmount(token);
    uint256 refund = balance.sub(unreleased);

    revoked[token] = true;

    token.safeTransfer(owner, refund);

    Revoked();
  }

  /**
   * @dev Calculates the amount that has already vested but hasn't been released yet.
   * @param token ERC20 token which is being vested
   */
  function releasableAmount(ERC20Basic token) public view returns (uint256) {
    return vestedAmount(token).sub(released[token]);
  }

  /**
   * @dev Calculates the amount that has already vested.
   * @param token ERC20 token which is being vested
   */
  function vestedAmount(ERC20Basic token) public view returns (uint256) {
    uint256 currentBalance = token.balanceOf(this);
    uint256 totalBalance = currentBalance.add(released[token]);

    if (now <= start.add(duration)) {
      return 0;
    } else {
      return totalBalance;
    }
  }

  function changeVestingDuration(uint256 newDuration, ERC20Basic token) public onlyOwner {
    require(now.add(changeVestingTimeframe) < start.add(newDuration));

    if(revocable){
        require(!revoked[token]);
    }
    duration = newDuration;
  }
}
