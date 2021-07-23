
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
    let status = await config.reflect.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  // it(`2. (multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

  //     // Ensure that access is denied for non-Contract Owner account
  //     let accessDenied = false;
  //     try 
  //     {
  //         await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
  //     }
  //     catch(e) {
  //         accessDenied = true;
  //     }
  //     assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  // });
  
});
