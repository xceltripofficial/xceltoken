const XcelToken = artifacts.require('../contracts/XcelToken.sol')

contract('XcelToken', function () {

  it("should deploy XcelToken with paused as false", function() {
      var xcelToken = new XcelToken(XcelToken.address);

      xcelToken.paused().then(function(isPaused){
        assert.equal(isPaused, false, "paused should be initialized to false");
      });

  });

  it("should deploy XcelToken paused as false, then true, then false again", function() {
    var xcelToken;

    return XcelToken.deployed().then(function(instance) {
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
