const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const OneTimeTokenVesting = artifacts.require('OneTimeTokenVesting');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('TestOneTimeTokenVestingConstructor', function ([_, owner, beneficiary]) {

  it('should fail to deploy if beneficiary address is zero address', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.vestingDuration = timeUtils.duration.days(30);

    await throwUtils.expectThrow ( OneTimeTokenVesting.new(
      ZERO_ADDRESS,
      this.start,
      this.vestingDuration,
      true
    ));
  });

  it('should fail to deploy if start time is less to blockchain start time ', async function () {

    console.log("latest time in the blockchain:"+timeUtils.latestTime())
    console.log("actual time:"+ ((Date.now()-3000)/1000));

    this.start = (Date.now()-3000)/1000; // -5 minutes so it starts before blockchain state
    this.vestingDuration = timeUtils.duration.days(30);

    await throwUtils.expectThrow ( OneTimeTokenVesting.new(
      beneficiary,
      this.start,
      this.vestingDuration,
      true
    ));
  });


  it('should fail to deploy if vesting duration is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.vestingDuration = 0;

    await throwUtils.expectThrow ( OneTimeTokenVesting.new(
      beneficiary,
      this.start,
      this.vestingDuration,
      true
    ));
  });


});
