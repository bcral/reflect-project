Notes for running dev environment:

From reflect-project file:

$ npm install 
(maybe required) $ truffle install
(Now launche local ganache blockchain.  Should be installed with truffle)
$ ganache-cli -m "three elevator bus mutual celery belt priority mistake lemon supply dog time"

(open new terminal window and enter)
truffle test

(If all is well, truffle should run one test, and it should fail.  I haven't set it up to communicate with the contract just yet.)

NOTICE - The "reflect-contracts" folder is the same as the repo I pulled it from, but I had to move REFLECT.sol to the "contracts" folder for truffle to recognize it.