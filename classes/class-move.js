import * as parse from '../lib/Import.js'
import * as calc from '../lib/Calculations.js'

class Move {
    /**
     * If builder is a string, it looks for a move of the same name,
     * otherwise it assumes builder is an object
     * @param {*} builder 
     */
    constructor( builder = {
        "id": "testID69420",
        "name": "Test Move",
        "type": "unaligned",
        "power": 69,
        "accuracy": 69,
        "uses": 420,
        "statsAffected": {
            "self": {
                "attack": 2,
                "defense": 0,
                "speed": 0
            },
            "enemy": {
                "attack": 0,
                "defense": -3,
                "speed": 0
            }
        }
    }) {
        let formatedBuilder = this.returnBuildObjFromJSON( builder )

        this.id = formatedBuilder[ 'id' ];
        this.name = formatedBuilder[ 'name' ];
        this.type = formatedBuilder[ 'type' ];
        this.power = formatedBuilder[ 'power' ];
        this.accuracy = formatedBuilder[ 'accuracy' ];
        this.uses = formatedBuilder[ 'uses' ];
        this.statsAffected = formatedBuilder[ 'statsAffected' ];
        this.remainingUses = formatedBuilder[ 'remainingUses' ];
        this.description = formatedBuilder[ 'description' ];
    }

    returnBuildObjFromJSON( builder ) {
        let moveData;

        if ( typeof( builder ) === 'string') {
            let moveTable = parse.createMoveTable();
            let ID = calc.returnIDFromName(builder, moveTable)
            moveData = moveTable.get(ID);    
        }
        else {
            moveData = builder;
        }

        if ( moveData[ 'remainingUses' ] === undefined ) {
            moveData[ 'remainingUses' ] = moveData [ 'uses' ];
        }
        if ( ! moveData[ 'description' ]) {
            moveData[ 'description' ] = 'Hello! I am a move!';
        }

        return moveData;
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

    decrementRemainingUses( decrementBy = 1) {
        if ( this.remainingUses == 0 ) return false;
        
        this.remainingUses = this.remainingUses - decrementBy;
        if ( this.remainingUses < 0 ) this.remainingUses = 0;
        return true;
    }

    resetRemainingUses() {
        this.remainingUses = this.uses;
    }

    checkIfHit() {
        const HIT_CHANCE = this.accuracy / 100;
        const RAND = Math.random();
    
        return (RAND < HIT_CHANCE)
    }

    // toJSON() {
    //     return {
    // 		   id: this.id,
    //         name: this.name,
    //         type: this.type,
    //         power: this.power,
    //         uses: this.uses,
    //         accuracy: this.accuracy,
    //         remainingUses: this.remainingUses,
    //         statsAffected: this.statsAffected,
    //         description: this.description
	// 	};
    // }
}

// let moveTest = new Move()

// moveTest.decrementRemainingUses(421)

// let testString = JSON.stringify(moveTest)

// console.log(moveTest)
// console.log(testString)

// let recreatedMove = new Move(JSON.parse(testString))

// console.log(recreatedMove)
// recreatedMove.resetRemainingUses()

// console.log(recreatedMove)


export { Move }