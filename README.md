# LedgerCp

A simple angular2 web ui wrapped around ledger's node api, allows transacting of counterparty tokens with ledger nano s
https://github.com/LedgerHQ/ledger-node-js-api


## Features
View balance of ledger address found at index "44'/0'/0'/0", via indiesquare api
Create send transactions via indiesquare api, sign via ledger and broadcast
Sign and broadcast a raw transaction created by your trusted node.

##Caveats
As a native counterparty app has not yet been developed so the ledger uses the bitcoin app. 
This will validate the bitcoin components of the transaction but not the counterparty.
Blindly signing a coutnerparty transaction you did not create is not considered safe. (note you can sign your own unsigned hex)

##To be done
A native counterparty app for the ledger needs to be created that will verify and show to the user on the device what tokens are been sent.
If somebody is willing to develop this for the community it would be much appreciated.

It seems this can be done by forking the btc blue app and adding a function that will parse the output script of the transaction to be signed.
The parsed data can then be displayed on the ledger screen.

Native bitcoin app
https://github.com/LedgerHQ/blue-app-btc
https://github.com/ledgerhq/blue-devenv

Counterparty transaction parsing script
https://github.com/tokenly/counterparty-transaction-parser

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.28.3.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to GitHub Pages

Run `ng github-pages:deploy` to deploy to GitHub Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
