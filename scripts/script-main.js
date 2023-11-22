import * as util from '../lib/utility.js'
import * as parse from '../lib/import.js'
import * as scripts from './script-funcs.js'

let myMon = util.createParty([ 'Fuckboy', 'Jingoist' ]);
let theirMon = util.createTheirMon( 'Damned' );

scripts.populateSelect(myMon[0].moves, 'selectMoves');
scripts.populateSelect(myMon, 'selectMons');

scripts.attachButton( scripts.handleAttack , 'attack' )
scripts.attachButton( scripts.handleSwitch , 'switch' )
scripts.attachButton( scripts.handleOk, 'ok' )

scripts.updateMon( myMon[0], true );
scripts.updateMon( theirMon, false );