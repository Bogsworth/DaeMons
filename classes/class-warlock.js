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
            "_id": 'lockID69420',
            "_name": 'EmptyLock',
            "_daemonTypes": [ 'unaligned' ],
            "_tier": 'tier 1',
            "_party": new Party(),
            "_description": 'empty Warlock builder description',
            "_reward": {}
        }
    ) {
        let formattedBuilder = builder;

        if ( typeof( builder ) === 'string') {
            formattedBuilder = this.returnBuildObjFromLockID( builder, 0 );
        }

        this._id = formattedBuilder[ '_id' ];
        this._name = formattedBuilder[ '_name' ];
        this._daemonTypes = formattedBuilder[ '_daemonTypes' ];
        this._tier = formattedBuilder[ '_tier' ];
        this._party = new Party( formattedBuilder[ '_party' ] );
        this._description = formattedBuilder[ '_description' ];
        this._reward = formattedBuilder[ '_reward' ];
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get daemonTypes() { return this._daemonTypes; }
    get tier() { return this._tier };
    get party() { return this._party; }
    get description() { return this._description; }
    get reward() { return this._reward; }

    set id( id ) { this._id = id; }
    set name( name ) { this._name = name; }
    set daemonTypes( types ) { this._daemonTypes = types; }
    set tier( tier ) { this._tier = tier; }
    set party( partyData ) { this._party = this._updateparty( partyData ) }
    set description( description ) { this._description = description; }
    set reward( reward ) { this._reward = reward; }

    returnBuildObjFromLockID( ID, tier = 1, isBossFlag = false ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LOCK_MAP = parse.createWarlocks(lockJSON);
        const LOCK_INFO = LOCK_MAP.get( ID );

        console.log(LOCK_MAP)
        console.log(LOCK_INFO)

        const PARTY_CREATOR = this.partyCreator( 
            LOCK_INFO._allowedDaemons[ tier ],
            tier,
            isBossFlag
        );
        let builder = {};

        builder._id = ID;
        builder._tier = tier;
        builder._name = LOCK_INFO.name;
        builder._daemonTypes = LOCK_INFO.daemonTypes;
        builder._description = LOCK_INFO.description;
        builder._reward = LOCK_INFO.reward;

        builder._party = new Party();
        builder._party.setParty( PARTY_CREATOR );

        return builder;
    }

    generateWarlockFromID( ID, tier = 1, isBossFlag = false ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LOCK_MAP = parse.createWarlocks( lockJSON );
        const LOCK_INFO = LOCK_MAP.get( ID );
        const PARTY_CREATOR = this.partyCreator(
            LOCK_INFO._allowedDaemons[ tier ],
            tier,
            isBossFlag
        );
        
        this.id = ID;
        this.tier = tier,
        this.name = LOCK_INFO._name;
        this.daemonTypes = LOCK_INFO._daemonTypes;
        this.description = LOCK_INFO._description;
        this.reward = LOCK_INFO._reward;
        this.party = PARTY_CREATOR;
    }

    partyCreator( allowedDaemonsOfTier, tier, isBossFlag ) {
        if ( typeof( tier ) === 'number') {
            tier = 'tier ' + tier;
        }
        const LENGTH = Object.keys( allowedDaemonsOfTier ).length;
        const INDEX = calc.getRandomInt( LENGTH );
        const SELECTED_DAEMON_NAMES = allowedDaemonsOfTier[ INDEX ];

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
        let totalMovesKnown = ACTIVE_MON.movesNumberKnown;
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

    _updateparty( partyArray ) {
        const NEW_PARTY = new Party();
        
        NEW_PARTY.setParty( partyArray );
        return NEW_PARTY;
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

// let lock = new Warlock();
// console.log(lock)


export { Warlock }