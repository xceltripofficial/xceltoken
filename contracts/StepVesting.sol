pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";
import "zeppelin-solidity/contracts/examples/SimpleToken.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract StepVesting is TokenVesting {
    using SafeMath for uint256;
/**
   * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
   * _beneficiary, in step fashion until _start + _duration. By then all
   * of the balance will have vested. Duration is computed as _cliff + (_stepVestingDuration * _numberOfPartitions)
   * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
   * @param _start start date of vesting schedule in epoch
   * @param _cliffDuration duration in seconds of the cliff in which tokens will begin to vest
   * @param _cliffPercent % to be vested at cliff
   * @param _stepVestingPercent % to be vested at each partitions
   * @param _stepVestingDuration duration for each step vesting
   * @param _numberOfPartitions number of partitions in which duration less cliff period is divided (from 1 - 8 max)
   * @param _revocable whether the vesting is revocable or not
   */

    /*
    *sample:
    *_cliffPeriod = 2592000; // ~30dys
    *_numberOfPartitions = 8; // eight months if stepVestingDuration is 30 days
    */

    uint256 public cliffPercent;

    uint256 public stepVestingPercent;

    uint256 public numberOfPartitions;

    uint256 public stepVestingDuration;

    function StepVesting(address _beneficiary, uint256 _start, uint256 _cliffDuration, uint256 _cliffPercent, uint256 _stepVestingDuration, uint256 _stepVestingPercent, uint256 _numberOfPartitions,  bool _revocable)
        TokenVesting(_beneficiary, _start, _cliffDuration, _cliffDuration.add(_stepVestingDuration.mul(_numberOfPartitions)), _revocable) public {

        require(_beneficiary != address(0));
        require(_start >= block.timestamp);
        require(_cliffDuration > 0);
        require(_cliffPercent > 0);
        require(_stepVestingDuration > 0);
        require(_stepVestingPercent > 0);
        require(_numberOfPartitions > 0);

        require(_cliffPercent.add(_stepVestingPercent.mul(_numberOfPartitions)) == 100);

        cliffPercent = _cliffPercent;
        stepVestingPercent = _stepVestingPercent;
        numberOfPartitions = _numberOfPartitions;
        stepVestingDuration = _stepVestingDuration;


    }

  /**
   * override
   * @dev Calculates the amount that has already vested.
   * @param token ERC20 token which is being vested
   */

    function vestedAmount(ERC20Basic token) public constant returns (uint256) {
        uint256 currentBalance = token.balanceOf(this);
        uint256 totalBalance = currentBalance.add(released[token]);

        if (now < cliff) {
            return 0;
        } else if (now >= start.add(duration) || revoked[token]) {
            return totalBalance;
        } else if (now >= cliff && now < cliff.add(stepVestingDuration) ) {
            return totalBalance.mul(cliffPercent).div(100);
        } else {
            //add cliff% plus vesting as per no of stepVestingDuration.  / should just give the
            //quotient of devision
            uint256 vestingPercentage = cliffPercent.add(  (now.sub(cliff).div(stepVestingDuration)).mul(stepVestingPercent) );
            return totalBalance.mul(vestingPercentage).div(100);
         }
    }

}
