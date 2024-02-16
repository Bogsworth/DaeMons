import * as util from '../lib/utility.js';
import { Party } from './class-party.js';
import { StorageHandler } from './class-storage-handler.js';
import { Warlock } from './class-warlock.js';

class InterludeState {
    constructor ( atlas, builder = {
        'newReward': '""',
        'allHeldMons': '""',
        'nextLock': '""',
        'nextLockName': '""'

    }) {
        for (let [key, val] of Object.entries(builder)) {
            if (val == undefined ) {
                builder[key] = '""';
            }
        }
        this.atlas = atlas;
        this.currentParty = this.partyLoader( sessionStorage.currentParty );
        this.nextRoomsArray = this.returnNextRoomsArray();

        // TODO: handle multiple possible next rooms
        this.nextLock = new Warlock(atlas.battleOrder.get(this.nextRoomsArray[0]).lock)
        this.nextLockName = this.nextLock.returnName();
        
        this.newReward = '';

        if (builder['allHeldMons'] == '""') {
            this.allHeldMons = Object.assign( [], this.currentParty)
        }
        else {
            this.allHeldMons = util.parseDaemonJSON (
                JSON.parse(builder['allHeldMons'])
            );
        }
    }

    returnNextRoomsArray() {
        return this.atlas
            .battleOrder
            .get( sessionStorage.previousRoomID )
            .nextRoomID;
    }

    partyLoader(storage) {
        const PARSED_STORAGE = JSON.parse(storage);
        let playerParty = new Party( PARSED_STORAGE );

        return playerParty;
    }

    updateParam( data, param ) {
        this[param] = data;

        if (typeof(data) == 'object' ) {
            sessionStorage[param] = JSON.stringify( this[param] );
        }
        else {
            sessionStorage[param] = this[param];
        }
    }

    healParty() {
        let members = this.currentParty.members;

        members
            .filter( daemon => daemon.currentHP > 0 )
            .forEach( daemon => daemon.restoreHP());
    }

    restorePartyMoves() {
        let members = this.currentParty.members;

        members.forEach( daemon => daemon.restoreAllMoveUses() )
    }

};

export {
    InterludeState
}
