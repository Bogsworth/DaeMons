class Move {
    constructor( builder = {
        "id": "",
        "name": "",
        "type": "",
        "power": 1,
        "accuracy": 1,
        "uses": 1,
        "statsAffected": {
            "self": {
                "attack": 0,
                "defense": 0,
                "speed": 0
            },
            "enemy": {
                "attack": 0,
                "defense": 0,
                "speed": 0
            }
        }
    }) {
        this.id = builder[ 'id' ];
        this.name = builder[ 'name' ];
        this.type = builder[ 'type' ];
        this.power = builder[ 'power' ];
        this.accuracy = builder[ 'accuracy' ];
        this.uses = builder[ 'uses' ];
        this.statsAffected = builder[ 'statsAffected' ];

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
}

export { Move }