import * as scripts from '../battle/script-funcs.js';
import * as parse from '../../../lib/Import.js';
import * as intFuncs from './interlude-funcs.js';
import * as calc from '../../../lib/Calculations.js';

let allDaemonsHeldString = sessionStorage.currentParty;
let allDaemonsHeld = JSON.parse( allDaemonsHeldString );

let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
});

intFuncs.populateParty(sessionStorage.currentParty, partySelects, allDaemonsHeld)
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger();