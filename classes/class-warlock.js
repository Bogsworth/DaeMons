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
        console.log(builder)
        let formatedBuilder = builder;

        if ( typeof( builder ) === 'string') {
            formatedBuilder = this.returnBuildObjFromLockID( builder, 0 );
        }

        console.log(formatedBuilder);

        this.id = formatedBuilder.id;
        this.name = formatedBuilder.name;
        this.daemonTypes = formatedBuilder.daemonTypes;
        // this.tier = formatedBuilder.tier;
        this.party = new Party( formatedBuilder.party );
        this.description = formatedBuilder.description;
        this.reward = formatedBuilder.reward;
    }

    returnBuildObjFromLockID( ID, tier = 1, isBossFlag = false ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LOCK_MAP = parse.createWarlocks(lockJSON);
        const LOCK_INFO = LOCK_MAP.get( ID );

        console.log(LOCK_MAP)
        console.log(LOCK_INFO)

        const PARTY_CREATOR = this.partyCreator(LOCK_INFO.allowedDaemons[tier], tier, isBossFlag)
        let builder = {};

        builder.id = ID;
        builder.tier = tier;
        builder.name = LOCK_INFO.name;
        builder.daemonTypes = LOCK_INFO.daemonTypes;
        builder.description = LOCK_INFO.description;
        builder.reward = LOCK_INFO.reward;

        builder.party = new Party();
        builder.party.setParty( PARTY_CREATOR );

        return builder;
    }

    generateWarlockFromID( ID, tier = 1, isBossFlag = false ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LOCK_MAP = parse.createWarlocks(lockJSON);
        const LOCK_INFO = LOCK_MAP.get( ID );
        const PARTY_CREATOR = this.partyCreator(LOCK_INFO.allowedDaemons[tier], tier, isBossFlag)
        
        this.id = ID;
        this.tier = tier,
        this.name = LOCK_INFO.name;
        this.daemonTypes = LOCK_INFO.daemonTypes;
        this.description = LOCK_INFO.description;
        this.reward = LOCK_INFO.reward;

        this.party = new Party();
        this.party.setParty( PARTY_CREATOR );
    }

    partyCreator(allowedDaemonsOfTier, tier, isBossFlag) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LENGTH = Object.keys(allowedDaemonsOfTier).length;
        const INDEX = calc.getRandomInt(LENGTH);
        const SELECTED_DAEMON_NAMES = allowedDaemonsOfTier[INDEX];

        return SELECTED_DAEMON_NAMES
            .map( daemonName => createDaemonFromName( daemonName, tier, isBossFlag ));

        function createDaemonFromName( name, tier, isBossFlag ) {
            const MON_TABLE = parse.createMonTable()
            const DAEMON_ID = returnIDFromName( name, MON_TABLE );
            const DAEMON = new Daemon();

            DAEMON.generateDaemonFromID( DAEMON_ID, tier, isBossFlag )
            return DAEMON;
        }

        function returnIDFromName( name, map ) {
            let id = false;
            
            map.forEach( move => {
                if (move._name !== name) { return; }
                id = move._id;
            });
            return id;
        }
    }

    chooseMove() {
        const ACTIVE_MON = this.party.activeMon;
        let totalMovesKnown = ACTIVE_MON.returnTotalMovesKnown()
        let chosenMoveIndex = calc.getRandomInt( totalMovesKnown );
    
        return ACTIVE_MON.moves[ chosenMoveIndex ];
    }

    switchToRandomMon() {
        const REMAINING_MON = this.party.members
            .filter(daemon => ! daemon.isDead );
        const RANDOM_INDEX = Math.floor( Math.random() * REMAINING_MON.length );
        const CHOSEN_UUID = REMAINING_MON[ RANDOM_INDEX ].uuid;

        this.party.switchActiveDaemonByUUID( CHOSEN_UUID );
    }

    returnName() { return this.name; }
    returnID() { return this.id; }
    returnDescription() { return this.description; }
    returnParty() { return this.party; }
}

// console.log('hello world!')
// let lock = new Warlock('lockID000');
// console.log(lock)

// let convertedLock = JSON.stringify(lock);
// console.log(convertedLock)

// let revivedLock = new Warlock(JSON.parse(convertedLock))
// // console.log(revivedLock);
// console.dir(revivedLock, {depth: null})

// let lock = new Warlock();
// console.log(lock)


export { Warlock }