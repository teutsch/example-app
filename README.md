# TrueBit Example Application

This repository serves as an example project that uses truebit-os as a dependency.

# Installation

Make sure you already have `solc` installed and an Ethereum node on port 8545. You will also need browserify.

```
npm i

chmod 755 install_truebit_os.sh
./install_truebit_os.sh

browserify public/js/app.js -o public/js/bundle.js
```

# Usage

Start truebit-os in the background. You will also need to be running an ipfs daemon on port 5001

```
cd truebit-os
npm run truebit wasm-client/config.json
```

This will start up the shell. We can start a solver on account 1 like so:
```
start solve -a 1
```

We need to deploy the Scrypt contract that the webapp will be interfacing with. We can do this by running:

```
node deploy.js
```

Now that we have all the dependencies setup,  we will be able to send tasks to the solver via our simple webapp.

Start up the webapp:
```
node index.js
```

And navigate to `localhost:3000` in a MetaMask compatible browser.

Make sure to connect MetaMask to localhost:8545, and send the initial account some Ether so it can send transactions.

Once you send the transaction it will wait for the task to complete. The TrueBit task requires to periods of timeouts so you will need to use the skip command in the truebit-os shell.

For best results (skip can be a bit finnicky):
```
skip 300
skip 300
```

Ends challenge period

```
skip 300
skip 300
```

Task is finalized, and result should show up on the web page.


# Running in Docker

Use tmux to have several windows.

In first windows, run `ipfs daemon`

In second window, run `ganache-cli -h 0.0.0.0`

Find out what is your address in metamask (`address`), in hex format without 0x prefix.

In the next window
```
cd truebit-os
npm run deploy
node send.js --to=address
npm run truebit
```

In the Truebit console, type
```
start solve
```

Then make a new tmux window
```
cd example-app
node deploy.js
node index.js
```

With web browser, go to localhost:3000

After you have submitted the task, go to the tmux window with Truebit console, and type
 `skip` a few times until the task is finalized.


