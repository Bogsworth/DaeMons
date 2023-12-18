import * as scripts from './scripts/script-funcs.js';
import * as parse from './lib/import.js'
import * as intFuncs from './scripts/interlude-funcs.js'
import * as calc from './lib/Calculations.js'

let party = [{name: 'Fuckboy'}, {name: 'Imp'}, {name: 'Jingoist'}]
// let allDaemonsHeld = [{name: 'Fuckboy'}, {name: 'Imp'}, {name: 'Jingoist'},
//      {name: 'Damned'}, {name: 'Succubus'}];
let allDaemonsHeld = parse.createParty();

let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
});

// partySelects[0].value = allDaemonsHeld[2]
// partySelects[1].value = allDaemonsHeld[2]
// partySelects[2].value = allDaemonsHeld[2]
// Next make sure party is selected appropriately
// Need to figure out how to have it start on certain Daemon
intFuncs.populateParty(sessionStorage.currentParty, partySelects, allDaemonsHeld)


intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger();