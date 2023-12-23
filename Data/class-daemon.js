import * as calc from '../lib/calculations.js'
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
    }

    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
    returnStats() { return this.stats; }
    returnTempStatsModifiers() { return this.tempStatChange; }
    returnMoves() { return this.moves; }
    returnCurrentHP() { return this.currentHP; }

    updateHP( damage ) { this.currentHP -= damage }

    returnModifiedStat( stat ) {
        return calc.modifyStat( this.stats[stat], this.tempStatChange[stat]);
    }

    updateTempStatChange( stat, change ) {
        this.tempStatChange[stat] += change;
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

export {
    Daemon
}