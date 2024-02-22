import * as util from '../lib/utility.js';
import { Party } from './class-party.js';
import { StorageHandler } from './class-storage-handler.js';
import { Warlock } from './class-warlock.js';
import { Daemon } from './class-daemon.js';

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
        this.allHeldMons = this.allHeldMonsLoader(sessionStorage.allHeldMons);
    }

    returnNextRoomsArray() {
        return this.atlas
            .battleOrder
            .get( sessionStorage.previousRoomID )
            .nextRoomID;
    }

    partyLoader(storage) {
        const PARSED_STORAGE = JSON.parse( storage );
        let playerParty = new Party( PARSED_STORAGE );

        return playerParty;
    }

    allHeldMonsLoader( storage ) {
        if ( storage === undefined ) {
            // .map( member => member ) is required or else billsPC ends up pointint at party,
            // not copying into its own instance
            return this.currentParty.returnMembers().map( member => member );
        }

        let billsPC;
        const PARSED_STORAGE = JSON.parse( storage );
    
        if ( ! (PARSED_STORAGE.length === 0 || PARSED_STORAGE === undefined )) {
            billsPC = PARSED_STORAGE
                .map( daemonData => new Daemon( daemonData ))
                .concat(this.currentParty.members);
        }

        return billsPC;
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
