const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');

const StepVesting = artifacts.require('StepVesting');

contract('TestStepVesting', function ([_, owner, beneficiary]) {

  const amount = new BigNumber(1000);


  beforeEach(async function () {

    this.token = await MintableToken.new({ from: owner });
    console.log('MintableToken :'+ this.token.address);
    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    this.vesting = await StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true,
      {from: owner}
      );

    await this.token.mint(this.vesting.address, amount, { from: owner });


  });

  it('cannot be released before cliff', async function () {

    await this.vesting.release(this.token.address).should.be.rejectedWith('revert');

  });


  it('can be released after cliff', async function () {

    await timeUtils.increaseTimeTo(this.start + this.cliffDuration + timeUtils.duration.weeks(1));

    await this.vesting.release(this.token.address).should.be.fulfilled;

  });

  it('should release 20% of amount after cliff', async function () {
    await timeUtils.increaseTimeTo(this.start + this.cliffDuration + timeUtils.duration.weeks(1));

    const { receipt } = await this.vesting.release(this.token.address);

    const releaseTime = web3.eth.getBlock(receipt.blockNumber).timestamp;

    const balance = await this.token.balanceOf(beneficiary);

    balance.should.bignumber.equal(amount.mul(20).div(100));
  });

  it('should release 10% tokens on each month after cliff during vesting period', async function () {

    const checkpoints = 8;

    console.log("start:"+new Date(this.start*1000).toISOString());
    console.log("cliff:"+new Date((this.start + this.cliffDuration)*1000).toISOString());

    for (let i = 1; i <= checkpoints; i++) {

      const now = this.start+this.cliffDuration+ timeUtils.duration.minutes(1) + (i*this.stepVestingDuration);

      console.log("now:"+new Date(now*1000).toISOString());

      await timeUtils.increaseTimeTo(now);

      const { receipt }  = await this.vesting.release(this.token.address);
      const balance = await this.token.balanceOf(beneficiary);

      const monthVesting = new BigNumber(i); //how many months will be vested.
      //we are vesting after cliff, so we expect 10% and added 20% by default
      const monthVestingPercentage = monthVesting.mul(10).plus(20);

      const expectedVesting = amount.mul(monthVestingPercentage).div(100);

      console.log("actual:"+balance + " - expecting:"+ expectedVesting);

      balance.should.bignumber.equal(expectedVesting);
    }
  });


});
