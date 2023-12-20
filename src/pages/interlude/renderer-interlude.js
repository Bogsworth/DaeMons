/*
# TODO List
## Required TODOs
- TODO: Save full list of kept daemons, not just current party
- TODO: Show if your Daemon is dead
- TODO: Add optional healing
- TODO: 

## Nice to have TODOs
- TODO: Better format for move information
- TODO: Better formatting in general
*/

import * as scripts from '../battle/script-funcs.js';
import * as parse from '../../../lib/Import.js';
import * as intFuncs from './interlude-funcs.js';
import * as calc from '../../../lib/Calculations.js';

let allDaemonsHeldString = sessionStorage.currentParty;
let allDaemonsHeld = JSON.parse( allDaemonsHeldString );
const FULL_DAEMON_LIST = parse.createMonTable();

let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];


console.log(FULL_DAEMON_LIST)
console.log(allDaemonsHeld)
console.log('reward as seen in renderer')

console.log(sessionStorage.newReward )
console.log(sessionStorage)
intFuncs.handleReward( sessionStorage.newReward, FULL_DAEMON_LIST, allDaemonsHeld)
console.log(allDaemonsHeld)

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
});

intFuncs.populateParty(sessionStorage.currentParty, partySelects, allDaemonsHeld)
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger();