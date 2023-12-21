/*
# TODO List
## Required TODOs
- TODO: Save full list of kept daemons, not just current party
- TODO: Show if your Daemon is dead
- TODO: Add optional healing
- TODO: When selecting Deamons in party, update current party info in interludeState

## Nice to have TODOs
- TODO: Better format for move information
- TODO: Better formatting in general
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

console.log(sessionStorage)

let interludeState = new InterludeState( {
    'currentParty': sessionStorage.currentParty,
    'newReward': sessionStorage.newReward,
    'allHeldMons': sessionStorage.allHeldMons,
    'nextLock': sessionStorage.nextLock,
})

console.log(interludeState);

// intFuncs.setupSessionStorage() can eventually be moved, currently only ensuring no undefined JSON variables
intFuncs.initSessionStorage();

//let interludeState = intFuncs.handleSessionStorage();
let allDaemonsHeld = interludeState['allHeldMons'];

intFuncs.handleReward( JSON.stringify(interludeState.newReward), FULL_DAEMON_TABLE, allDaemonsHeld)

console.log(interludeState)

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
});

intFuncs.populatePartySelects(interludeState['currentParty'], partySelects, interludeState)
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger( 'Mirror-You' );

console.log(interludeState)
console.log(sessionStorage)