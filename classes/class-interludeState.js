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

        let warlockConstructor = this.enemyLockLoader();
        this.nextLock = new Warlock( warlockConstructor );
        this.nextLockName = this.nextLock.name;
        
        this.newReward = '';
        this.allHeldMons = this.allHeldMonsLoader( sessionStorage.allHeldMons );
        this._isGameOver = false;

        this.initInterlude();
    }

    get nextRooms() { return this.nextRoomArrayGetter(); }
    get isGameOver() { return this._isGameOver; }

    set isGameOver( isItOver ) { this._isGameOver = isItOver; }

    initInterlude() {
        this.checkIfAtEnd();
    }

    checkIfAtEnd() {
        // If the nextRoomsArray is empty, there are no more rooms
        // Therefore we are at the end
        if ( this.nextRoomsArray.length === 0 ) {
            this.isGameOver = true;
        }
    }

    // TODO: handle multiple possible next rooms
    enemyLockLoader() {
        let nextLock;

        try {
            nextLock = this.atlas.battleOrder
                .get( this.nextRoomsArray[0] ).lock;
        } catch ( error ) {
            if ( this.nextRoomsArray.length === 0 ) {
                console.log('nextRoom is empty array, we should be at end game');
            }
            else {
                console.log('idk why enemyLockLoader() failed');
            }
        }
        
        return nextLock;
    }

    partyLoader( storage ) {
        const PARSED_STORAGE = JSON.parse( storage );
        let playerParty = new Party( PARSED_STORAGE );

        return playerParty;
    }

    allHeldMonsLoader( storage ) {
        // .map( member => member ) is required or else billsPC ends up pointing
        // at party, not copying into its own instance
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
            .filter( daemon => daemon.isAlive )
            .forEach( daemon => daemon.restoreHP() );
    }

    restorePartyMoves() {
        let members = this.currentParty.members;

        members.forEach( daemon => daemon.restoreAllMoveUses() )
    }

    nextRoomArrayGetter() {
        if ( sessionStorage.previousRoomID === "undefined" ) {
            sessionStorage.previousRoomID = 'roomID000';
        }

        const NEXT_ROOM_ARRAY = this.atlas
            .battleOrder
            .get( sessionStorage.previousRoomID )
            .nextRoomID;

        return NEXT_ROOM_ARRAY;
    }

};

export { InterludeState }
