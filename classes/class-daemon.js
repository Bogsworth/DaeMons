import * as calc from '../lib/Calculations.js'
import * as parse from '../lib/Import.js'
import { Move } from './class-move.js'

class Daemon {
    constructor( builderJSON = {
            "id": "",
            "name": "",
            "type": [""],
            "stats": {
                "HP": 1,
                "attack": 1,
                "defense": 1,
                "speed": 1
            },
            "moves": [null, null, null, null],
            "tempStatChange":  {
                "attack": 0,
                "defense": 0,
                "speed": 0
            },
            "description": "I am a daemon!!! Grrrr"
    }) {
        let formattedBuilder = this.returnBuildObjFromJSON( builderJSON );

        this.uuid = formattedBuilder[ 'uuid' ];
        this.id = formattedBuilder[ 'id' ]
        this.name = formattedBuilder[ 'name' ];
        this.type = formattedBuilder[ 'type' ];
        this.stats = formattedBuilder[ 'stats' ];
        this.moves = formattedBuilder['moves'];
        this.currentHP = formattedBuilder['currentHP']
        this.tempStatChange = formattedBuilder['tempStatChange']
        this.description = formattedBuilder['description']
    }

    returnBuildObjFromJSON( builder ) {
        this.initIfUndefined(
            builder[ 'tempStatChange' ],
            { attack: 0, defense: 0, speed: 0 }
        );
        this.initIfUndefined(
            builder[ 'currentHP' ],
            builder['stats']['HP']
        );
        builder['moves'] = this.moveMaker(builder['moves']);
        if ( builder['uuid'] === undefined ) {
            builder['uuid'] = uuidv4();
        }

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

    generateDaemonFromID( id = 'monID000', tier = 1, bossFlag = false ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LOCK_TYPE = this.bossFlagBoolToStr(bossFlag);        
        const MON_TABLE = new Map(parse.createMonTable());
        const BUILDER = MON_TABLE.get(id);

        // console.log(BUILDER.movesKnown)
        const MOVE_NAMES = BUILDER.movesKnown[tier][LOCK_TYPE];

        this.id = BUILDER[ 'id' ];
        this.name = BUILDER[ 'name' ];
        this.type = BUILDER[ 'type' ];
        this.stats = BUILDER[ 'stats' ];
        this.moves = this.moveMaker( MOVE_NAMES );
        this.currentHP = BUILDER[ 'stats' ][ 'HP' ];
        this.tempStatChange = { "attack": 0, "defense": 0, "speed": 0 };
        this.description = this.initIfUndefined(
            BUILDER[ 'description' ],
            'MonTable doesnt have descriptions yet'
        );
    }

    initIfUndefined( obj, setValue ) {
        if ( obj === undefined ) obj = setValue;
        return obj;
    }

    moveMaker( moveNameArray ) {
        let moveArray = moveNameArray.map(moveName => {
            if (moveName == null) return moveName;
            return new Move( moveName );
        })

        return moveArray;
    }

    returnUUID() { return this.uuid; }
    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
    returnTypeAsString() {
        if ( this.type.length == 1 ) {
            return this.type[0];
        }
        else if ( this.type.length == 2) {
            return `${this.type[0]}, ${this.type[1]}`;
        }
    }
    returnStats() { return this.stats; }
    returnTempStatsModifiers() { return this.tempStatChange; }
    returnMoves() { return this.moves; }
    returnCurrentHP() { return this.currentHP; }
    returnCurrentHPReadable() {
        return this.currentHP + '/' + this.stats.HP + ' hp'
    }
    returnHPStat() { return this.stats.HP; }
    returnAttackStat() { return this.stats.attack; }
    returnDefenseStat() { return this.stats.defense; }
    returnSpeedStat() { return this.stats.speed; }
    returnDescription() { return this.description; }

    returnTrueIfDead() { return this.returnCurrentHP() <= 0; }

    addMove( newMove ) {
        if ( this.returnTotalMovesKnown() == 4 ) {
            throw new Error('MovesFull');
        }

        let isMoveChaged = false;
        let newMoveArray = this.moves.map(move => {
            if ( isMoveChaged || move != null) {
                return move;
            }

            isMoveChaged = true;
            return newMove;
        });

        this.moves = newMoveArray;
    }

    populateMovesWithObjs() {
        let i = 0;
        this.moves
            .filter( move => move != null )
            .forEach( move => {
                tempMove.copyFromData( JSON.stringify(move ));
                this.moves[i] = tempMove;
                i++;
        })
    }

    restoreHP() {
        this.currentHP = this.stats['HP'];
    }

    restoreAllMoveUses() {
        this.moves
            .filter( move => move != null)
            .forEach( move => move.resetRemainingUses());
    }

    updateHP( damage ) {
        this.currentHP -= damage;
    }

    returnModifiedStat( stat ) {
        const STAT_VAL = this.stats[ stat ];
        const MODIFIER = this.tempStatChange[ stat ];
        let modifiedStat = STAT_VAL * ( 10 + ( MODIFIER / 2 )) / 10 ;

        return modifiedStat;
        // return calc.modifyStat( this.stats[stat], this.tempStatChange[stat]);
    }

    updateTempStatChange( stat, change ) {
        const MAX_OFFSET = 6

        if (
            this.tempStatChange[stat] >= MAX_OFFSET ||
            this.tempStatChange[stat] <= 0 - MAX_OFFSET
        ) {
            return false;
        }

        if (this.checkStatChangeInRange( stat, change, MAX_OFFSET )) {
            this.tempStatChange[stat] += change;
            return true;
        }

        if (change >= 0) {
            this.tempStatChange[stat] = MAX_OFFSET;
        }
        else {
            this.tempStatChange[stat] = 0 - MAX_OFFSET;
        }
        return true;
    }

    checkStatChangeInRange( stat, change, maxOffset ) {
        const MAX_VAL = maxOffset
        const MIN_VAL = 0 - maxOffset;

        return (
            this.tempStatChange[stat] + change <= MAX_VAL &&
            this.tempStatChange[stat] + change >= MIN_VAL
        );
    }

    resetTempStatModifiers() {
        for (let [stat, mod] of Object.entries(this.tempStatChange)) {
            this.tempStatChange[stat] = 0;
        }
    }

    copyMon( monToCopy ) {
        for ( const [ key, val ] of Object.entries( this )) {
            this[key] = monToCopy[key]
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
