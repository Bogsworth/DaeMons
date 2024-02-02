import { Daemon } from './class-daemon.js'
import { Move } from './class-move.js'

class Party {
    constructor(builder = [ new Daemon() ]) {
        
        this.fullParty = builder;
        this.activeMon = this.fullParty[0];
    }

    checkIfWipe() {
        return (
            this.fullParty
                .every( mon => mon.returnCurrentHP() <= 0 )
        );
    }

    saveToLocation( location = sessionStorage.currentParty ) {
        location = JSON.stringify(this.fullParty);
    }

}
// let party = new Party()
// party.saveToLocation();
// party.fullParty[0].updateHP(20)

// console.log(party.checkIfWipe())

// console.log('hello world');

export { Party }