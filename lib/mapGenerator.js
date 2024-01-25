// Taking in a json with different tiers of rooms and arranging them
// for this playthrough

import roomJSON from '../data/enemy-warlocks-by-tier.json' assert { type: "json" };
import * as parse from './import.js'
import * as calc from './calculations.js'


class Atlas {
    constructor(requiredLocksPerTier = [1, 3, 1, 1]) {
        this.battleOrder = {};
        this.battleOrder = new Map();

        this.lockMap = parse.createWarlocks();
        this.tierMap = this.returnTierMap();

        this.initBattleOrder( requiredLocksPerTier );
        this.addGauntlets();
    }

    returnTierMap() {
        let tierMap = new Map();

        for ( let [ key, val ] of this.lockMap ) {
            const ID = 'tier ' + val.tier;

            if ( ! tierMap.has(ID)) {
                tierMap.set(ID, [key]);
                continue;
            }

            tierMap.get(ID).push(key);
        }

        return tierMap;
    }

    initBattleOrder( requiredLocksPerTier ) {
        let i = 0;
        let prevRoomID = null;
        let gauntletLength = 3;

        requiredLocksPerTier.forEach( locksRequired => {
            const TIER = i++;
            const NUM_LOCKS = roomJSON[TIER].warlocks.length;
            let choices = randArrayNoRepeats( locksRequired, NUM_LOCKS );

            choices.forEach( chosenLockIndex => {
                let chosenLock = roomJSON[TIER].warlocks[chosenLockIndex];
                let currentLockID = calc.returnIDFromName( chosenLock.name, this.lockMap );
                
                if ( this.battleOrder.size == 0 ) {
                    this.battleOrder.set(
                        'roomID000', 
                        { lockID: [currentLockID], nextRoomID: [], availableGauntlets: [] }
                    );
                    prevRoomID = 'roomID000';
                    return;
                }

                let newRoomID = this.generateNextRoomID();

                this.battleOrder.get( prevRoomID ).nextRoomID.push( newRoomID );
                this.battleOrder.set( 
                    newRoomID, 
                    { lockID: [currentLockID], nextRoomID: [], availableGauntlets: [] }
                );
                prevRoomID = newRoomID;
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
                    Math .random()*allowedGauntletStarts.length
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

let atlas = new Atlas()
let lockMap = parse.createWarlocks();

console.log(atlas.battleOrder)
atlas.printGauntlets();

