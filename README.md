Notes for running dev environment:

From reflect-project file:

$ npm install 
(maybe required) $ truffle install
(Now launche local ganache blockchain.  Should be installed with truffle)
$ ganache-cli -m "three elevator bus mutual celery belt priority mistake lemon supply dog time"

(open new terminal window and enter)
truffle test

(If all is well, truffle should run one test, and it should pass.  It just calls the name() function and compares the returned value with the expected value.)

////////////////////////////////////////////////////////////////////////////////////
Minting Test Notes:

run test(after ganache is running) with:

$ truffle test ./test/mint_test.js

This line in SafeMoon contract seems to cause addition overflow reversion:

"_rTotal = _rTotal.add(_rAmount);"
(line 762 in REFLECT.sol)
