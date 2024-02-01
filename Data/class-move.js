import * as parse from '../lib/Import.js'
import * as calc from '../lib/Calculations.js'

class Move {
    // constructor( builder = {
    //     "id": "",
    //     "name": "",
    //     "type": [""],
    //     "power": 1,
    //     "accuracy": 1,
    //     "uses": 1,
    //     "statsAffected": {
    //         "self": {
    //             "attack": 0,
    //             "defense": 0,
    //             "speed": 0
    //         },
    //         "enemy": {
    //             "attack": 0,
    //             "defense": 0,
    //             "speed": 0
    //         }
    //     }
    // }) {
    constructor ( builder = 'Smack' ) {
        let moveTable = new Map(parse.createMoveTable())
        let moveData;

        if ( typeof( builder ) == 'string') {
            let ID = calc.returnIDFromName(builder, moveTable)
            moveData = moveTable.get(ID);    
        }
        else {
            moveData = builder;
        }
        this.id = moveData[ 'id' ];
        this.name = moveData[ 'name' ];
        this.type = moveData[ 'type' ];
        this.power = moveData[ 'power' ];
        this.accuracy = moveData[ 'accuracy' ];
        this.uses = moveData[ 'uses' ];
        this.statsAffected = moveData[ 'statsAffected' ];

        this.remainingUses = this.uses;
        this.description = 'Hello! I am a move!';
    }

    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
    returnPower() { return this.power; } 
    returnAccuracy() { return this.accuracy; }
    returnUses() { return this.uses; }
    returnRemainingUses() { return this.remainingUses; }
    returnStatsAffectedObject() { return this.statsAffected; }
    returnDescription() { return this.description; }
    returnUsesReadable() {
        return this.remainingUses + '/' + this.uses;
    }

    copyFromData ( moveString ) {
        let parsedData = JSON.parse(moveString);

        for ( const [ key, val ] of Object.entries( this )) {   
            this[key] = parsedData[key]
        }
    }

    returnStatAffectedBool() {
        let statsAffected = false;
        Object.entries( this.statsAffected )
            .flat( Infinity )
            .filter( entry => typeof(entry) == 'object')
            .forEach( entry => {
                let x = Object.entries( entry )
                    .flat(Infinity)
                    .filter(entry => typeof( entry ) == 'number')
                    .every( num => num === 0 )
                if (x == false) {
                    statsAffected = true;
                    return;
                }
            })

        return statsAffected;
    }
    
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

    decrementRemainingUses() {
        this.remainingUses--;
    }

    resetRemainingUses() {
        this.remainingUses = this.uses;
    }

    checkIfHit() {
        const HIT_CHANCE = this.accuracy / 100;
        const RAND = Math.random();
    
        return (RAND < HIT_CHANCE)
    }
}

// let moveTest = new Move (
//     {
//         "id": "",
//         "name": "",
//         "type": "",
//         "power": 1,
//         "accuracy": 1,
//         "uses": 1,
//         "statsAffected": {
//             "self": {
//                 "attack": 0,
//                 "defense": 0,
//                 "speed": 0
//             },
//             "enemy": {
//                 "attack": 0,
//                 "defense": 0,
//                 "speed": 0
//             }
//         }
//     });


export { Move }