const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

var initialTotalSupply = new BigNumber(50 * (10**9) * (10 ** 18));
contract("XcelTokenBurn", accounts => {
    const tokenBuyerWallet = accounts[2];

    it("burn should remove from total supply", async function() {

        let ctr = await XcelToken.new(tokenBuyerWallet)

        //send a message via call low level method 
        //looks like sol-coverage compilation do not supports inherited methods
        let totalSupply = await ctr.totalSupply.call();

        assert.isTrue(initialTotalSupply.eq(totalSupply));

        //burn 1 billion using the first account that is the owner
        await ctr.burn(1000000000, {from: web3.eth.accounts[0]});

        let totalSupplyAfterBurn = await ctr.totalSupply.call();
        assert.isTrue(totalSupplyAfterBurn.eq(initialTotalSupply.sub(1000000000)));

    });


    it("burn is ony allowed from owner", async function() {

        let ctr = await XcelToken.new(tokenBuyerWallet)

        try{
            await ctr.burn(1000000000, {from: web3.eth.accounts[1]});  //burn 1 billion
            assert.fail(true);    
        }catch(error){
            assert.include(error.message,'revert');
        }

    });

});
