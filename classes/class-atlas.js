// Taking in a json with different tiers of rooms and arranging them
// for this playthrough

import roomJSON from '../data/enemy-warlocks-by-tier.json' assert { type: "json" };
import lockJSON from '../data/enemy-warlocks.json' assert { type: "json"};
import * as parse from '../lib/Import.js'
import * as calc from '../lib/Calculations.js'
import { Warlock } from './class-warlock.js'



class Atlas {
    constructor(requiredLocksPerTier = [1, 3, 1, 1]) {
        if ( ! Array.isArray( requiredLocksPerTier )) {
            this.initializeFromMap(requiredLocksPerTier);
            return;
        }
        this.lockMap = parse.createWarlocks(lockJSON);
        this.tierMap = this.returnTierMap();

        this.battleOrder = new Map();
        this.initBattleOrder( requiredLocksPerTier );
        this.addGauntlets();
    }

    initializeFromMap( atlasMap ) {
        this.lockMap = atlasMap.lockMap;
        this.tierMap = atlasMap.tierMap;
        this.battleOrder = atlasMap.battleOrder;
    }

    returnTierMap() {
        
        let tierMap = new Map();
        for (let [ lockID, lockData] of this.lockMap) {
            Object.keys(lockData.allowedDaemons).forEach( tier => {
                if (! tierMap.has(tier)) {
                    tierMap.set(tier, [])
                }

                tierMap.get(tier).push(lockID)
            })
        }
        // const tierMap = new Map(
        //     [...this.lockMap]
        //     .filter(([key, val]) => val.allowedDaemons.includes('tier 1') )
        //   );

        // let tierMap = new Map();

        // for ( let [ key, val ] of this.lockMap ) {
        //     const ID = 'tier ' + val.tier;

        //     if ( ! tierMap.has(ID)) {
        //         tierMap.set(ID, [key]);
        //         continue;
        //     }

        //     tierMap.get(ID).push(key);
        // }

        return tierMap;
    }

    initBattleOrder( requiredLocksPerTier ) {
        let i = 0;
        let prevRoomID;

        requiredLocksPerTier.forEach( locksRequired => {
            const TIER = 'tier ' + i++;
            const NUM_LOCKS = this.tierMap.get( TIER ).length;
            let choices = randArrayNoRepeats( locksRequired, NUM_LOCKS );

            choices.forEach( chosenLockIndex => {
                const LOCK_ID = this.tierMap.get(TIER)[chosenLockIndex]
                const LOCK = new Warlock();
                const NEXT_ROOM_ID = this.generateNextRoomID();
                let isFirstRoom = this.battleOrder.size == 0;

                if ( ! isFirstRoom ) {
                    this.battleOrder.get( prevRoomID ).nextRoomID.push( NEXT_ROOM_ID );
                }
                LOCK.generateWarlockFromID( LOCK_ID, TIER )
                this.battleOrder.set(
                    NEXT_ROOM_ID,
                    {
                        lock: LOCK,
                        nextRoomID: [],
                        availableGauntlets: []
                    }
                )
                prevRoomID = NEXT_ROOM_ID;
            })
        })
    }

    addGauntlets(numberOfGauntlets = 1) {
        let keys = Array.from( this.battleOrder.keys() );
        let allowedGauntletStarts = keys.slice(1, this.battleOrder.size - 1);

        while( numberOfGauntlets-- > 0 ){
            let gauntlet = this.generateGauntlet(2);
            let roomID = allowedGauntletStarts[
                Math.floor(
                    Math.random()*allowedGauntletStarts.length
                )
            ];

            this.battleOrder.get(roomID).availableGauntlets.push(gauntlet);
        }
    }

    generateGauntlet(length, allowedLockTiers = ['tier 1']) {
        let i = 0;
        let allowedIDs = [];
        let lockArray = [];
        
        allowedLockTiers.forEach( tier => {
            let currentidArray = this.tierMap.get(tier);

            allowedIDs = allowedIDs.concat( currentidArray );
        })

        while ( i++ < length ) {
            let chosenID = allowedIDs[Math.floor(Math.random()*allowedIDs.length)];

            lockArray.push(chosenID);
        }

        return lockArray;
    }

    generateNextRoomID() {
        const ROOM_COUNT = this.battleOrder.size;
        const ID_LENGTH = 3;
        let roomStr = 'roomID';
        let longIDNo = '00000000' + ROOM_COUNT;
        let roomIDStr = roomStr + longIDNo.slice( 0 - ID_LENGTH );

        return roomIDStr;
    }

    printGauntlets() {
        Array.from(this.battleOrder.values()).forEach(room => {
            if (room.availableGauntlets.length >= 1) {
                console.log(room.availableGauntlets);
            }
        })
    }
}

function randArrayNoRepeats(length, availableOptions) {
    let array = Array.apply(null, Array(length)).map(function () {});
    let i = 0;

    array.forEach( val => {
        val = calc.getRandomInt(availableOptions);

        if ( i == 0 ) {
            array[i++] = val;
            return;
        }

        array[i] = val;
        while (array[ i - 1 ] == val) {
            val = calc.getRandomInt(availableOptions);
            array[i] = val;
        }
        i++;
    })
    return array;
}




function replacer(key, value) {
    if ( ! ( value instanceof Map )) {
        return value;
    }
    return {
        dataType: 'Map',
        value: [...value]
    };
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}


// let atlas = new Atlas([1, 2]);
// console.log(atlas)

// let atlasStringified = JSON.stringify(atlas, replacer)
// console.log('stringified atlas')
// console.log(atlasStringified);

// let revivedAtlas = JSON.parse(atlasStringified, reviver);
// console.log(revivedAtlas.battleOrder)

export { Atlas }