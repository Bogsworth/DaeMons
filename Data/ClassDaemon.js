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
    }

    testfunc() {
        return 20;
    }
    returnID() { return this.id; }
    returnName() { return this.name; }
    returnType() { return this.type; }
    returnStats() { return this.stats; }
    returnMoves() { return this.moves; }
    returnCurrentHP() { return this.currentHP; }

    updateHP( damage ) { this.currentHP -= damage }

    copyMon( monToCopy ) {
        for ( const [ key, val ] of Object.entries( this )) {
            this[key] = monToCopy[key]
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