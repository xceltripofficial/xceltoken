const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');

const StepVesting = artifacts.require('StepVesting');

contract('StepVesting', function ([_, owner, beneficiary]) {

  const amount = new BigNumber(1000);

  it('can be released 100% after cliff', async function () {

    this.token = await MintableToken.new({ from: owner });
    
    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = 1;
    this.cliffPercent = 20;
    this.stepVestingDuration = 1;
    this.stepVestingPercent = 80;
    this.numberOfPartitions = 1;

    this.vesting = await StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
      );

    await this.token.mint(this.vesting.address, amount, { from: owner });

    let va = await this.vesting.vestedAmount(this.token.address);

	va.should.bignumber.equal(new BigNumber(0));

	//increase 2 sec
    const now = this.start + this.cliffDuration + 2;

    await timeUtils.increaseTimeTo(now);

	va = await this.vesting.vestedAmount(this.token.address);

	va.should.bignumber.equal(amount);

    await this.vesting.release(this.token.address).should.be.fulfilled;

  });

});
