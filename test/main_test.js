
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('REFLECT.sol', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Just to make sure this works...`, async function () {

    // Get operating status
    let getName = await config.reflect.name.call({from: config.owner});
    assert.equal(getName, "reflect.finance", "Fetches name of coin from contract");

  });
  
});
