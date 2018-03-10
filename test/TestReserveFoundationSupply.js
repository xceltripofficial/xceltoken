const XcelToken = artifacts.require('../contracts/XcelToken.sol')

const BigNumber = web3.BigNumber;

const throwUtils = require('./expectThrow.js');

contract("XCELTOKEN- reserve and foundation supply", accounts => {
    const tokenBuyerWallet = accounts[2];

    it("some address should get reserve supply assigned", async function(){
        const assignReserveSupplyAddr = accounts[5];

        let token = await XcelToken.new(tokenBuyerWallet);

        let balance = await token.balanceOf(assignReserveSupplyAddr);

        let reserveFundSupply = await token.reserveFundSupply();

        await token.assignReserveSupply(assignReserveSupplyAddr);

        let assigned = await token.isReserveSupplyAssigned();

        assert.isTrue(assigned, "Reserve supply should be assigned");

        let newBalance = await token.balanceOf(assignReserveSupplyAddr);

        assert.isTrue(newBalance.gt(balance), "assignReserveSupplyAddr balance should be higher than before");

        assert.isTrue(reserveFundSupply.eq(newBalance), "reserved fund supply should be tranfered to assignReserveSupply address");
    });


    it("assignReserveSupply should fail if it is called twice", async function(){
        const assignReserveSupplyAddr = accounts[6];

        let token = await XcelToken.new(tokenBuyerWallet);

        let balance = await token.balanceOf(assignReserveSupplyAddr);

        let reserveFundSupply = await token.reserveFundSupply();

        await token.assignReserveSupply(assignReserveSupplyAddr);

        let assigned = await token.isReserveSupplyAssigned();

        assert.isTrue(assigned, "Reserve supply should be assigned");

        let newBalance = await token.balanceOf(assignReserveSupplyAddr);

        assert.isTrue(newBalance.gt(balance), "assignReserveSupplyAddr balance should be higher than before");

        assert.isTrue(reserveFundSupply.eq(newBalance), "reserved fund supply should be tranfered to assignReserveSupply address");

        await throwUtils.expectThrow(token.assignReserveSupply(assignReserveSupplyAddr));

    });
    

    it("some address should get foundation supply assigned", async function(){
        const assignFoundationSupplyAddr = accounts[7];

        let token = await XcelToken.new(tokenBuyerWallet);

        let balance = await token.balanceOf(assignFoundationSupplyAddr);

        let foundationSupply = await token.foundationSupply();

        await token.assignFoundationSupply(assignFoundationSupplyAddr);

        let assigned = await token.isFoundationSupplyAssigned();

        assert.isTrue(assigned, "Foundation supply should be assigned");

        let newBalance = await token.balanceOf(assignFoundationSupplyAddr);

        assert.isTrue(newBalance.gt(balance), "assignFoundationSupplyAddr balance should be higher than before");

        assert.isTrue(foundationSupply.eq(newBalance), "foundation supply should be tranfered to assignFoundationSupply address");

    });


    it("assignFoundationSupply should fail if it is called twice", async function(){
        const assignFoundationSupplyAddr = accounts[8];

        let token = await XcelToken.new(tokenBuyerWallet);

        let balance = await token.balanceOf(assignFoundationSupplyAddr);

        let foundationSupply = await token.foundationSupply();

        await token.assignFoundationSupply(assignFoundationSupplyAddr);

        let assigned = await token.isFoundationSupplyAssigned();

        assert.isTrue(assigned, "Foundation supply should be assigned");

        let newBalance = await token.balanceOf(assignFoundationSupplyAddr);

        assert.isTrue(newBalance.gt(balance), "assignFoundationSupplyAddr balance should be higher than before");

        assert.isTrue(foundationSupply.eq(newBalance), "foundation supply should be tranfered to assignFoundationSupply address");

        await throwUtils.expectThrow(token.assignFoundationSupply(assignFoundationSupplyAddr));        
    });

});
