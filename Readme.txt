Xceltoken can deployed before StepVesting contract.
A token buyer wallet address is needed to deploy the Xceltoken contract.


Vesting contract is deployed separately and it takes a beneficiary address
It can be multisig or EOA.
Once the vesting contract is deployed, vesting amount of token is sent from
Xceltoken contract by calling the initiateTeamVesting by owner account. It will
send teamsupply to this contract address.

Given
    - cliff vesting of 20% and cliff duration of 6 months
    - step vesting duration of 30 days and 8 partitions
the contract will work the following way.
After 6 months it will vest 20% of team supply and move it to beneficiary
address when release(xceltoken address) is called.
Thereafter after every 30 days 10% will be released to the beneficiary address.
