/*
# TODO List
## Required TODOs
- [ ] TODO: Figure out why the next roomID doesn't change

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

import { InterludeState } from '../../../classes/class-interludeState.js';
import { StorageHandler } from '../../../classes/class-storage-handler.js';
import { InterludeUIHandler } from '../../../classes/class-UI-handler-interlude.js';
import { Atlas } from '../../../classes/class-atlas.js';

const STORAGE = new StorageHandler();
const LEVELS = new Atlas( STORAGE.getAtlasBuilder() );
const INT_STATE = new InterludeState( LEVELS ); // Interlude State

STORAGE.initStorageForInterlude( INT_STATE );

// #region
// ------
// Testing giving monID005 aka 'Angy Boy' after each fight
// let tempDaemon = new Daemon();
// tempDaemon.generateDaemonFromID( 'monID005' );
// INT_STATE.allHeldMons.push( tempDaemon );
// ------
// #endregion

const HANDLER = new InterludeUIHandler( INT_STATE );

STORAGE.UIHandler = HANDLER;

INT_STATE.healParty();
INT_STATE.restorePartyMoves();

console.log( STORAGE );
console.log( LEVELS );
console.log( INT_STATE );

document.getElementsByName('startFight')[0].addEventListener(
    'click',
    () => STORAGE.endInterlude()
);