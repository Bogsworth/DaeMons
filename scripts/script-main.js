import * as util from '../lib/utility.js'
import * as parse from '../lib/import.js'
import * as scripts from './script-funcs.js'

const MON_TABLE = parse.createMonTable();
const MOVE_TABLE = parse.createMoveTable();
const TYPE_TABLE = parse.createCounterTable();

let myMon = parse.createParty();
let theirMon = util.createTheirMon( 'Damned' );
let myCurrentMon = myMon[0];
let theirCurrentMon = theirMon;

scripts.populateSelect(myMon[0].moves, 'selectMoves');
scripts.populateSelect(myMon, 'selectMons');

scripts.attachButton(
    function() {
        scripts.handleAttack( TYPE_TABLE, myCurrentMon, theirCurrentMon )
    },
    'attack' );
scripts.attachButton( scripts.handleSwitch , 'switch' )
scripts.attachButton( scripts.handleOk, 'ok' )

scripts.updateMon( myMon[0], true );
scripts.updateMon( theirMon, false );