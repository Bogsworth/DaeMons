import * as parse from '../lib/Import.js'

class Move {
    /**
     * If builder is a string, it looks for a move of the same name,
     * otherwise it assumes builder is an object
     * @param {*} builder 
     */
    constructor( builder = {
        "_id": "testID69420",
        "_name": "Test Move",
        "_type": "unaligned",
        "_power": 69,
        "_accuracy": 69,
        "_uses": 420,
        "_statsAffected": {
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
        let formatedBuilder = this.generateMoveBuildObj( builder );

        this._id = formatedBuilder[ '_id' ];
        this._name = formatedBuilder[ '_name' ];
        this._type = formatedBuilder[ '_type' ];
        this._power = formatedBuilder[ '_power' ];
        this._accuracy = formatedBuilder[ '_accuracy' ];
        this._uses = formatedBuilder[ '_uses' ];
        this._statsAffected = formatedBuilder[ '_statsAffected' ];
        this._remainingUses = formatedBuilder[ '_remainingUses' ];
        this._description = formatedBuilder[ '_description' ];
        this._isHitOnLastUse = false;
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get type() { return this._type; }
    get power() { return this._power; }
    get accuracy() { return this._accuracy; }
    get usesTotal() { return this._uses; }
    get usesRemaining() { return this._remainingUses; }
    get usesReadable() { return this.usesRemaining + '/' + this.usesTotal; }
    get statsAffected() { return this._statsAffected; }
    get description() { return this._description; }
    get isHitOnLastUse() { return this._isHitOnLastUse; }
   
    get statsAffectedArray() {
        let effectArray = [];

        for (let [target, stats] of Object.entries( this.statsAffected )) {
            for (let [stat, effect] of Object.entries( stats )){
                if ( effect ) {
                    effectArray.push( [ target, stat, effect ] );
                }
            }
        }
        return effectArray;
    }
    
    get isStatsAffected() {
        let isStatsAffected = false;

        Object.entries( this.statsAffected )
            .flat( Infinity )
            .filter( entry => typeof( entry ) == 'object')
            .forEach( entry => {
                let x = Object.entries( entry )
                    .flat( Infinity )
                    .filter( entry => typeof( entry ) == 'number')
                    .every( num => num === 0 )
                if ( x === false ) {
                    isStatsAffected = true;
                    return;
                }
            })

        return isStatsAffected;
    }

    generateMoveBuildObj( builder ) {
        let moveData = builder;

        if ( typeof( builder ) === 'string' ) {
            const NAME = builder;
            const MOVE_MAP = parse.createMoveTable();
            const ID = returnIDFromName( NAME, MOVE_MAP );

            moveData = MOVE_MAP.get( ID );    
        }
        if ( moveData[ '_remainingUses' ] === undefined ) {
            moveData[ '_remainingUses' ] = moveData [ '_uses' ];
        }
        if ( moveData[ '_description' ] === undefined ) {
            moveData[ '_description' ] = 'Hello! I am a move!';
        }
        return moveData;

        function returnIDFromName( name, map ) {
            let id = false;
            
            map.forEach( move => {
                if (move._name !== name) { return; }
                id = move._id;
            });
            return id;
        }
    }

    resetRemainingUses() {
        this._remainingUses = this._uses;
    }

    // TODO: Is there some way to try this but throw specific exception within this function?
    // TODO: Implement this function
    useMove() {
        if (this._remainingUses <= 0 ) {
            console.log('Using move with no uses left');
            return;
        }

        this.decrementRemainingUses();
        this.checkIfHit();
        return;
    }

    useMoveFull( defendingMon ) {
        
    }

    decrementRemainingUses( decrementBy = 1) {
        if ( this._remainingUses == 0 ) return false;
        
        this._remainingUses = this._remainingUses - decrementBy;
        if ( this._remainingUses < 0 ) this._remainingUses = 0;
        return true;
    }

    checkIfHit() {
        const HIT_CHANCE = this.accuracy / 100;
        const RAND = Math.random();

        this._isHitOnLastUse = ( RAND < HIT_CHANCE );
        return this._isHitOnLastUse;
    }
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