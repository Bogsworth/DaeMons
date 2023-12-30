/*
# TODO List
## Required TODOs
- [ ] TODO: See why uses isn't restoring when not changing party
    before next fight

## Nice to have TODOs
- [ ] TODO: Better format for move information ( moveToPrintable() )
- [ ] TODO: Better formatting in general
- [ ] TODO: Make healing depend on difficulty

## TODONE!!!
- [x] TODONE: Prevent picking the same Daemon twice
- [x] TODONE: Show if your Daemon is dead
- [x] TODONE: Add pop-up asking if you're sure you want to bring a dead Daemon
    ~~- [ ] TODO: Remove dead Daemons~~
*/

import * as parse from '../../../lib/import.js';
import * as intFuncs from './interlude-funcs.js';
import * as util from '../../../lib/utility.js';
import { InterludeState } from '../../../data/class-interludeState.js';

const FULL_DAEMON_TABLE = parse.createMonTable();
let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];

console.log('storage');
console.log(sessionStorage);

let interludeState = new InterludeState( {
    'currentParty': sessionStorage.currentParty,
    'newReward': sessionStorage.newReward,
    'allHeldMons': sessionStorage.allHeldMons,
    'nextLock': sessionStorage.nextLock,
    'nextLockName': sessionStorage.nextLockName
});

console.log('state')
console.log(interludeState);

intFuncs.handleReward( JSON.stringify(interludeState.newReward), FULL_DAEMON_TABLE, interludeState['allHeldMons']);
console.log('interludeState post reward handling and healing')
console.log(interludeState)

selectArray.forEach( select => {
    if (select == 'daemonListSelect') {
        util.populateSelect( interludeState['allHeldMons'], select);
    }
    else {
        util.populateSelect( interludeState['allHeldMons'], select, true);
    }
});



intFuncs.populatePartySelects( interludeState, partySelects );
intFuncs.keepSelectsUnique( interludeState, partySelects );
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger( interludeState.nextLockName );

intFuncs.healSuperset( interludeState, ['currentParty', 'allHeldMons']);
intFuncs.restoreMoveUsesSuperSet( interludeState, ['currentParty', 'allHeldMons']);

console.log(sessionStorage)