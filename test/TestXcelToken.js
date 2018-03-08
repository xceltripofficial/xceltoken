
const XcelToken = artifacts.require('../contracts/XcelToken.sol')

contract('XcelToken', accounts => {
  const tokenBuyerWallet = accounts[2]
  // const teamVestingAddress = accounts[3];
  // const teamVestingContractAddress = 0x123;

  it('should setup XcelToken with correct init parameters', function() {
    var xcelToken;
    return XcelToken.new(tokenBuyerWallet).then(function(instance) {
      xcelToken = instance;
      xcelToken.name().then(function(name){
        assert.equal(name, "XCELTOKEN", "token name should be XCELTOKEN");
      });
      xcelToken.symbol().then(function(symbol){
        assert.equal(symbol, "XCEL", "token symbol should be XCEL");
      });
      xcelToken.decimals().then(function(decimals){
        assert.equal(decimals, 18, "token decimal places should be 18");
      });
      xcelToken.INITIAL_SUPPLY().then(function(supply){
        assert.equal(supply, 50 * (10 ** 9) * (10 ** 18), "token initial supply should be 50 billion");
      });
      xcelToken.foundationSupply().then(function(foundationSupply){
        assert.equal(foundationSupply, 5 * (10 ** 9) * (10 ** 18), "foundation supply should be 10%");
      });
      xcelToken.teamSupply().then(function(teamSupply){
        assert.equal(teamSupply, 7.5 * (10 ** 9) * (10 ** 18), "team supply should be 15%");
      });
      xcelToken.publicSaleSupply().then(function(publicSaleSupply){
        assert.equal(publicSaleSupply, 30 * (10 ** 9) * (10 ** 18), "public sale supply should be 60%");
      });
      xcelToken.loyaltySupply().then(function(loyaltySupply){
        assert.equal(loyaltySupply, 2.5 * (10 ** 9) * (10 ** 18), "loyalty supply should be 5%");
      });
      xcelToken.reserveFundSupply().then(function(reserveFundSupply){
        assert.equal(reserveFundSupply, 5 * (10 ** 9) * (10 ** 18), "reserve supply should be 10%");
      });
    })
  });

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
  });