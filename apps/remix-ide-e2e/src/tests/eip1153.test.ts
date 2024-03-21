'use strict'

import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
  '@disabled': true,
  before: function (browser: NightwatchBrowser, done: VoidFunction) {
    init(browser, done)
  },
  'Should execute a contract that uses transient storage #group1': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('udapp')
      .switchEnvironment('vm-cancun') // switch to a vm that know this eip.
      .addFile('transient_storage.sol', { content: contractTransientStorage })
      .clickLaunchIcon('solidity')
      .setSolidityCompilerVersion('soljson-v0.8.24+commit.e11b9ed9.js')
      .click('*[data-id="scConfigExpander"]')
      .setValue('#evmVersionSelector', 'cancun') // set target compilation to cancun
      .clickLaunchIcon('solidity')
      .verifyContracts(['TestTransientStorage'])
      .clickLaunchIcon('udapp')
      .createContract('')
      .clickInstance(0)
      .clickFunction('useTransientStorage - transact (not payable)')
      .testFunction('last',
        {
          status: '0x1 Transaction mined and execution succeed',
          'decoded output': {
            0: 'uint256: out1 14',
            1: 'uint256: out2 15'
          }
        })
     .end()
  }
}

const contractTransientStorage = `// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract TestTransientStorage {
    function useTransientStorage() public returns (uint out1, uint out2) {
        assembly {
           tstore(0, 14)
           tstore(1, 15)
           out1 := tload(0)
           out2 := tload(1)
        }
    }    
}`
