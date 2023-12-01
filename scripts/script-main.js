import * as util from '../lib/utility.js'
import * as parse from '../lib/import.js'
import * as scripts from './script-funcs.js'
import * as calc from '../lib/Calculations.js'

const MON_TABLE = parse.createMonTable();
const MOVE_TABLE = parse.createMoveTable();
const TYPE_TABLE = parse.createCounterTable();

// Note: myParty[0] is always the active Daemon;
let myParty = parse.createParty();
let warlocks = parse.createWarlocks();

//let theirMon = util.createTheirMon( 'Damned' );
let warlock1 = warlocks.get( calc.returnIDFromName('Shorts-Wearer', warlocks))
let theirMon = warlock1.party;
console.log(warlock1)

let theirCurrentMon = theirMon[0];

scripts.populateSelect(myParty[0].moves, 'selectMoves');
scripts.populateSelect(myParty, 'selectMons');

scripts.attachButton(
    function() {
        scripts.handleAttack( TYPE_TABLE, myParty[0], theirCurrentMon )
    },
    'attack' );
scripts.attachButton(
    function () {
        scripts.handleSwitch( TYPE_TABLE, myParty, theirCurrentMon )
    },
    'switch' );
scripts.attachButton( scripts.handleOk, 'ok' );

scripts.updateMon( myParty[0], true );
scripts.updateMon( theirCurrentMon, false );