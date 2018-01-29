const XclToken = artifacts.require('../contracts/XclToken.sol')

contract('XclToken', function () {

  it("should deploy XclToken with paused as false", function() {
      var xclToken = new XclToken(XclToken.address);

      xclToken.paused().then(function(isPaused){
        assert.equal(isPaused, false, "paused should be initialized to false");
      });

  });

  it("should deploy XclToken paused as false, then true, then false again", function() {
    var xclToken;

    return XclToken.deployed().then(function(instance) {
      xclToken = instance;
      return xclToken.paused();
    }).then(function(isPaused) {
      assert.equal(isPaused, false, "paused should be initialized to false");
      xclToken.pause();
      return xclToken.paused();
    }).then(function(isPaused) {
      assert.equal(isPaused, true, "paused should be set to true");
      xclToken.unpause();
      return xclToken.paused();
    }).then(function(isPaused) {
      assert.equal(isPaused,false,"paused should be set back to false");
    });
  });


});
