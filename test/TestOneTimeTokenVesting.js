const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');
const OneTimeTokenVesting = artifacts.require('OneTimeTokenVesting');

contract('TestOneTimeTokenVesting', function ([_, owner, beneficiary]) {

  const amount = new BigNumber(1000);

  beforeEach(async function () {

    this.token = await MintableToken.new({ from: owner });
    console.log('MintableToken :'+ this.token.address);
    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.vestingDuration = timeUtils.duration.days(30);

    this.vesting = await OneTimeTokenVesting.new(
      beneficiary,
      this.start,
      this.vestingDuration,
      true
      ,{ from: owner }
      );

    await this.token.mint(this.vesting.address, amount, { from: owner });

  });

  it('cannot be released before vesting duration ends', async function () {

    await this.vesting.release(this.token.address).should.be.rejectedWith('revert');

  });


  it('should release 100% after vesting duration ends', async function () {

    await timeUtils.increaseTimeTo(this.start + this.vestingDuration + timeUtils.duration.weeks(1));

    const expectedVesting = amount;

    let releasableAmount = await this.vesting.releasableAmount(this.token.address);
    releasableAmount.should.bignumber.equal(amount);

    await this.vesting.release(this.token.address).should.be.fulfilled;

    const vestedAmount = await this.vesting.vestedAmount(this.token.address).should.be.fulfilled;
    vestedAmount.should.bignumber.equal(expectedVesting);
    
    const balance = await this.token.balanceOf(beneficiary);
    balance.should.bignumber.equal(expectedVesting);    

    releasableAmount = await this.vesting.releasableAmount(this.token.address);
    releasableAmount.should.bignumber.equal(new BigNumber(0));

  });

  it('should be able to change vesting duration to a higher value', async function () {

    const newVestingDuration = timeUtils.duration.days(60);

    let tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(this.vestingDuration);

    await this.vesting.changeVestingDuration(newVestingDuration, this.token.address, { from: owner }).should.be.fulfilled;

    tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(newVestingDuration);

  });

  it('should be able to change vesting duration to a lower value but now lower than blockchain time', async function () {

    const newVestingDuration = timeUtils.duration.days(15);

    assert.isBelow(timeUtils.latestTime() , this.start + newVestingDuration, "check if any other test increased blockchain latesttime");

    let tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(this.vestingDuration);

    await this.vesting.changeVestingDuration(newVestingDuration, this.token.address, { from: owner }).should.be.fulfilled;

    tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(newVestingDuration);

  });

  it('should be able to release 100% after changing vesting duration to a lower value', async function () {

    const newVestingDuration = timeUtils.duration.days(12);

    assert.isBelow(timeUtils.latestTime() , this.start + newVestingDuration, "check if any other test increased blockchain latesttime");

    let tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(this.vestingDuration);

    await this.vesting.changeVestingDuration(newVestingDuration, this.token.address, { from: owner }).should.be.fulfilled;

    tokenVestingDuration = await this.vesting.duration();
    tokenVestingDuration.should.bignumber.equal(newVestingDuration);


    const expectedVesting = amount;

    await timeUtils.increaseTimeTo(this.start + newVestingDuration + timeUtils.duration.days(1));

    let releasableAmount = await this.vesting.releasableAmount(this.token.address);
    releasableAmount.should.bignumber.equal(amount);

    await this.vesting.release(this.token.address).should.be.fulfilled;

    const vestedAmount = await this.vesting.vestedAmount(this.token.address).should.be.fulfilled;
    vestedAmount.should.bignumber.equal(expectedVesting);
    
    const balance = await this.token.balanceOf(beneficiary);
    balance.should.bignumber.equal(expectedVesting);    

    releasableAmount = await this.vesting.releasableAmount(this.token.address);
    releasableAmount.should.bignumber.equal(new BigNumber(0));

  });

});
