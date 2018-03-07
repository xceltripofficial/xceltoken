module.exports.expectThrow = async function(promise){
    try{
      await promise;
    } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    //this msg is thrown by truffle if there is an error when constructor is called.
    //be careful with this message
    //https://github.com/ethereum/web3.js/blob/master/lib/web3/contract.js#L147
    const gasAmount = error.message.search('please check your gas amount') >= 0;

    assert(
      invalidOpcode || outOfGas || revert || gasAmount,
      'Expected throw, got \'' + error + '\' instead',
    );
    return;
  }
  assert.fail('Expected throw not received');
  

}