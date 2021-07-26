
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
  var walletB;
  var oneT = 1000000000000;

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Fetch total coin supply.`, async function () {

    // Get total token supply(in contract)
    totalSupply = await config.reflect.totalSupply.call({from: config.owner});
    // Total supply should be 1 quadrillion, or 1,000,000,000,000,000
    assert.equal(totalSupply, 1000000000000000, "Fetches the total coin supply");

  });

  it(`2. Mint 1,000,000,000,000 new coins to walletB.`, async function () {

    // Set walletB address
    walletB = config.testAddresses[1];
    // Call mint function of SafeMoon contract
    await config.reflect.mint(walletB, oneT, {from: config.owner});
    // Find new expected supply
    let newSupply = totalSupply.toNumber() + oneT;
    // total supply should be totalSupply + oneT
    assert.equal(newSupply, 1001000000000000, "New amount after first mint to walletB");

  });

//   it(`3. .`, async function () {

//   });

//   it(`4. .`, async function () {

//   });
  
});