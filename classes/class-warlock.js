import { Daemon } from './class-daemon.js'
import { Party } from './class-party.js'
import * as calc from '../lib/Calculations.js'
import * as parse from '../lib/Import.js'

class Warlock {
    /**
     * 
     * @param {*} name 
     * @param {*} daemonTypes 
     * @param {*} allowedDaemons 
     * @param {*} party 
     * @param {*} description 
     * @param {*} reward 
     * @param {*} id 
     * @param {*} tier 
     */
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
    // -------------
    // constructor(builder = new Party([
    //     new Daemon('monID000'),
    //     new Daemon('monID001'),
    //     new Daemon('monID002')
    // ])) {
    // -------------
    constructor(
        name = '',
        daemonTypes = [ 'unaligned' ],
        allowedDaemons = null,
        party = new Party(),
        description = '',
        reward = null,
        id = 'lockID999',
        tier = null
    ) {
        this.name = name;
        this.daemonTypes = daemonTypes;
        this.allowedDaemons = allowedDaemons;
        this.party = party;
        this.description = description;
        this.reward = reward;
        this.id = id;
        this.tier = tier;

        if ( tier && allowedDaemons ) {
            this.party = new Party(
                this.partyCreator(allowedDaemons[tier])
            )
        }

        this.activeMon = this.party.members[0];
    }

    partyCreator(allowedDaemonsOfTier) {
        let tempParty = [];
        const LENGTH = allowedDaemonsOfTier.length;
        const INDEX = calc.getRandomInt(LENGTH);
        const RANDOM_PARTY = allowedDaemonsOfTier[INDEX];

        RANDOM_PARTY.forEach(daemon => {
            tempParty.push( new Daemon( calc.returnIDFromName(daemon, parse.createMonTable()) ));
        })
        return tempParty;
    }

    chooseMove() {
        let totalMovesKnown = this.activeMon.returnTotalMovesKnown()
        let chosenMoveIndex = calc.getRandomInt( totalMovesKnown );
    
        return this.activeMon.moves[ chosenMoveIndex ];
    }

}

export { Warlock }