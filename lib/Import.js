import monsJSON from '../data/mons.json' assert { type: "json" };
import movesJSON from '../data/moves.json' assert { type: "json" };
import counterJSON from '../data/type-counters.json' assert { type: "json" };
import partyJSON from '../data/starting-team.json' assert { type: "json" }
import warlockJSON from '../data/enemy-warlocks.json' assert { type: "json" }
import daemonsJSON from '../data/daemons.json' assert { type: "json"}
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
        //warlockData[ 'party' ] = createParty( warlockData[ 'Daemons' ]);
        warlocks.set(warlockID, warlockData);
    })

    return warlocks;
}

function createMonTable() {
    //let monsArray = JSON.parse( JSON.stringify( monsJSON ));
    let monsArray = JSON.parse( JSON.stringify( daemonsJSON ));
    let monMap = new Map();
    const ID_START = 'monID';

    monsArray.forEach( monData => {
        //let mon = new Daemon( monData );
        let mon = monData;
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
        //let move = new Move( moveData );
        let move = moveData;
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

// TO REMOVE, added to daemon class
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
    const INDEX = mapSize

    let roomStr = idName
    let longIDNo = '00000000' + INDEX;
    let roomIDStr = roomStr + longIDNo.slice( 0 - idLength );

    return roomIDStr;
}

function daemonFilter(
    paramsRequired = [
        {
            param: 'type',
            value: 'pride'
        },
        {
            param: 'type',
            value: 'greed'
        }
    ],
    tier = 1,
    bossFlag = false,
    JSONString = JSON.stringify(daemonsJSON)
) {
    const TIER = 'tier ' + tier;
    const LOCK_TYPE = bossFlagBoolToStr(bossFlag);

    return createParty(
        JSON.parse( JSONString )
            .filter( daemon => paramFilter( daemon, paramsRequired )) 
            .filter( daemon => tierFilter( daemon, TIER, LOCK_TYPE ))
            .map( daemon => mapper( daemon, TIER, LOCK_TYPE ))
    );

    function paramFilter (daemon, paramsRequired) {
        let flag = true;

        paramsRequired.forEach(paramSet => {
            if ( flag == false ) {
                return;
            }

            flag = daemon[ paramSet.param ].includes( paramSet.value );
        })

        return flag;
    }

    function tierFilter (daemon, tier, lockType) {
        return daemon.movesKnown[tier][lockType] != null;
    }

    function mapper (daemon, tier, lockType) {
        return {
            name: daemon.name,
            moves: daemon.movesKnown[tier][lockType]
        };
    }

    function bossFlagBoolToStr(bossFlag) {
        if ( bossFlag ) {
            return 'boss';
        }
        return 'normalLock';
    }
}

// console.log(createMonTable())

export {
    createWarlocks,
    createMonTable,
    createMoveTable,
    createCounterTable,
    createParty,
    addMove,
    daemonFilter
}
