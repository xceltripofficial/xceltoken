
const XcelToken = artifacts.require('../contracts/XcelToken.sol')

contract('XcelToken', accounts => {
  const owner = accounts[0];
  const tokenBuyerWallet = accounts[2];
  // const teamVestingAddress = accounts[3];
  // const teamVestingContractAddress = 0x123;

  describe('constructor', () => {

    it('returns the expected public variables', async () => {
      let token = new XcelToken(tokenBuyerWallet)
      const tokenName = await token.name()
      const tokenSymbol = await token.symbol()
      const tokenDecimals = await token.decimals()
      const tokenSupply = await token.initialSupply()

      assert.equal(tokenName, 'XCELTOKEN')
      assert.equal(tokenSymbol, 'XCEL')
      assert.equal(tokenDecimals.toNumber(), 18)
      assert.equal(tokenSupply.toNumber(), 50 * (10 ** 9) * (10 ** uint256(18)))
    })

    it('returns the totalSupply', async () => {
      let token = new XcelToken(tokenBuyerWallet)
      const initialSupply = await token.initialSupply()
      const totalSupply = await token.totalSupply()

      assert.equal(totalSupply.toNumber(), initialSupply.toNumber())
      assert.equal(totalSupply.toNumber(), tkrToTkrSmall(65500000))
    })

    it('sets the correct owner of the contract', async () => {
      let token = new XcelToken(tokenBuyerWallet)
      assert.equal(await token.owner(), owner)
    })

    it('stores the entire initial balance in the owner account', async () => {
      let token = XcelToken.new()
      const ownerBalance = await token.balanceOf(owner)
      assert.equal(ownerBalance.toNumber(), tkrToTkrSmall(65500000))
    })

  })

  describe('Pause / Unpause', () => {

    it("should deploy XcelToken with paused as false", function() {
        var xcelToken = new XcelToken(tokenBuyerWallet);

        xcelToken.paused().then(function(isPaused){
          assert.equal(isPaused, false, "paused should be initialized to false");
        });

    });

    it("should deploy XcelToken paused as false, then true, then false again", function() {
      var xcelToken;

      return XcelToken.new(tokenBuyerWallet).then(function(instance) {
        xcelToken = instance;
        return xcelToken.paused();
      }).then(function(isPaused) {
        assert.equal(isPaused, false, "paused should be initialized to false");
        xcelToken.pause();
        return xcelToken.paused();
      }).then(function(isPaused) {
        assert.equal(isPaused, true, "paused should be set to true");
        xcelToken.unpause();
        return xcelToken.paused();
      }).then(function(isPaused) {
        assert.equal(isPaused,false,"paused should be set back to false");
      });
    });
  })

});
