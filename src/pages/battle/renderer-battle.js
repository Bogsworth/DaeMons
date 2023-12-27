/*
# TODO List
## Required TODOs
- TODO: Add a way to see type and moves of your Daemon
- TODO: Add a way to see the stats of your moves
- TODO: Add a way to see the type of their Daemon
- TODO: Add a way to see the number of Daemons they have left
- TODO: Clean up messages around status effects
- TODO: Add power points equivalent
- TODO: Test that status modifiers are removed after Daemon switch

## Nice to have TODOs
- TODO: A health bar
- TODO: A health bar with an animation as you lose health
- TODO: A more polished UI

## TODONE!!!
- TODONE: On Daemon switch, remove status modifiers
- TODONE: Add loss handling
- TODONE: Make moves that affect status
- TODONE: Fix bug where 'hp' dissapears (but numbers stay) underneath Daemon's name
- TODONE: Prevent 'stacking' attacks/disable every button except OK when player should not be able to do anything else
*/

import * as util from '../../../lib/utility.js'
import * as parse from '../../../lib/import.js'
import * as scripts from './battle-funcs.js'

const TYPE_TABLE = parse.createCounterTable();

// Note: myParty[0] always starts as the active Daemon;
let myParty = scripts.loadMyParty();
console.log(myParty)
let currentLock = scripts.loadCurrentLock();
let fightState = {
    TYPE_TABLE: TYPE_TABLE,
    myParty: myParty,
    myActiveMon: myParty[0],
    enemyLock: currentLock,
    theirParty: currentLock.party,
    theirActiveMon: currentLock.party[0]
}
const HEADER = scripts.generateHeaderFromWarlock( fightState.enemyLock );

console.log(sessionStorage)
console.log(fightState)

scripts.changeHeader( HEADER );
util.populateSelect( fightState.myActiveMon.moves, 'selectMoves' );
util.populateSelect( fightState.myParty, 'selectMons' );

util.attachButton(
    function() {
        scripts.handleAttack( fightState );
    },
    'attack' );
util.attachButton(
    function () {
        scripts.handleSwitch( fightState )
    },
    'switch' );
util.attachButton( scripts.handleOk, 'ok' );

scripts.updateMon( fightState.myActiveMon, true );
scripts.updateMon( fightState.theirActiveMon, false );