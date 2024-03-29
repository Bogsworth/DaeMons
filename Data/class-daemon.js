import * as calc from '../lib/calculations.js'
import { Move } from '../data/class-move.js'
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

        this.moves = [null, null, null, null];
        this.currentHP = builder[ 'stats' ][ 'HP' ];

        this.tempStatChange = {
            "attack": 0,
            "defense": 0,
            "speed": 0,
        }

        this.description = "";
    }

    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
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

    // TODO: Test addMove()
    addMove( moveString ) {
        if ( this.returnTotalMovesKnown == 4 ) {
            throw new Error('MovesFull');
        }

        this.moves.forEach(move => {
            if ( move != null ) {
                return;
            }
            move = new Move( moveString );
        });
    }

    populateMovesWithObjs() {
        let i = 0;
        this.moves.forEach( move => {
            let tempMove = new Move; 
            if ( move == null ) {
                return;
            }
            tempMove.copyFromData( JSON.stringify(move ));
            this.moves[i] = tempMove;
            i++;
        })
    }

    restoreAllMoveUses() {
        this.moves.forEach( move => {
            if ( move == null ) {
                return;
            }

            move.resetRemainingUses();
        });
    }

    updateHP( damage ) {
        this.currentHP -= damage;
    }

    returnModifiedStat( stat ) {
        return calc.modifyStat( this.stats[stat], this.tempStatChange[stat]);
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
        let movesKnown = 0;
        this.moves.forEach( move => {
            if ( move != null ) {
                movesKnown++;
            }
        });

        return movesKnown;
    }
};

export { Daemon }