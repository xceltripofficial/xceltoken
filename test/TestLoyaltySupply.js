const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

contract("TestXcelTokenLoyaltySupply", accounts => {
    const tokenBuyerWallet = accounts[2];
    const loyaltyWallet = accounts[4];

    it("Loyalty supply needs loyalty wallet set to allocate", async function() {
        var ctr = await XcelToken.new(tokenBuyerWallet);
        try{
        await ctr.allocateLoyaltySpend(1000);
        expect.fail();
        
        }catch(error){
          assert.include(error.message,'revert');
        }
    });


    it("allocateLoyaltySpend sends <=loyaltySupply to loyalty wallet if wallet is set", async function() {

         
         var initLoyaltySupply;
         var ctr = await XcelToken.new(tokenBuyerWallet);

        initLoyaltySupply = await ctr.loyaltySupply();
        await ctr.setLoyaltyWallet(loyaltyWallet);

        initLoyaltySupplyAfterSetOnWallet = await ctr.loyaltyWallet();

        assert.equal(initLoyaltySupplyAfterSetOnWallet , loyaltyWallet);

        await ctr.allocateLoyaltySpend(new BigNumber(100).times(new BigNumber(10).pow(18)));
        let balance = await ctr.balanceOf.call(loyaltyWallet);

        assert.equal(balance.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);

        finalLoyaltySupply = await ctr.loyaltySupply();
      
        assert.equal(initLoyaltySupply.dividedBy(new BigNumber(10).pow(18)).toNumber(), finalLoyaltySupply.dividedBy(new BigNumber(10).pow(18)).toNumber() +100 );

     });


     it("Setting the same loyalty wallet should fail", async function() {

        let ctr = await XcelToken.new(tokenBuyerWallet);

        await ctr.setLoyaltyWallet(loyaltyWallet);
        
        try{
          await ctr.setLoyaltyWallet(loyaltyWallet);
          assert.fail(true);
         }catch(error){
            assert.include(error.message,'revert');
         }
     });

    it("Test _totalWeiAmount bound", async function() {
             //should fail allocateLoyaltySpend if _totalWeiAmount is not > 0
        let ctr = await XcelToken.new(tokenBuyerWallet);

        try{
          await ctr.allocateLoyaltySpend(new BigNumber(0).toNumber());
          assert.fail(true);

        }catch(error){
            assert.include(error.message,'revert');
            let loyaltySupply  = await ctr.loyaltySupply();

            try{
              await ctr.allocateLoyaltySpend(loyaltySupply.add(new BigNumber(0).pow(18).toNumber()));
              //should fail if _totalWeiAmount is > than loyaltySupply
              assert.fail(true);             
            }catch(error){
              assert.include(error.message,'revert');

            }
         }
     });
});
