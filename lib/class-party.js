import { Daemon } from '../data/class-daemon.js'
import { Move } from '../data/class-move.js'

class Party {
    constructor(builder = [ new Daemon() ]) {
        
        this.fullParty = builder;
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