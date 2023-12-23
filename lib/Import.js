import monsJSON from '../data/mons.json' assert { type: "json" };
import movesJSON from '../data/moves.json' assert { type: "json" };
import counterJSON from '../data/type-counters.json' assert { type: "json" };
import partyJSON from '../data/starting-team.json' assert { type: "json" }
import warlockJSON from '../data/enemy-warlocks.json' assert { type: "json" }
import * as calc from './calculations.js'
import { Daemon } from '../data/class-daemon.js'

class Move {
    constructor( builder = {
        "id": "",
        "name": "",
        "type": "",
        "power": 1,
        "accuracy": 1,
        "uses": 1,
        "statsAffected": {
            "self": {
                "attack": 0,
                "defense": 0,
                "speed": 0
            },
            "enemy": {
                "attack": 0,
                "defense": 0,
                "speed": 0
            }
        }
    }) {
        this.id = builder[ 'id' ];
        this.name = builder[ 'name' ];
        this.type = builder[ 'type' ];
        this.power = builder[ 'power' ];
        this.accuracy = builder[ 'accuracy' ];
        this.uses = builder[ 'uses' ];
        this.statsAffected = builder[ 'statsAffected' ];
    }

    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
    returnPower() { return this.power; } 
    returnAccuracy() { return this.accuracy; }
    returnUses() { return this.uses; }
    returnStatsAffectedObject() { return this.statsAffected; }
    returnStatsAffectedArray() {
        let effectArray = [];

        for (let [target, stats] of Object.entries( this.statsAffected )) {
            for (let [stat, effect] of Object.entries(stats)){
                if ( effect ) {
                    effectArray.push([target, stat, effect]);
                }
            }
        }

        return effectArray;
    }
}

function createWarlocks() {
    let i = 0;
    let monMap = createMonTable();
    let moveMap = createMoveTable();
    let warlockConfig = JSON.parse( JSON.stringify( warlockJSON ));

    let warlocks = new Map();

    warlockConfig.forEach( warlock => {
        let counter = '';

        if ( i < 10 ) {
            counter = '00' + i++;
        }
        else if ( i < 100) {
            counter = '0' + i++;
        }
        else {
            counter = i++;
        }
        warlock[ 'id' ] = `lockID${counter}`;
        warlock[ 'party' ] = createParty( warlock[ 'Daemons' ]);

        warlocks.set( `lockID${counter}`, warlock)
    })
    return warlocks;
}

function createParty( partyConfig = JSON.parse( JSON.stringify( partyJSON ))) {
    let monMap = createMonTable();
    let moveMap = createMoveTable();
    let party = [];
    let i = 0;

    partyConfig.forEach( monData => {     
        party[ i ] = new Daemon();
        party[ i ].copyMon(monMap.get( calc.returnIDFromName( monData.name, monMap )));
        monData.moves.forEach( moveName => {
            let currentIndex = monData.moves.indexOf( moveName );
            if ( moveName == null ) {
                return;
            }
            const MOVE_ID = calc.returnIDFromName( moveName, moveMap )
            const MOVE_TO_ADD = structuredClone( moveMap.get( MOVE_ID ));

            party[ i ].moves[ currentIndex ] = MOVE_TO_ADD;
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
    const MOVE_TO_ADD = structuredClone( moveMap.get( MOVE_ID ));

    daemonPointer.moves[ currentIndex ] = MOVE_TO_ADD;
}

function createMonTable() {
    let monsArray = JSON.parse( JSON.stringify( monsJSON ));
    let i = 0;
    let monMap = new Map();

    monsArray.forEach( monData => {
        let counter = '';
        let mon = new Daemon( monData );

        if ( i < 10 ) {
            counter = '00' + i++;
        }
        else if ( i < 100) {
            counter = '0' + i++;
        }
        else {
            counter = i++;
        }
        mon['id'] = 'mon' + counter;
        monMap.set(`mon${counter}`, mon);
    })

    return monMap;
}

function createMoveTable() {
    let moveArray = JSON.parse( JSON.stringify( movesJSON ));
    let i = 0;
    let moveMap = new Map

    moveArray.forEach( moveData => {
        let counter = '';
        let move = new Move( moveData );

        if ( i < 10 ) {
            counter = '00' + i++;
        }
        else if ( i < 100) {
            counter = '0' + i++;
        }
        else {
            counter = i++;
        }
        move['id'] = 'move' + counter;
        moveMap.set(`move${counter}`, move);
    })
    return moveMap;
}

function createCounterTable() {
    let counter_obj = JSON.parse( JSON.stringify( counterJSON ));

    return counter_obj;
}


export {
    Move,
    createWarlocks,
    createMonTable,
    createMoveTable,
    createCounterTable,
    createParty,
    addMove
}
