
const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;
var testPublicSaleSupply = new BigNumber(30 * (10**9) * (10 ** 18));
console.log(testPublicSaleSupply.toString())

contract("XCELTOKEN", accounts => {
    const tokenBuyerWallet = accounts[2];
    // const teamVestingAddress = accounts[3];
    // const teamVestingContractAddress = 0x123;
    const testAddress = accounts[4];


    it("creation: should create an initial balance of 30 bil for the public supply", function(done) {
        var ctr;
        XcelToken.new(tokenBuyerWallet).then( result => {
            ctr = result;
            return ctr.tokenBuyerWallet.call();
    }).then(result => {
        assert.strictEqual(result, tokenBuyerWallet);
        return ctr.publicSaleSupply.call();
    }).then(result => {
        assert.isTrue(testPublicSaleSupply.eq(result));
        //any numner other than the actual number represeneted by testPublicSaleSupply
        assert.isFalse(new BigNumber(10**25).eq(result));
        done();
       }).catch(done);
    });

    it("public supply purchase: token buyer should be able to send 10 xcel token to an address", function(done) {
        var ctr;
        XcelToken.new(tokenBuyerWallet).then(result => {
        ctr = result;
        console.log('contract deployed for tokenbuyer test ' + result);
        //assumes first account in accounts as the owner that was used to deploy the contracts
        return ctr.paused();
    }).then (isPaused => {
        console.log('script paused: ' + isPaused);
         return ctr.balanceOf(testAddress);
     }).then ( result => {
        var beforeBalanceOfTestAddress = result;
        console.log("balance for " + testAddress + " is : " + beforeBalanceOfTestAddress);
        assert.isTrue(beforeBalanceOfTestAddress.eq(new BigNumber(0)));
        return ctr.buyTokens(testAddress, (new BigNumber(10)).times(new BigNumber(10).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});
    }).then(result => {
        console.log(result);
        return ctr.balanceOf(testAddress);
    }).then( result => {
        assert.strictEqual(web3.fromWei(result, 'ether').toNumber(), 10);
        done();
      }).catch(done);

    });

  it("public supply purchase: Anyone other than token buyer should NOT be able to transfer from this supply", done => {

      XcelToken.new(tokenBuyerWallet).then( result => {
          ctr = result;
          return ctr.buyTokens(testAddress, (new BigNumber(10)).times(new BigNumber(10).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: accounts[0]});
      }).then(result => {
          assert.fail;
      }).catch(error => {
          assert.include(error.message,'revert');
          done();
      });
  });

  it("Test _totalWeiAmount bound", done => {

      XcelToken.new(tokenBuyerWallet).then( result => {
          ctr = result;
          //if _totalWeiAmount is not > 0 then  it should revert
          return ctr.buyTokens(testAddress, new BigNumber(0), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});
      }).then(result => {
          assert.fail;
      }).catch(error => {
          assert.include(error.message,'revert');
          return ctr.publicSaleSupply();
      }).then (result => {
          //if _totalWeiAmount is > publicSaleSupply then  it should revert
          return ctr.buyTokens(testAddress, result.add(new BigNumber(1).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});
      }).then (result =>{
          assert.fail;
      }).catch(error =>{
          assert.include(error.message,'revert');
          done();
      });
  });

});
