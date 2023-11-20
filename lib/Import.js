// let monsJSON = require( '../Data/Mons.json' );
// let movesJSON = require( '../Data/Moves.json' );
// let counterTable = require( '../Data/TypeCounters.json' );
// const util =  require( './Calculations.js' );

import monsJSON from '../Data/Mons.json' assert { type: "json" };
import movesJSON from '../Data/Moves.json' assert { type: "json" };
import counterJSON from '../Data/TypeCounters.json' assert { type: "json" };

import * as util from './Calculations.js'

class Daemon {
    constructor( builder = {
        "id": "",
        "name": "",
        "type": [""],
        "stats": {
            "HP": 1,
            "attack": 1,
            "defense": 1,
            "speed": 1
        }
    }) {
        this.id = builder[ 'id' ];
        this.name = builder[ 'name' ];
        this.type = builder[ 'type' ];
        this.stats = builder[ 'stats' ];

        this.moves = new Array( 4 );
    }
};

class Move {
    constructor( builder = {
        "name": "",
        "type": "",
        "power": 1,
        "accuracy": 1,
        "uses": 1
    }) {
        this.name = builder[ 'name' ];
        this.type = builder[ 'type' ];
        this.power = builder[ 'power' ];
        this.accuracy = builder[ 'accuracy' ];
        this.uses = builder [ 'uses' ];
    }
}

function createMonTable() {
    let monsArray = JSON.parse( JSON.stringify( monsJSON ));
    let i = 0;
    let monMap = new Map();

    monsArray.forEach( mon => {
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
        mon['id'] = 'mon' + counter;
        eval(`monMap.set('mon${counter}', mon);`);
    })
    return monMap;
}

function createMoveTable() {
    let moveArray = JSON.parse( JSON.stringify( movesJSON ));
    let i = 0;
    let moveMap = new Map

    moveArray.forEach( move => {
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
        move['id'] = 'move' + counter;
        eval(`moveMap.set('move${counter}', move);`);
    })
    return moveMap;
}

function createCounterTable() {
    let counter_obj = JSON.parse( JSON.stringify( counterJSON ));

    return counter_obj;
}


let monMap = createMonTable();
let moveMap = createMoveTable();
let matchups = createCounterTable();

console.log(monMap)
let myMon = monMap.get( util.returnMonID('Fuckboy', monMap ));
let theirMon = monMap.get( util.returnMonID('Wretched', monMap ));

