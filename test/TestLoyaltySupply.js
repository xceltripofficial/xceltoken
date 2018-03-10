const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

contract("XCELTOKEN- loyalty supply", accounts => {
    const tokenBuyerWallet = accounts[2];
    const loyaltyWallet = accounts[4];

    it("Loyalty supply needs loyalty wallet set to allocate", function() {
        var ctr;
        XcelToken.new(tokenBuyerWallet).then( result => {
            ctr = result;
            return ctr.allocateLoyaltySpend(1000);
            }).then(result => {
                assert.fail;
            }).catch(error => {
                assert.include(error.message,
                'VM Exception while processing transaction: revert','Error message does not match');
            });
        });

        it("allocateLoyaltySpend sends <=loyaltySupply to loyalty wallet if wallet is set", function() {
            var ctr;
            XcelToken.new(tokenBuyerWallet).then( result => {
                ctr = result;
                return ctr.setLoyaltyWallet(loyaltyWallet);
            }).then(result => {
                    assert.fail;
            }).catch(error => {
                    assert.include(error.message,
                    'VM Exception while processing transaction: revert','Error message does not match');
                });
            });


  });
