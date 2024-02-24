import * as parse from '../lib/Import.js';
import { Daemon } from './class-daemon.js';

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
        let formattedBuilder = this.generateMoveBuildObj( builder );

        this._id = formattedBuilder[ '_id' ];
        this._name = formattedBuilder[ '_name' ];
        this._type = formattedBuilder[ '_type' ];
        this._power = formattedBuilder[ '_power' ];
        this._accuracy = formattedBuilder[ '_accuracy' ];
        this._uses = formattedBuilder[ '_uses' ];
        this._statsAffected = formattedBuilder[ '_statsAffected' ];
        this._remainingUses = formattedBuilder[ '_remainingUses' ];
        this._description = formattedBuilder[ '_description' ];
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
    useMove( attackingMon, defendingMon ) {
        if (this._remainingUses <= 0 ) {
            console.log('Using move with no uses left');
            return;
        }
        let damage = 0;

        this.decrementRemainingUses();
        this.checkIfHit();

        if ( ! this.isHitOnLastUse ) {
            return damage;
        }

        this.statsAffectedArray
            .forEach( effect => applyEffect( effect, attackingMon, defendingMon ));
        damage = this.calculateDamage({
            attacker: attackingMon,
            defender: defendingMon}
        );
        defendingMon.updateHP( damage );
        
        return damage;

        function applyEffect( effect, attackingMon, defendingMon ) {
            const TARGET = effect[ 0 ];
            const STAT = effect[ 1 ];
            const CHANGE = effect[ 2 ];

            if ( TARGET === 'self' ) {
                attackingMon.updateTempStatChange( STAT, CHANGE );
            }
            if ( TARGET === 'enemy' ) {
                defendingMon.updateTempStatChange( STAT, CHANGE );
            }
        }
    }

    calculateTypeModifier( defMonTyping = [] ) {
        let typeTable = parse.createCounterTable();
        let multiplier = 1;
    
        defMonTyping.forEach( type => {
            multiplier *= typeTable[ this.type ][ `vs_${type}` ]
        });
        return multiplier;
    }

    calculateDamage ( data = {
        attacker: new Daemon(),
        defender: new Daemon(),
    }) {
        const POWER = this.power;
        const TYPE_MOD = this.calculateTypeModifier( data.defender.type );
    
        const MODIFIED_ATT = data.attacker.statAttackModified;
        const MODIFIED_DEF = data.defender.statDefenseModified;
    
        let results = 0.4 * ( TYPE_MOD * ( MODIFIED_ATT / MODIFIED_DEF ) * POWER );
        if ( results < 1 && POWER !== 0 ) {
            results = 1;
        }
    
        return Math.round( results );
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