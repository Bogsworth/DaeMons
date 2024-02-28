import * as calc from '../lib/Calculations.js'
import * as parse from '../lib/Import.js'
import { Move } from './class-move.js'

class Daemon {
    constructor( builderJSON = {
            "_id": "",
            "_name": "",
            "_type": [""],
            "_stats": {
                "HP": 1,
                "attack": 1,
                "defense": 1,
                "speed": 1
            },
            "_moves": [null, null, null, null],
            "_tempStatChange":  {
                "attack": 0,
                "defense": 0,
                "speed": 0
            },
            "_description": "I am a daemon!!! Grrrr"
    }) {
        let formattedBuilder = this.generateDaemonBuildObject( builderJSON );

        console.log(formattedBuilder);
        console.log(JSON.stringify(formattedBuilder))

        this._uuid = formattedBuilder[ '_uuid' ];
        this._id = formattedBuilder[ '_id' ]
        this._name = formattedBuilder[ '_name' ];
        this._type = formattedBuilder[ '_type' ];
        this._stats = formattedBuilder[ '_stats' ];
        this._moves = formattedBuilder[ '_moves' ];
        this._currentHP = formattedBuilder[ '_currentHP' ];
        this._tempStatChange = formattedBuilder[ '_tempStatChange' ];
        this._description = formattedBuilder[ '_description' ];
    }

    get uuid() { return this._uuid; }
    get id() { return this._id; }
    get name() { return this._name; }
    get description() { return this._description; }

    get type() { return this._type; }
    get typeAsString() { this.typeToString(); }
    
    // TODO: have moves return only moves, not nulls
    get moves() { return this._moves; }
    get movesNumberKnown() { this.returnTotalMovesKnown(); }

    get stats() { return this._stats; }
    get tempStatChange() { return this._tempStatChange; }
    get statsTempModifiers() { return this._tempStatChange; }
    
    get statHP() { return this._stats.HP; }
    get currentHP() { return this._currentHP; }
    get currentHPReadable() { return this._currentHP + '/' + this._stats.HP + ' hp'; }
    get isDead() { return this._currentHP <= 0; }

    get statAttack() { return this._stats.attack; }
    get statDefense() { return this._stats.defense; }
    get statSpeed() { return this._stats.speed; }
    
    get statAttackModified() { return this._returnModifiedStat( 'attack' ); }
    get statDefenseModified() { return this._returnModifiedStat( 'defense' ); }
    get statSpeedModified() { return this._returnModifiedStat( 'speed' ); }

    generateDaemonBuildObject( builder ) {
        const UUID = uuidv4();

        builder[ '_tempStatChange' ] = this.initIfUndefined(
            builder[ '_tempStatChange' ],
            { attack: 0, defense: 0, speed: 0 }
        );
        builder[ '_currentHP' ] = this.initIfUndefined(
            builder[ '_currentHP' ],
            builder['_stats']['HP']
        );
        builder[ '_uuid'] = this.initIfUndefined(
            builder[ '_uuid' ],
            UUID
        );
        builder[ '_moves' ] = this.moveMaker( builder[ '_moves' ] );

        return builder;

        // FWIW, I don't know how this works
        function uuidv4() {
            let regex = /[xy]/g;
            let defaultStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
            return defaultStr.replace(
                regex,
                function (c) {
                    const r = Math.random() * 16 | 0, 
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }
            );
        }
    }

    /**
     * 
     * @param {*} id default 'monID000'
     * @param {*} TIER default 1
     * @param {*} bossFlag default false
     */
    generateDaemonFromID( id = 'monID000', tier = 1, bossFlag = false ) {
        const TIER = this.tierToString( tier );
        const LOCK_TYPE = this.bossFlagBoolToStr( bossFlag );        
        const MON_TABLE = new Map( parse.createMonTable() );
        const BUILDER = MON_TABLE.get( id );
        const MOVE_NAMES = BUILDER._movesKnown[ TIER ][ LOCK_TYPE ];

        this._id = BUILDER[ '_id' ];
        this._name = BUILDER[ '_name' ];
        this._type = BUILDER[ '_type' ];
        this._stats = BUILDER[ '_stats' ];
        this._moves = this.moveMaker( MOVE_NAMES );
        this._currentHP = BUILDER[ '_stats' ][ 'HP' ];
        this._tempStatChange = { "attack": 0, "defense": 0, "speed": 0 };
        this._description = this.initIfUndefined(
            BUILDER[ '_description' ],
            'MonTable doesnt have descriptions yet'
        );
    }

