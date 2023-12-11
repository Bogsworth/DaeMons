import * as scripts from './scripts/script-funcs.js';
import * as parse from './lib/import.js'
import * as intFuncs from './scripts/interlude-funcs.js'
import * as calc from './lib/Calculations.js'

let party = [{name: 'Fuckboy'}, {name: 'Imp'}, {name: 'Jingoist'}]
let allDaemonsHeld = [{name: 'Fuckboy'}, {name: 'Imp'}, {name: 'Jingoist'},
     {name: 'Damned'}, {name: 'Succubus'}];

let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
});
// Next make sure party is selected appropriately

let selects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];
// Need to figure out how to have it start on certain Daemon
const SELECT_ID = 'daemonListSelect';
const SEL_ELEMENT = document.getElementById(SELECT_ID);
SEL_ELEMENT.addEventListener
(
    'change',
    intFuncs.updateDaemonSummary
)

// Attach ready button
const READY_BTN_NAME = 'startFight';
const READY_BTN = document.getElementsByName(READY_BTN_NAME)[0];
READY_BTN.addEventListener('click', intFuncs.loadBattle)

// Add the next challenger
let warlocks = parse.createWarlocks();
let nextLock = warlocks.get( calc.returnIDFromName('Mirror-You', warlocks))

intFuncs.populateNextFight( nextLock )

