import monsJSON from '../data/mons.json' assert { type: "json" };
import movesJSON from '../data/moves.json' assert { type: "json" };
import counterJSON from '../data/type-counters.json' assert { type: "json" };
import partyJSON from '../data/starting-team.json' assert { type: "json" }
import warlockJSON from '../data/enemy-warlocks.json' assert { type: "json" }
import * as calc from './calculations.js'
import { Daemon } from '../data/class-daemon.js'
import { Move } from '../data/class-move.js'

function createWarlocks() {
    let warlockConfig = JSON.parse( JSON.stringify( warlockJSON ));
    let warlocks = new Map();
    const ID_START = 'lockID';

    warlockConfig.forEach( warlockData => {
        let warlockID = generateNextID(ID_START, warlocks.size);

        warlockData[ 'id' ] = warlockID;
        warlockData[ 'party' ] = createParty( warlockData[ 'Daemons' ]);
        warlocks.set(warlockID, warlockData);
    })

    return warlocks;
}

function createMonTable() {
    let monsArray = JSON.parse( JSON.stringify( monsJSON ));
    let monMap = new Map();
    const ID_START = 'monID';

    monsArray.forEach( monData => {
        let mon = new Daemon( monData );
        let monID = generateNextID(ID_START, monMap.size);

        mon['id'] = monID;
        monMap.set(monID, mon);
    })

    return monMap;
}

function createMoveTable() {
    let moveArray = JSON.parse( JSON.stringify( movesJSON ));
    let moveMap = new Map();
    const ID_START = 'moveID';

    moveArray.forEach( moveData => {
        let move = new Move( moveData );
        let moveID = generateNextID(ID_START, moveMap.size);

        move['id'] = moveID;
        moveMap.set(moveID, move);
    })

    return moveMap;
}

function createCounterTable() {
    let counter_obj = JSON.parse( JSON.stringify( counterJSON ));

    return counter_obj;
}

function createParty( partyConfig = JSON.parse( JSON.stringify( partyJSON ))) {
    let monMap = createMonTable();
    let moveMap = createMoveTable();
    let party = [];
    let i = 0;

    partyConfig.forEach( monData => {     
        const MON_ID = calc.returnIDFromName( monData.name, monMap );

        party[ i ] = new Daemon();
        party[ i ].copyMon(monMap.get( MON_ID ));
        monData.moves.forEach( moveName => {
            if ( moveName == null ) {
                return;
            }

            addMove( moveName, party[i], monData, moveMap );
        })
        i++;
    });

    return party;
}

function addMove( moveName, daemonPointer, monData, moveMap) {
    let currentIndex = monData.moves.indexOf( moveName );
    if ( moveName == null ) {
        return;
    }
    const MOVE_ID = calc.returnIDFromName( moveName, moveMap )
    const MOVE_TO_ADD = new Move(( moveMap.get( MOVE_ID )));

    daemonPointer.moves[ currentIndex ] = MOVE_TO_ADD;
}

function generateNextID(idName, mapSize, idLength = 3) {
    const ROOM_COUNT = mapSize

    let roomStr = idName
    let longIDNo = '00000000' + ROOM_COUNT;
    let roomIDStr = roomStr + longIDNo.slice( 0 - idLength );

    return roomIDStr;
}


export {
    createWarlocks,
    createMonTable,
    createMoveTable,
    createCounterTable,
    createParty,
    addMove
}
