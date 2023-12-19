/*
# TODO List
## Required TODOs
- TODO: Add a way to see type and moves of your Daemon
- TODO: Add a way to see the stats of your moves
- TODO: Add a way to see the type of their Daemon
- TODO: Add a way to see the number of Daemons they have left

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

// Note: myParty[0] is always the active Daemon;
let myParty = parse.createParty();
let warlocks = parse.createWarlocks();

let warlock1 = warlocks.get( calc.returnIDFromName('Pushover', warlocks))
let theirParty = warlock1.party;
let theirCurrentMon = theirParty[0];


console.log(warlock1)
console.log(theirCurrentMon)

scripts.changeHeader( scripts.generateHeaderFromWarlock( warlock1 ));
scripts.populateSelect(myParty[0].moves, 'selectMoves');
scripts.populateSelect(myParty, 'selectMons');

let fightState = {
    TYPE_TABLE: TYPE_TABLE,
    myParty: myParty,
    myActiveMon: myParty[0],
    theirParty: theirParty,
    theirActiveMon: theirCurrentMon
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