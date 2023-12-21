/*
# TODO List
## Required TODOs
- TODO: Add a way to see type and moves of your Daemon
- TODO: Add a way to see the stats of your moves
- TODO: Add a way to see the type of their Daemon
- TODO: Add a way to see the number of Daemons they have left
- TODO: Add loss handling
- TODO: Fix the fact that I stringified an array of already stringified elements

## Nice to have TODOs
- TODO: A health bar
- TODO: A health bar with an animation as you lose health
- TODO: A more polished UI
*/

import * as util from '../../../lib/utility.js'
import * as parse from '../../../lib/import.js'
import * as scripts from './script-funcs.js'
import * as calc from '../../../lib/Calculations.js'

const MON_TABLE = parse.createMonTable();
const MOVE_TABLE = parse.createMoveTable();
const TYPE_TABLE = parse.createCounterTable();
let warlocks = parse.createWarlocks();
let currentLock;
// Note: myParty[0] is always the active Daemon;
let myParty = [];

if (sessionStorage.currentParty == undefined ) {
    myParty = parse.createParty();
} 
else {
    let JSONofStrings = JSON.parse(sessionStorage.currentParty)
    let partyJSON = []
    // Somewhere I managed to make an array of stringified JSONs, then stringify the whole array....
    // TODO: fix this at some point
    JSONofStrings.forEach( str =>{
        partyJSON.push(JSON.parse(str))
    })
    myParty = util.parseDaemonJSON(partyJSON)
}


if ( sessionStorage.nextLock == undefined ) {
    currentLock = warlocks.get( calc.returnIDFromName('Pushover', warlocks));
}
else {
    let lockJSON = JSON.parse(sessionStorage.nextLock);
    currentLock = warlocks.get( calc.returnIDFromName( lockJSON.name, warlocks))
}

let theirParty = currentLock.party;
let theirCurrentMon = theirParty[0];

let fightState = {
    TYPE_TABLE: TYPE_TABLE,
    myParty: myParty,
    myActiveMon: myParty[0],
    theirParty: theirParty,
    theirActiveMon: theirCurrentMon,
    enemyLock: currentLock 
}
console.log(sessionStorage)
console.log(fightState)

scripts.changeHeader( scripts.generateHeaderFromWarlock( currentLock ));
scripts.populateSelect(myParty[0].moves, 'selectMoves');
scripts.populateSelect(myParty, 'selectMons');

scripts.attachButton(
    function() {
        scripts.handleAttack( fightState );
    },
    'attack' );
scripts.attachButton(
    function () {
        scripts.handleSwitch( fightState )
    },
    'switch' );
scripts.attachButton( scripts.handleOk, 'ok' );

scripts.updateMon( fightState.myActiveMon, true );
scripts.updateMon( theirCurrentMon, false );