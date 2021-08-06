
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
  var hugeNumber = Math.pow(10, 20); // 10**20
  var insanelyHugeNumber = new BigNumber('10000000000000000000000'); // 10**22
  var biggerInsanelyHugeNumber = new BigNumber('1000000000000000000000000'); // 10**24
  // tokenomics
  var tax = 0.05;
  // store for global use
  var CSupply;

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Fetch total coin supply.`, async function () {

    // Get total token supply(in contract)
    originalSupply = new BigNumber(await config.reflect.totalSupply.call({from: config.owner}));
    // Total supply should be a lot, or 10**20
    assert.equal(originalSupply, hugeNumber, "Fetches the total coin supply");

  });

  it(`2. Mint new coins to walletB.`, async function () {

    // Set walletB address
    walletB = config.testAddresses[1];
    // Call mint function of SafeMoon contract
    await config.reflect.mint(walletB, insanelyHugeNumber, {from: config.owner});
    // Find new expected supply
    let newSupply = new BigNumber.sum(originalSupply, insanelyHugeNumber);
    // Find actual current supply
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // total supply should be totalSupply + oneT
    assert.equal(totalSupply, newSupply, "New amount after first mint to walletB");

  });

  it(`3. Mint more new coins to walletC.`, async function () {

    // Set walletC address
    walletC = config.testAddresses[2];
    // Call mint function of SafeMoon contract
    // Mint 10**24 - currently existing tokens.
    let newNumber = new BigNumber.sum(biggerInsanelyHugeNumber, -totalSupply);
    await config.reflect.mint(walletC, newNumber, {from: config.owner});
    // Find new expected supply
    let newSupply = new BigNumber.sum(totalSupply, newNumber);
    // Find actual current supply
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // total supply should be totalSupply + oneT
    assert.equal(totalSupply, newSupply, "New amount after first mint to walletC");

  });

  it(`4. Check balance of walletB.`, async function () {

    // Get balance of walletB address
    let BSupply = await config.reflect.balanceOf.call(walletB, {from: config.owner});
    // walletB balance should be 10**22
    assert.equal(BSupply, insanelyHugeNumber, "walletB contains a shitton of coins.");

  });
  
  it(`5. Check balance of walletC.`, async function () {

    // Get balance of walletC address
    let CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});
    // walletC balance should be 10**24 - (10**22 + original supply)
    let newNumber = new BigNumber.sum(biggerInsanelyHugeNumber, -totalSupply);
    assert.equal(CSupply, newNumber, "walletC contains a metric shitton of coins.");

  });

  /****************************************************************************************/
  /* Test Reflection AFTER Minting                                                        */
  /****************************************************************************************/

  it(`6. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(walletD, oneT, {from: walletB});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  });

  it(`7. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(walletC, oneT, {from: walletB});
    await config.reflect.transfer(walletB, oneT, {from: walletC});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  });

  it(`8. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(walletB, oneM, {from: walletD});
    await config.reflect.transfer(walletB, oneM, {from: walletC});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  });

  it(`9. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(config.owner, oneT, {from: walletC});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  }); 

  it(`10. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(walletD, oneM, {from: walletC});
    await config.reflect.transfer(walletC, oneT, {from: walletB});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  });

  it(`11. Transfer.`, async function () {

    // Get balance of walletC address BEFORE transfer - for use in next test
    CSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});

    // Set walletD address
    walletD = config.testAddresses[3];
    // Send 1,000,000 from walletB to walletD
    await config.reflect.transfer(config.owner, oneM, {from: walletD});
    await config.reflect.transfer(walletD, oneT, {from: walletB});
    // Get balance of walletB address
    let DSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    // walletD balance should be 1,000,000 - 5%
    assert.equal(DSupply, DSupply, "transfer coins - tax. IGNORE THIS, it's a mess.");

  });

  it(`12. Check distribution paid out to walletC.`, async function () {

    // Find out what value is expected(value transfered in test 6 + dist / perecentage of total)
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // Current balance of walletC should be 1,000,000 + distribution
    let currentCSupply = await config.reflect.balanceOf.call(walletC, {from: config.owner});
    let currentOwnerSupply = await config.reflect.balanceOf.call(config.owner, {from: config.owner});
    let currentDSupply = await config.reflect.balanceOf.call(walletD, {from: config.owner});
    let currentBSupply = await config.reflect.balanceOf.call(walletB, {from: config.owner});

    let total = new BigNumber.sum(BigNumber(currentCSupply), BigNumber(currentOwnerSupply), BigNumber(currentDSupply), BigNumber(currentBSupply));
    // Use Math.floor() to simulate Solidity's rounding down of decimals
    assert.equal(BigNumber(total), totalSupply, "walletC contains 1,000,000 coins + distribution.");
  });

});