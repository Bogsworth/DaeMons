/*
# TODO List
## Required TODOs
- [ ] TODO: Add a way to see the type of their Daemon (maybe)
- [ ] TODO: Add a way to see the number of Daemons they have left
- [ ] TODO: Clean up messages around status effects
    - [ ] TODO: Make sure messages are clear if stats can no longer
        be increased or decreased
- [ ] TODO: Test that status modifiers are removed after Daemon switch
- [ ] TODO: When changing mon info, if there are 3 moves for the old mon
    and 2 for the new one, the 3rd move stays even though there should only be 2

## Nice to have TODOs
- [ ] TODO: A health bar
- [ ] TODO: A health bar with an animation as you lose health
- [ ] TODO: A more polished UI
    - [ ] TODO: Better formatting for expandingBottomBar
        - [ ] TODO: Boxes around sections
        - [ ] TODO: Consistent sizing so flipping between mons
                keeps everything in the same place as each other

## TODONE!!!
- [x] TODONE: Add a way to see type and moves of your Daemon
- [x] TODONE: Add a way to see the stats of your moves
- [x] TODONE: On Daemon switch, remove status modifiers
- [x] TODONE: Add loss handling
- [x] TODONE: Make moves that affect status
- [x] TODONE: Fix bug where 'hp' dissapears (but numbers stay)
        underneath Daemon's name
- [x] TODONE: Prevent 'stacking' attacks/disable every button except
        OK when player should not be able to do anything else
- [x] TODONE: Add power points equivalent
*/

import * as util from '../../../lib/utility.js'
import * as parse from '../../../lib/import.js'
import * as scripts from './battle-funcs.js'
import { BattleState } from '../../../classes/class-battle-state.js';
import { Atlas } from '../../../classes/class-atlas.js'
import { UIHandler } from '../../../classes/class-UI-handler.js';

const TYPE_TABLE = parse.createCounterTable();

// Note: myParty[0] always starts as the active Daemon;
let myParty = scripts.loadMyParty();
let currentLock = scripts.loadCurrentLock();


let levels = new Atlas([1,2]);
console.log(levels)
let fightState;

if ( sessionStorage.currentRoomID == undefined) {
    fightState = new BattleState( levels.battleOrder.get('roomID000').lock)
}
else {
    fightState = new BattleState( sessionStorage.currentRoomID )
}

// let fightState = {
//     TYPE_TABLE: TYPE_TABLE,
//     myParty: myParty,
//     myActiveMon: myParty[0],
//     enemyLock: currentLock,
//     theirParty: currentLock.party,
//     theirActiveMon: currentLock.party[0]
// }
const HEADER = scripts.generateHeaderFromWarlock( fightState.enemyLock );

console.log(sessionStorage)
console.log(fightState)

scripts.changeHeader( HEADER );

console.log(fightState.playerParty.activeMon)
util.populateSelect( fightState.playerParty.activeMon.returnMoves(), 'selectMoves' );
util.populateSelect( fightState.playerParty.fullParty, 'selectMons' );

let monButtons = scripts.generateMonButtons(fightState.playerParty.fullParty);

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

monButtons.forEach( buttId => {
    util.attachButton(
        function() {
            scripts.expandInfoBox( buttId, fightState );
        },
        buttId
    );
})

scripts.updateMon( fightState.playerParty.activeMon, true );
scripts.updateMon( fightState.enemyLock.activeMon, false );