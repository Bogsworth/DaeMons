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

import * as parse from '../../../lib/Import.js';
import * as intFuncs from './interlude-funcs.js';
import * as util from '../../../lib/utility.js';
import * as calc from '../../../lib/calculations.js';
import { InterludeState } from '../../../classes/class-interludeState.js';
import { StorageHandler } from '../../../classes/class-storage-handler.js';
import { Atlas } from '../../../classes/class-atlas.js';
import { Party } from '../../../classes/class-party.js';
import { UIHandlerInt } from '../../../classes/class-UI-handler-Interlude.js';

const FULL_DAEMON_TABLE = parse.createMonTable();
const FULL_LOCK_TABLE = parse.createWarlocks();
let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']
let partySelects = [
    document.getElementById( selectArray[0] ),
    document.getElementById( selectArray[1] ),
    document.getElementById( selectArray[2] ),
];

let storage = new StorageHandler();


let lockAtlas = storage.restoreAtlas();
let testNextLockList = calc.returnWithMatchingParamters( FULL_LOCK_TABLE, 'tier', 1 );

console.log(storage);
console.log(lockAtlas);
console.log(testNextLockList);

let interludeState = new InterludeState(
    lockAtlas,
    {
        //currentParty: playerParty,
        'newReward': sessionStorage.newReward,
        'allHeldMons': sessionStorage.allHeldMons,
        'nextLock': sessionStorage.nextLock,
        'nextLockName': sessionStorage.nextLockName
    }
);

let UIHandler = new UIHandlerInt( interludeState );

console.log(interludeState);

interludeState.healParty();
interludeState.restorePartyMoves();

// set random nextLock
// let randNextLock = intFuncs.returnRandomIndexFromArray(testNextLockList);
// interludeState.updateParam(randNextLock.name, 'nextLock');
// interludeState.updateParam(randNextLock.name, 'nextLockName');
console.log(interludeState.nextLock);

intFuncs.handleReward
(
    JSON.stringify(interludeState.newReward),
    FULL_DAEMON_TABLE,
    interludeState
);


// intFuncs.populatePartySelects( interludeState, partySelects );
// intFuncs.keepSelectsUnique( interludeState, partySelects );
intFuncs.populateDaemonInspect();
intFuncs.setupReadyButton();
intFuncs.populateChallenger( interludeState.nextLockName );

// console.log(sessionStorage)