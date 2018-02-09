const XclToken = artifacts.require('../contracts/XclToken.sol')

const BigNumber = web3.BigNumber;
var testPublicSaleSupply = new BigNumber(2.5 * 10**28);
console.log(testPublicSaleSupply.toString())

contract("XCELTOKEN", function(accounts) {
    const founderAddress = accounts[1];
    const buyerAddress = accounts[2];
    const testAddress = accounts[3];

    it("creation: should create an initial balance of 25 bil for the public supply", function(done) {
        var ctr;
        XclToken.new(founderAddress, buyerAddress).then(function(result) {
            ctr = result;
            return ctr.tokenBuyerAddr.call();
    }).then(function (result) {
        assert.strictEqual(result, buyerAddress);
        return ctr.publicSaleSupply.call();
    }).then(function(result) {
        assert.isTrue(testPublicSaleSupply.eq(result));
        //any numner other than the actual number represeneted by testPublicSaleSupply
        assert.isFalse(new BigNumber(10**25).eq(result));
        done();
       }).catch(done);
    });

    it("public supply purchase: token buyer should be able to send 10 xcel token to an address", function(done) {
        var ctr;
        XclToken.new(founderAddress, buyerAddress).then(function(result) {
        ctr = result;
        console.log('contract deployed for tokenbuyer test ' + result);
        //assumes first account in accounts as the owner that was used to deploy the contracts
        return ctr.paused();
    }).then (function (isPaused) {
        console.log('script paused: ' + isPaused);
         return ctr.balanceOf(testAddress);
      }).then (function (result) {
        var beforeBalanceOfTestAddress = result;
        console.log("balance for " + testAddress + " is : " + beforeBalanceOfTestAddress);
        assert.isTrue(beforeBalanceOfTestAddress.eq(new BigNumber(0)));
        return ctr.buyTokens(testAddress, (new BigNumber(10)).times(new BigNumber(10).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: buyerAddress});
      }).then(function (result) {
        console.log(result);
        return ctr.balanceOf(testAddress);
      }).then(function (result) {
        assert.strictEqual(web3.fromWei(result, 'ether').toNumber(), 10);
        done();
      }).catch(done);

    });

  });
