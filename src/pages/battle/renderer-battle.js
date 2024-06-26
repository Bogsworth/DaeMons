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

import { BattleState } from '../../../classes/class-battle-state.js';
import { Atlas } from '../../../classes/class-atlas.js'
import { BattleUIHandler } from '../../../classes/class-UI-handler-battle.js';
import { StorageHandler } from '../../../classes/class-storage-handler.js';

const STORAGE = new StorageHandler();
const LEVELS = new Atlas( STORAGE.getAtlasBuilder() );
const FIGHT_STATE = new BattleState( STORAGE.getRoomWarlock() );

// #region
// ------
// Testing with multiple mons

// console.log(FIGHT_STATE.playerParty.members)
// let tempDaemon = new Daemon()
// tempDaemon.generateDaemonFromID('monID002')
// FIGHT_STATE.playerParty.addMonToParty(tempDaemon)
// console.log(FIGHT_STATE.playerParty.members)

// ------
// #endregion

const HANDLER = new BattleUIHandler( FIGHT_STATE );

STORAGE.state = FIGHT_STATE;
STORAGE.UIHandler = HANDLER;

FIGHT_STATE.handler = HANDLER;

console.log( STORAGE );
console.log( LEVELS );
console.log( FIGHT_STATE );