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
import * as scripts from './battle-funcs.js'

const MON_TABLE = parse.createMonTable();
const MOVE_TABLE = parse.createMoveTable();
const TYPE_TABLE = parse.createCounterTable();

// Note: myParty[0] is always the active Daemon;
let myParty = scripts.loadMyParty();
let currentLock = scripts.loadCurrentLock();

let fightState = {
    TYPE_TABLE: TYPE_TABLE,
    myParty: myParty,
    myActiveMon: myParty[0],
    enemyLock: currentLock,
    theirParty: currentLock.party,
    theirActiveMon: currentLock.party[0]
}
console.log(sessionStorage)
console.log(fightState)

scripts.changeHeader
(
    scripts.generateHeaderFromWarlock( fightState.enemyLock )
);

util.populateSelect( fightState.myActiveMon.moves, 'selectMoves' );
util.populateSelect( fightState.myParty, 'selectMons' );

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
scripts.updateMon( fightState.theirActiveMon, false );