    initIfUndefined( obj, setValue ) {
        if ( obj === undefined ) {
            obj = setValue;
        }
        return obj;
    }

    moveMaker( moveNameArray ) {
        let moveArray = moveNameArray
            .filter( moveName => moveName !== null )
            .map( moveName => new Move( moveName ));
        return moveArray;
    }

    addMove( newMove ) {
        if ( this.returnTotalMovesKnown() == 4 ) {
            throw new Error('MovesFull');
        }

        let isMoveChanged = false;

        this._moves = this.moves.map(move => {
            if ( isMoveChanged || move != null) {
                return move;
            }

            isMoveChanged = true;
            return newMove;
        });
    }

    restoreHP() {
        this._currentHP = this.statHP;
    }

    restoreAllMoveUses() {
        this.moves
            .filter( move => move != null)
            .forEach( move => move.resetRemainingUses());
    }

    updateHP( damage ) {
        this._currentHP -= damage;
    }

    _returnModifiedStat( stat ) {
        const STAT_VAL = this.stats[ stat ];
        const MODIFIER = this.statsTempModifiers[ stat ];
        let modifiedStat = STAT_VAL * ( 10 + ( MODIFIER / 2 )) / 10 ;

        if ( stat === 'defense' ) {
            if ( modifiedStat < 1 ) {
                modifiedStat = 1;
            }
        }

        return modifiedStat;
    }

    updateTempStatChange( stat, change ) {
        const MAX_OFFSET = 6

        if (
            this._tempStatChange[ stat ] >= MAX_OFFSET ||
            this._tempStatChange[ stat ] <= 0 - MAX_OFFSET
        ) {
            return false;
        }

        if ( this.checkStatChangeInRange( stat, change, MAX_OFFSET ) ) {
            this._tempStatChange[ stat ] += change;
            return true;
        }

        if ( change >= 0 ) {
            this._tempStatChange[ stat ] = MAX_OFFSET;
        }
        else {
            this._tempStatChange [ stat ] = 0 - MAX_OFFSET;
        }
        return true;
    }

    checkStatChangeInRange( stat, change, maxOffset ) {
        const MAX_VAL = maxOffset
        const MIN_VAL = 0 - maxOffset;

        return (
            this.tempStatChange[ stat ] + change <= MAX_VAL &&
            this.tempStatChange[ stat ] + change >= MIN_VAL
        );
    }

    resetTempStatModifiers() {
        for (let [ stat, mod ] of Object.entries(this.tempStatChange)) {
            this.tempStatChange[ stat ] = 0;
        }
    }

    copyFromData ( monString ) {
        for ( const [ key, val ] of Object.entries( this )) {
            let parsedData = JSON.parse(monString)
            this[key] = parsedData[key]
        }
        this.populateMovesWithObjs();
    }

    returnTotalMovesKnown() {
        const doesMoveExist = (move) => move != null;
        
        return this.moves.filter( doesMoveExist ).length;
    }

    bossFlagBoolToStr( isBossFlag ) {
        if ( isBossFlag ) {
            return 'boss';
        }
        return 'normalLock';
    }

    tierToString( tier ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        return tier;
    }

    typeToString() {
        if ( this.type.length == 1 ) {
            return this.type[0];
        }
        else if ( this.type.length == 2) {
            return `${this.type[0]}, ${this.type[1]}`;
        }
    }
};


// This requires a 'sleep' function or else it has trouble initializing the Move class
// before it needs to use it.

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
// console.log('Hello');

// sleep(500).then(() => {
//     console.log('World!');

//     let tempMon = new Daemon()
//     tempMon.generateDaemonFromID();
//     let moveToAdd = new Move();

//     console.log(tempMon)
//     tempMon.addMove(moveToAdd)
//     tempMon.moves[2].decrementRemainingUses(69)
//     console.log(tempMon)

//     let stringifiedMon = JSON.stringify(tempMon);
//     console.log(stringifiedMon)

//     let restoredMon = new Daemon (JSON.parse(stringifiedMon))
//     console.log(restoredMon)
// });

export { Daemon }
