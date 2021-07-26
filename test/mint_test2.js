
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('REFLECT.sol', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

    /////////////////////////////////////////////////////////////////////
  // Global setup variables
  var totalSupply;
  var originalSupply;
  // wallet addresses
  var walletB;
  var walletC;
  var walletD;
  // values for holding larger numbers, to prevent typos
  var oneT = 1000000000000;
  var oneM = 1000000;
  // tokenomics
  var tax = 0.05;
  var dist = 0.025;
  var distAmnt;
  // store for global use
  var CSupply;

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Fetch total coin supply.`, async function () {

    // Get total token supply(in contract)
    originalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // Total supply should be 1 quadrillion, or 1,000,000,000,000,000
    assert.equal(originalSupply, 1000000000000000, "Fetches the total coin supply");

  });

  it(`2. Mint 1,000,000,000,000 new coins to walletB.`, async function () {

    // Set walletB address
    walletB = config.testAddresses[1];
    // Call mint function of SafeMoon contract
    await config.reflect.mint(walletB, oneT, {from: config.owner});
    // Find new expected supply
    let newSupply = originalSupply.toNumber() + oneT;
    // Find actual current supply
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // total supply should be totalSupply + oneT
    assert.equal(totalSupply, newSupply, "New amount after first mint to walletB");

  });

  it(`3. Mint 1,000,000 new coins to walletC.`, async function () {

    // Set walletC address
    walletC = config.testAddresses[2];
    // Call mint function of SafeMoon contract
    await config.reflect.mint(walletC, oneM, {from: config.owner});
    // Find new expected supply
    let newSupply = totalSupply.toNumber() + oneM;
    // Find actual current supply
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // total supply should be totalSupply + oneT
    assert.equal(newSupply, newSupply, "New amount after first mint to walletC");

  });

  it(`4. Check balance of walletB.`, async function () {
    // Get balance of walletB address
    let BSupply = await config.reflect.balanceOf.call(walletB, {from: config.owner});
    // Owner balance should be 1,000,000,000,000
    assert.equal(BSupply, oneT, "walletB contains 1,000,000,000,000 coins.");
  });
  
  it(`5. Check balance of walletC.`, async function () {
    // Get balance of walletC address
    let CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});
    // Owner balance should be 1,000,000
    assert.equal(CSupply, oneM, "walletC contains 1,000,000 coins.");
  });

  /****************************************************************************************/
  /* Test Reflection AFTER Minting                                                        */
  /****************************************************************************************/

  it(`6. Transfer 1,000,000,000,000 from walletB to walletD.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Get balance of walletD address BEFORE transfer
    let originalDSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});

    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(walletD, oneT, {from: walletB});
    // Get balance of walletD address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // Find out what value is expected(value transfered - tax)
    let res = oneT - (oneT * tax);
    // Store distribution amount globaly
    distAmnt = (oneT * tax) / 2;
    // Log the value of walletD BEFORE transfer, to ensure it is 0
    console.log(originalDSupply);
    // walletD balance should be 1,000,000,000,000 - tax
    // DSupply should equal "res", which is 950000000000
    // Actual result, 950047455820, is not equal to 95% of the transfer
    assert.equal(DSupply, res, "walletD contains 1,000,000,000,000 coins - tax.");

  });

  it(`7. Check distribution paid out to walletC.`, async function () {

    // Find out what value is expected(value transfered in test 6 + dist / perecentage of total)
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    let percSupply = CSupply.toNumber() / totalSupply.toNumber();
    let reward = oneT * dist;
    let res = reward * percSupply;
    let addedReward = res + CSupply.toNumber();
    console.log(addedReward);
    // Current balance of walletC should be 1,000,000 + distribution
    let currentCSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});
    // Use Math.floor() to simulate Solidity's rounding down of decimals
    assert.equal(currentCSupply, Math.floor(addedReward), "walletC contains 1,000,000 coins + distribution.");
  });

  it(`8. Just checking total supply.`, async function () {

    // Find the total supply
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // Should be 1,001,000,001,000,000
    assert.equal(totalSupply, 1001000001000000, "Total supply should be 1,001,000,001,000,000");
  });

});