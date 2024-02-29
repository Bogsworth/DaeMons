/*
# TODO List
## Required TODOs
- [ ] TODO: ??

## Nice to have TODOs
- [ ] TODO: Better format for move information ( moveToPrintable() )
- [ ] TODO: Better formatting in general
- [ ] TODO: Make healing depend on difficulty

## TODONE!!!
- [x] TODONE: When switching Mons, HP didn't get restored for some reason
    - MON VALUES GET STORED IN THE SELECT OPTIONS, MAKE SURE THEY GET
      HEALED BEFORE THE OPTIONS ARE POPULATED
- [x] TODONE: See why uses isn't restoring when not changing party
    before next fight
- [x] TODONE: Prevent picking the same Daemon twice
- [x] TODONE: Show if your Daemon is dead
- [x] TODONE: Add pop-up asking if you're sure you want to bring a dead Daemon
    ~~- [ ] TODO: Remove dead Daemons~~
*/

import * as intFuncs from './interlude-funcs.js';
import { InterludeState } from '../../../classes/class-interludeState.js';
import { StorageHandler } from '../../../classes/class-storage-handler.js';
import { InterludeUIHandler } from '../../../classes/class-UI-handler-Interlude.js';
import { Daemon } from '../../../classes/class-daemon.js';


let storage = new StorageHandler();
let lockAtlas = storage.restoreAtlas();
let interludeState = new InterludeState( lockAtlas );


let tempDaemon = new Daemon();
tempDaemon.generateDaemonFromID( 'monID005' );
interludeState.allHeldMons.push( tempDaemon );


let UIHandler = new InterludeUIHandler( interludeState );


console.log( storage );
console.log( lockAtlas );
console.log( interludeState );


interludeState.healParty();
interludeState.restorePartyMoves();


// intFuncs.handleReward
// (
//     JSON.stringify(interludeState.newReward),
//     FULL_DAEMON_TABLE,
//     interludeState
// );
storage.battleState = interludeState;
storage.UIHandler = UIHandler;

intFuncs.populateDaemonInspect();

document.getElementsByName('startFight')[0].addEventListener(
    'click',
    () => storage.startFight()
);