const XcelToken = artifacts.require('./XcelToken.sol')
  contract('XcelTokenWithAsync', accounts => {
    let xcelToken
    const tokenBuyerWallet = accounts[2]
    beforeEach('setup contract for each test', async function () {
      xcelToken = await XcelToken.new(tokenBuyerWallet)
    })

    it('has an owner', async function () {
      assert.equal(await xcelToken.owner(), accounts[0])
    });

    it('should not accept funds', async function () {

      try{
          await xcelToken.sendTransaction({ value: 1e+18, from: accounts[0] })
          assert.fail(true);
      }catch(error) {
          assert(error.toString().includes('revert'), error.toString())
      }
    });
});
