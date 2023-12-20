/*
# TODO List
## Required TODOs
- TODO: Add a way to see type and moves of your Daemon
- TODO: Add a way to see the stats of your moves
- TODO: Add a way to see the type of their Daemon
- TODO: Add a way to see the number of Daemons they have left
- TODO: Add loss handling

## Nice to have TODOs
- TODO: A health bar
- TODO: A health bar with an animation as you lose health
- TODO: A more polished UI
*/

import * as util from '../../../lib/utility.js'
import * as parse from '../../../lib/import.js'
import * as scripts from './script-funcs.js'
import * as calc from '../../../lib/Calculations.js'
import { Daemon } from '../../../Data/ClassDaemon.js'

const MON_TABLE = parse.createMonTable();
const MOVE_TABLE = parse.createMoveTable();
const TYPE_TABLE = parse.createCounterTable();

// Note: myParty[0] is always the active Daemon;
let myParty = [];
if (sessionStorage.currentParty == undefined ) {
    myParty = parse.createParty();
} 
else {
    //console.log('in else statement')
    let partyJSON = JSON.parse(sessionStorage.currentParty)
    //console.log(partyJSON);

    partyJSON.forEach(monData =>{
        // console.log(monData)
        let newMon = new Daemon;
        newMon.copyFromData( monData );
        // console.log('new Mon')
        // console.log(newMon)
        myParty.push(newMon);
    })
    //console.log('heres myParty')
    //console.log(myParty)
}
let warlocks = parse.createWarlocks();

// console.log('heres sessionStorage')
// console.log(sessionStorage)

let currentLock;
if ( sessionStorage.nextLock == undefined ) {
    currentLock = warlocks.get( calc.returnIDFromName('Pushover', warlocks));
}
else {
    let lockJSON = JSON.parse(sessionStorage.nextLock);
    currentLock = warlocks.get( calc.returnIDFromName( lockJSON.name, warlocks))
}

console.log(myParty)
// console.log('heres the current Lock')
// console.log(currentLock.name)
//let currentLock = warlocks.get( calc.returnIDFromName('Pushover', warlocks))
let theirParty = currentLock.party;
let theirCurrentMon = theirParty[0];


console.log(currentLock)
console.log(theirCurrentMon)

scripts.changeHeader( scripts.generateHeaderFromWarlock( currentLock ));
scripts.populateSelect(myParty[0].moves, 'selectMoves');
scripts.populateSelect(myParty, 'selectMons');

let fightState = {
    TYPE_TABLE: TYPE_TABLE,
    myParty: myParty,
    myActiveMon: myParty[0],
    theirParty: theirParty,
    theirActiveMon: theirCurrentMon,
    enemyLock: currentLock 
}

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

scripts.updateMon( myParty[0], true );
scripts.updateMon( theirCurrentMon, false );