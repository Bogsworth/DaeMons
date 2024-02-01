import { Daemon } from '../data/class-daemon.js'
import { Party } from './class-party.js'
import * as calc from './Calculations.js'
import * as parse from './Import.js'

class Warlock {
    // constructor(builder = {
    //     "name": "Fight Guy",
    //     "daemonTypes": ["wrath"],
    //     "allowedDaemons": {
    //         "tier 1": [["Angy Boy"], ["Punch Goblin"]],
    //         "tier 2": [["Barbarian"]],
    //         "tier 3": [["Jingoist"], ["Dragon"]]
    //     },
    //     "description": "This guy should be a walk in the park too",
    //     "reward": {
    //         "name": "Punch Goblin",
    //         "moves": ["Do You Lift?", "Smack", null, null]
    //     }
    // }) {
    // ----------
    // constructor( builder = parse.createWarlocks().get('lockID000')) {
    //     let monMap = parse.createMonTable();
    //     console.log(monMap)

        // this.party = [ new Daemon(builder["allowedDaemons"]["tier 1"][0]) ];

    constructor(builder = new Party([
        new Daemon('monID000'),
        new Daemon('monID001'),
        new Daemon('monID002')
    ])) {
        this.party = builder;
        //console.log(this.party)
        this.activeMon = this.party.fullParty[0];
        this.reward = '';
    }

    chooseMove() {
        let totalMovesKnown = this.activeMon.returnTotalMovesKnown()
        let chosenMoveIndex = calc.getRandomInt( totalMovesKnown );
    
        return this.activeMon.moves[ chosenMoveIndex ];
    }

}

// console.log( parse.createMonTable())

let newLock = new Warlock()
console.log(newLock)
console.log(newLock.party)
console.log(newLock.party.fullParty[0].returnMoves())

// let x = new Daemon('monID000')
// console.log(x.moves)


// console.log(newLock.chooseMove())
console.log('hello world!!!!')