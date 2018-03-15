
const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;
var testPublicSaleSupply = new BigNumber(30 * (10**9) * (10 ** 18));
console.log(testPublicSaleSupply.toString())

contract("TestXcelTokenBuyer", accounts => {
    const tokenBuyerWallet = accounts[2];
    // const teamVestingAddress = accounts[3];
    // const teamVestingContractAddress = 0x123;
    const testAddress = accounts[4];


    it("creation: should create an initial balance of 30 bil for the public supply", async function() {
        var ctr = await XcelToken.new(tokenBuyerWallet)
        let tokenBuyerWalletResult = await ctr.tokenBuyerWallet.call();

        assert.strictEqual(tokenBuyerWalletResult, tokenBuyerWallet);

        let publicSaleSupplyResult = await ctr.publicSaleSupply.call();

        assert.isTrue(testPublicSaleSupply.eq(publicSaleSupplyResult));
        //any numner other than the actual number represeneted by testPublicSaleSupply
        assert.isFalse(new BigNumber(10**25).eq(publicSaleSupplyResult));

    });

    it("public supply purchase: token buyer should be able to send 10 xcel token to an address", async function() {
        var ctr = await XcelToken.new(tokenBuyerWallet);

        //assumes first account in accounts as the owner that was used to deploy the contracts
        let isPaused = await ctr.paused.call();
        console.log('script paused: ' + isPaused);

        var beforeBalanceOfTestAddress = await ctr.balanceOf.call(testAddress);
        console.log("balance for " + testAddress + " is : " + beforeBalanceOfTestAddress);
        assert.isTrue(beforeBalanceOfTestAddress.eq(new BigNumber(0)));
        let buyTokenResult = await ctr.buyTokens(testAddress, (new BigNumber(10)).times(new BigNumber(10).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});

        let balance = await ctr.balanceOf.call(testAddress);

        assert.strictEqual(web3.fromWei(balance, 'ether').toNumber(), 10);

    });

  it("public supply purchase: Anyone other than token buyer should NOT be able to transfer from this supply", async function() {

      let ctr = await XcelToken.new(tokenBuyerWallet);

      try{
        await ctr.buyTokens(testAddress, (new BigNumber(10)).times(new BigNumber(10).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: accounts[0]});
        assert.fail(true);
      }catch(error){
          assert.include(error.message,'revert');
      }

  });

  it("Test _totalWeiAmount bound", async function() {

      let ctr = await XcelToken.new(tokenBuyerWallet);
      try{
          //if _totalWeiAmount is not > 0 then  it should revert
        await ctr.buyTokens(testAddress, new BigNumber(0), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});
        assert.fail(true);
      }catch(error){
          assert.include(error.message,'revert');

          let publicSaleSupplyResult = await ctr.publicSaleSupply();

          try{
            await ctr.buyTokens(testAddress, publicSaleSupplyResult.add(new BigNumber(1).pow(18)), 'BTC', '0x4ed593e3b0f41cecd0de314c8e701361d3ad850f6bf252af4da9ef3a39fc6988',{from: tokenBuyerWallet});
            assert.fail(true);
          }catch(error){
            assert.include(error.message,'revert');
          }
      }
  });

});
