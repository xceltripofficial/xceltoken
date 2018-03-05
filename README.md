# ERC20 token with the following functionality

1. ERC20 contract
2. Owner can pause /unpause the contract
3. Token allocation of team managed by a step vesting contract that vests to a beneficiary addresses


## Development env settings
### Install
1. Clone this repo. Nodejs and npm are assumed to be installed.
2. Install truffle `npm install -g truffle`
2. Under xcltoken do `npm install zeppelin-solidity` to install the solidity libraries

### Compile and deploy on local testnet  (truffle.js uses the default Ganace settings)
1. `truffle compile`    - this compiles solidity contracts under contracts/ folder  
2. `truffle migrate --reset`    - this deployes using the default n/w. Else specify using --network <name>

## Testing

### Running tests

#### Manual tests using truffle console
1. Run [ganache](http://truffleframework.com/ganache/) personal ethereum blockchain
2. Open truffle console using this command from the project directory
     `truffle console`
3. In the console you can perfrom following test  
   - `var xceltoken = XcelToken.at(XcelToken.address)`
   - `xceltoken.paused()`  should show false
   - `xceltoken.pause()`   should execute the pause call that you can verify in Ganache
   - `xceltoken.paused()`  should show true as the state in the contract is now changed

#### Running Truffle Tests
1. run ganache local blockchain and make sure mapping for development env exists in truffle.js
2. run `truffle test` to run the tests under test folder

## ToDo:
1. Tasks to be added

##### Tested with following versions:
1. node v9.3.0 , npm 5.6.0
2. Truffle v4.1.0 (core: 4.1.0)
3. Solidity v0.4.19 (solc-js)
4. Ganache 1.0.1
