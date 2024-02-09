import { Daemon } from './class-daemon.js'
import { Party } from './class-party.js'
import lockJSON from '../data/enemy-warlocks.json' assert { type: "json"};
import * as calc from '../lib/Calculations.js'
import * as parse from '../lib/Import.js'

class Warlock {
    /**
     * If builder is a string, it will assume it is a lockID and pull the
     * specified Warlock
     * @param {*} builder 
     */
    constructor( builder = 
        {
            id: 'lockID69420',
            name: 'EmptyLock',
            daemonTypes: [ 'unaligned' ],
            tier: 'tier 1',
            party: new Party(),
            description: 'empty Warlock builder description',
            reward: {}
        }
    ) {
        let formattedBuilder = builder;

        if ( typeof( builder ) === 'string') {
            formattedBuilder = this.returnBuildObjFromLockID( builder, 0 );
        }

        this.id = formattedBuilder.id;
        this.name = formattedBuilder.name;
        this.daemonTypes = formattedBuilder.daemonTypes;
        this.tier = formattedBuilder.tier;
        this.party = new Party( formattedBuilder.party );
        this.description = formattedBuilder.description;
        this.reward = formattedBuilder.reward;
    }

    returnBuildObjFromLockID( ID, tier = 1, isBossFlag = false ) {
        const LOCK_MAP = parse.createWarlocks(lockJSON);
        const LOCK_INFO = LOCK_MAP.get( ID );
        const TIER = 'tier ' + tier;
        const PARTY_CREATOR = this.partyCreator(LOCK_INFO.allowedDaemons[TIER], tier, isBossFlag)
        let builder = {};

        builder.id = ID;
        builder.tier = TIER;
        builder.name = LOCK_INFO.name;
        builder.daemonTypes = LOCK_INFO.daemonTypes;
        builder.description = LOCK_INFO.description;
        builder.reward = LOCK_INFO.reward;

        builder.party = new Party();
        builder.party.setParty( PARTY_CREATOR );

        return builder;
    }

    partyCreator(allowedDaemonsOfTier, tier, isBossFlag) {
        const LENGTH = allowedDaemonsOfTier.length;
        const INDEX = calc.getRandomInt(LENGTH);
        const SELECTED_DAEMON_NAMES = allowedDaemonsOfTier[INDEX];

        return SELECTED_DAEMON_NAMES
            .map( daemonName => createDaemonFromName( daemonName, tier, isBossFlag ));

        function createDaemonFromName( name, tier, isBossFlag ) {
            const MON_TABLE = parse.createMonTable()
            const DAEMON_ID = calc.returnIDFromName( name, MON_TABLE );
            const DAEMON = new Daemon();

            DAEMON.generateDaemonFromID( DAEMON_ID, tier, isBossFlag )
            return DAEMON;
        }
    }

    chooseMove() {
        let totalMovesKnown = this.activeMon.returnTotalMovesKnown()
        let chosenMoveIndex = calc.getRandomInt( totalMovesKnown );
    
        return this.activeMon.moves[ chosenMoveIndex ];
    }
}

// console.log('hello world!')
// let lock = new Warlock('lockID000');
// console.log(lock)

// let convertedLock = JSON.stringify(lock);
// console.log(convertedLock)

// let revivedLock = new Warlock(JSON.parse(convertedLock))
// // console.log(revivedLock);
// console.dir(revivedLock, {depth: null})


export { Warlock }