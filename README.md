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

All of this was done with the assumption that the tax rate is 5%(as shown in the SafeMoon contract), and that distribution to other wallets is half of that(2.5%)

run test(after ganache is running) with:

$ truffle test ./test/mint_test.js

What's happening here:

Run this test as a baseline to see the mint function run twice.  Tests 2 and 3 mint 1,000,000,000,000 and 1,000,000 coins, respectively, to 2 different addresses.  Then those balances are checked to ensure accuracy.  Finally, in test 6, the transfer is sent from walletB to walletD.  It only transfers 1,000,000 coins, but it produced some interesting results.

Looking at test 7(checking distribution to walletC, which holds 1,000,000 coins), the balance of walletC is so small relative to the total balance that the reward is actually round down by solidity(mimiced in the test result with Math.floor()).  This probably isn't news, but the actual decimal number is logged in the test(1000000.000024975)

$ truffle test ./test/mint_test2.js

What's happening here:

I decided to retry the same scenario as mint_test.js, but testing the distribution from a larger transaction.  In this test file, tests 1-5 should be identical to mint_test.js.  Test 6 transfers 1,000,000 coins from walletB to walletD, and in test 7, distribution of this transaction is tested in walletC(which holds 1,000,000)

The strange behaviour comes in the transfer itself.  In test 6, 1,000,000,000,000(stored as variable "oneT" in test) coins are transferred to wallet, and so 950,000,000,000 are expected to be recieved.  The actual amount recieved is 950047455820.

This would make sense if there were a transfer completed earlier in the test sequence, but there isn't.  I even logged the value of walletD BEFORE the transfer to ensure that it was 0.  Somehow the transfer isn't taking a whole 5% tax on the transaction.

I suspect this behaviour is also causing the issue with test 7 receiving twice the expected distribution(again, going on the assumption that the amount distributed is 2.5% of the transaction).

