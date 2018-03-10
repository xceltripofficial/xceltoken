const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

var initialTotalSupply = new BigNumber(50 * (10**9) * (10 ** 18));
contract("XcelToken- burn", accounts => {
    const tokenBuyerWallet = accounts[2];

    it("burn should remove from total supply", done => {

        XcelToken.new(tokenBuyerWallet).then( result => {
            ctr = result;
            return ctr.totalSupply();
        }).then(result => {
            assert.isTrue(initialTotalSupply.eq(result));
            //burn 1 billion using the first account that is the owner
            return ctr.burn(1000000000, {from: web3.eth.accounts[0]});
        }).then(result => {
            return ctr.totalSupply();
        }).then(result => {
            assert.isFalse(initialTotalSupply.eq(result));
            assert.isTrue(result.eq(initialTotalSupply.sub(1000000000)));
            done();
      });
    });

    it("burn is ony allowed from owner", done => {

        XcelToken.new(tokenBuyerWallet).then( result => {
            ctr = result;
            return ctr.burn(1000000000, {from: web3.eth.accounts[1]});  //burn 1 billion
        }).then(result => {
            assert.fail;
        }).catch(error => {
            assert.include(error.message,
            'VM Exception while processing transaction: revert','Error message does not match');
            done();
        });

    });

});
