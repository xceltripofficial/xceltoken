const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const StepVesting = artifacts.require('StepVesting');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('StepVestingConstructor', function ([_, owner, beneficiary]) {

  it('should fail to deploy if beneficiary address is zero address', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      ZERO_ADDRESS,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });

  it('should fail to deploy if start time is less to blockchain start time ', async function () {

    console.log("latest time in the blockchain:"+timeUtils.latestTime())
    console.log("actual time:"+(Date.now()-300)/1000);

    this.start = (Date.now()-300)/1000; // -5 minutes so it starts before blockchain state
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });


  it('should fail to deploy if cliffDuration is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = 0;
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });


it('should fail to deploy if cliff percentage is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 0;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });


it('should fail to deploy if step vesting duration is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = 0;
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });

it('should fail to deploy if step vesting percentage is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 0;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });


it('should fail to deploy if number of partitios is equals to zero', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 0;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });


  it('should fail to deploy if % does not add upto 100%', async function () {

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 21;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
    ));
  });

});
