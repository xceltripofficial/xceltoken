const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');

const StepVesting = artifacts.require('StepVesting');
//const MintableToken = artifacts.require('../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol');

contract('StepVesting', function ([_, owner, beneficiary]) {

  const amount = new BigNumber(1000);


    it('cannot be released before cliff', async function () {

    this.token = await MintableToken.new({ from: owner });
    console.log('MintableToken :'+ this.token.address);
    this.start = latestTime() + duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = duration.days(30);
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
      true
      );

    await this.token.mint(this.vesting.address, amount, { from: owner });

    await this.vesting.release(this.token.address).should.be.rejectedWith('revert');


  });


  it('can be released after cliff', async function () {

    this.token = await MintableToken.new({ from: owner });

    this.start = latestTime() + duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    // this.duration = duration.years(1);

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

    await increaseTimeTo(this.start + this.cliffDuration + duration.weeks(1));

    await this.token.mint(this.vesting.address, amount, { from: owner });

    await this.vesting.release(this.token.address).should.be.fulfilled;

  });

});



/*helper funcions, NO ECS6 version*/

function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}



function increaseTime (duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

/**
 * Beware that due to the need of calling two separate testrpc methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target time in seconds
 */
function increaseTimeTo (target) {
  let now = latestTime();
  if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
  let diff = target - now;
  return increaseTime(diff);
}

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};
