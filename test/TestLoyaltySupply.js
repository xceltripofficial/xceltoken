const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

contract("XCELTOKEN- loyalty supply", accounts => {
    const tokenBuyerWallet = accounts[2];
    const loyaltyWallet = accounts[4];

    it("Loyalty supply needs loyalty wallet set to allocate", function() {
        var ctr;
        return XcelToken.new(tokenBuyerWallet)
        .then( result => {
            ctr = result;
            return ctr.allocateLoyaltySpend(1000);
        }).then(result => {
                expect.fail();
        }).catch(error => {
                assert.include(error.message,
                'revert');
        });
    });


    it("allocateLoyaltySpend sends <=loyaltySupply to loyalty wallet if wallet is set", function() {
       
         var ctr;
         var initLoyaltySupply;
         return XcelToken.new(tokenBuyerWallet)
       .then( result => {
           ctr = result;
           return ctr.loyaltySupply();
       }).then( result => {
           initLoyaltySupply = result;
           return ctr.setLoyaltyWallet(loyaltyWallet);
       }).then(result => {
           return ctr.loyaltyWallet();
       }).then( result => {
          assert.equal(result , loyaltyWallet);
          return ctr.allocateLoyaltySpend(new BigNumber(100).times(new BigNumber(10).pow(18)));
      }).then(result => {
          return ctr.balanceOf(loyaltyWallet);
      }).then (result => {
          assert.equal(result.dividedBy(new BigNumber(10).pow(18)).toNumber(), 100);
          return ctr.loyaltySupply();
      }).then (result => {
         assert.equal(initLoyaltySupply.dividedBy(new BigNumber(10).pow(18)).toNumber(), result.dividedBy(new BigNumber(10).pow(18)).toNumber() +100 )
      });

     });

  });
