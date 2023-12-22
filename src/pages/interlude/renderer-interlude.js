/*
# TODO List
## Required TODOs
- TODO: Show if your Daemon is dead
- TODO: Remove dead Daemons

## Nice to have TODOs
- TODO: Better format for move information
- TODO: Better formatting in general
- TODO: Make healing depend on difficulty
*/

import * as scripts from '../battle/script-funcs.js';
import * as parse from '../../../lib/Import.js';
import * as intFuncs from './interlude-funcs.js';
import * as calc from '../../../lib/Calculations.js';
import { InterludeState } from '../../../Data/ClassInterludeState.js';

const FULL_DAEMON_TABLE = parse.createMonTable();
let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];

console.log('storage')
console.log(sessionStorage)

let interludeState = new InterludeState( {
    'currentParty': sessionStorage.currentParty,
    'newReward': sessionStorage.newReward,
    'allHeldMons': sessionStorage.allHeldMons,
    'nextLock': sessionStorage.nextLock,
    'nextLockName': sessionStorage.nextLockName
})

console.log('state')
console.log(interludeState);

// intFuncs.setupSessionStorage() can eventually be moved, currently only ensuring no undefined JSON variables
//intFuncs.initSessionStorage();

intFuncs.handleReward( JSON.stringify(interludeState.newReward), FULL_DAEMON_TABLE, interludeState['allHeldMons'])
intFuncs.healMons( interludeState, ['currentParty', 'allHeldMons']);

console.log('interludeState post reward handling and healing')
console.log(interludeState)

selectArray.forEach( select => {
    //scripts.populateSelect( allDaemonsHeld, select)
    scripts.populateSelect( interludeState['allHeldMons'], select)
});

intFuncs.populatePartySelects( interludeState, partySelects )
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger( interludeState.nextLockName )

console.log(interludeState)
console.log(sessionStorage)