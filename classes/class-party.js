import { Daemon } from './class-daemon.js'
import { Move } from './class-move.js'

class Party {
    constructor(builder = [ new Daemon() ]) {
        
        this.members = builder;
        this.activeMon = this.members[0];
    }

    checkIfWipe() {
        return (
            this.members
                .every( mon => mon.returnCurrentHP() <= 0 )
        );
    }

    saveToLocation( location = sessionStorage.currentParty ) {
        location = JSON.stringify(this.members);
    }

    switchActiveDaemonToIndex( index ) {
        this.activeMon.resetTempStatModifiers();
        this.activeMon = this.members[ index ];
    }

}
// let party = new Party()
// party.saveToLocation();
// party.members[0].updateHP(20)

// console.log(party.checkIfWipe())

// console.log('hello world');

export { Party }