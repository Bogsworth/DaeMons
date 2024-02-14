import { Daemon } from './class-daemon.js'
import { Move } from './class-move.js'

class Party {
    // constructor(builder = [ new Daemon() ]) {
        
    //     this.members = builder;
    //     this.activeMon = this.members[0];
    // }
    constructor( builder = {
        members: [],
        activeMon: {}
    } ) {
        this.members = createDaemonArray( builder.members );
        this.activeMon;

        this.updateActiveMon();

        function createDaemonArray(daemonData) {
            if ( daemonData.length == 0 ) {
                return [];
            }

            return daemonData.map(daemon => new Daemon(daemon))
        }
    }

    //TODO: Put in an order
    //TODO: Check if party is full
    addMonToParty( daemon ) {
        this.members.push(daemon);
        this.updateActiveMon();
    }

    setParty( daemonArray ) {
        this.members = daemonArray;
        this.updateActiveMon();
    }

    updateActiveMon() {
        if (this.members[0] === undefined) {
            this.activeMon = {};
        }
        else {
            this.activeMon = this.members[0];
        }
    }


    checkIfWipe() {
        return (
            this.members
                .every( mon => mon.returnCurrentHP() <= 0 )
        );
    }

    saveToLocation() {
        sessionStorage.currentParty = JSON.stringify(this);
        console.log(sessionStorage)
    }

    switchActiveDaemonToIndex( index ) {
        this.activeMon.resetTempStatModifiers();
        this.activeMon = this.members[ index ];
    }

}

// let daemon = new Daemon()
// daemon.generateDaemonFromID();
// let party = new Party();
// console.log(party);


// party.addMonToParty(daemon);
// party.activeMon.addMove(new Move());
// party.activeMon.moves[2].decrementRemainingUses(421);
// console.dir(party, {depth: null});

// let partyString = JSON.stringify(party);
// console.log(partyString);

// let revivedParty = new Party(JSON.parse(partyString));
// console.dir(revivedParty, {depth: null})

// console.log(party == revivedParty)

export { Party }