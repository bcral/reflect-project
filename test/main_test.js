
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('REFLECT.sol', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  /////////////////////////////////////////////////////////////////////
  // Global setup variables
  var ownerSupply;
  var getTotalSupply

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Just to make sure this works...`, async function () {

    // Get token name
    let getName = await config.reflect.name.call({from: config.owner});
    assert.equal(getName, "reflect.finance", "Fetches name of coin from contract");

  });

  it(`2. Check total supply.`, async function () {

    // Get total token supply(in contract)
    getTotalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // Total supply should be 10 quadrillion, or 10,000,000,000,000,000
    assert.equal(getTotalSupply, 10000000000000000, "Fetches the total coin supply");

  });

  it(`3. Check balance of owner wallet(address[0])`, async function () {

    // Get balance of owner address
    ownerSupply = await config.reflect.balanceOf.call(config.owner, {from: config.owner});
    // Owner balance should be 10 quadrillion, or 10,000,000,000,000,000
    assert.equal(ownerSupply, 10000000000000000, "Owner wallet owns 100% of all tokens");

  });

  it(`4. Send 50% of tokens to testAddresses[1](Wallet B), and 10% of tokens to testAddresses[2](Wallet C)`, async function () {

    // Find 50% of owner's total balance
    let sendHalfAmount = ownerSupply * 0.5;
    let sendTenthAmount = getTotalSupply * 0.1;
    // Send 50% of owner's tokens to testAddresses[1]
    await config.reflect.transfer(config.testAddresses[1], sendHalfAmount, {from: config.owner});
    // Send 10% of total tokens to testAddresses[1]
    await config.reflect.transfer(config.testAddresses[2], sendTenthAmount, {from: config.testAddresses[1]});
    // Check testAddresses[1] balance
    let bSupply = await config.reflect.balanceOf.call(config.testAddresses[1], {from: config.owner});
    // Wallet B's new balance should be 5 quadrillion, or 5,000,000,000,000,000
    assert.equal(bSupply, 4950000000000000, "No reflections included");

  });

  it(`5. Check testAccount[2](Wallet C)'s balance`, async function () {

    // Check testAddresses[2] balance    
    let cSupply = await config.reflect.balanceOf.call(config.testAddresses[2], {from: config.owner});
    // Wallet C's new balance should be 1 quadrillion, or 1,000,000,000,000,000
    console.log(cSupply.toString())
    assert.equal(cSupply, 990000000000000, "Actual result = 990990990990990");

  });

  it(`5. Check that owner recieved reflection`, async function () {

    // Get balance of owner address
    ownerSupply = await config.reflect.balanceOf.call(config.owner, {from: config.owner});
    // owner's new balance should be something around 5 quadrillion
    console.log(ownerSupply.toString())
    assert.equal(ownerSupply, 5000000000000000, "Actual result = 5030155783924628");

  });
  
});
