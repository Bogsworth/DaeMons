import * as util from '../lib/utility.js';
import { Party } from './class-party.js';
import { StorageHandler } from './class-storage-handler.js';
import { Warlock } from './class-warlock.js';
import { Daemon } from './class-daemon.js';

class InterludeState {
    constructor ( atlas ) {
        this.atlas = atlas;
        this.currentParty = this.partyLoader( sessionStorage.currentParty );
        this.nextRoomsArray = this.nextRooms;

        // TODO: handle multiple possible next rooms
        let warlockConstructor = atlas.battleOrder.get( this.nextRoomsArray[0] ).lock;
        this.nextLock = new Warlock( warlockConstructor )
        this.nextLockName = this.nextLock.returnName();
        
        this.newReward = '';
        this.allHeldMons = this.allHeldMonsLoader( sessionStorage.allHeldMons );
    }

    get nextRooms() {
        return this.atlas
            .battleOrder
            .get( sessionStorage.previousRoomID )
            .nextRoomID;
    }

    partyLoader( storage ) {
        const PARSED_STORAGE = JSON.parse( storage );
        let playerParty = new Party( PARSED_STORAGE );

        return playerParty;
    }

    allHeldMonsLoader( storage ) {
        // .map( member => member ) is required or else billsPC ends up pointint at party,
        // not copying into its own instance
        let billsPC = this.currentParty.returnMembers().map( member => member );
        let parsedStorage = undefined;

        try { 
            parsedStorage = JSON.parse( storage ); 
        } catch( error ) {
            console.log('storage not parseable as JSON') ;
            return billsPC;
        } 
        if ( ! ( parsedStorage.length === 0 || parsedStorage === undefined )) {
            billsPC = parsedStorage
                .map( daemonData => new Daemon( daemonData ))
                .concat(this.currentParty.members);
        }
        console.log(billsPC);
        return billsPC;
    }

    healParty() {
        let members = this.currentParty.members;

        members
            .filter( daemon => daemon.currentHP > 0 )
            .forEach( daemon => daemon.restoreHP() );
    }

    restorePartyMoves() {
        let members = this.currentParty.members;

        members.forEach( daemon => daemon.restoreAllMoveUses() )
    }

};

export {
    InterludeState
}
