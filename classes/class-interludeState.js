import { StorageHandler } from './class-storage-handler.js';
import { Warlock } from './class-warlock.js';
import { Daemon } from './class-daemon.js';

class InterludeState {
    constructor ( atlas ) {
        this._storage = new StorageHandler();
        this._atlas = atlas;
        this._currentParty = this._storage.loadParty();
        this._nextRoomsArray = this._nextRoomArrayGetter();
        this._nextLock = this._enemyLockLoader();
        this._allHeldMons = this._allHeldMonsLoader();
        this._isGameOver = false;

        this._initInterlude();
    }

    get atlas() { return this._atlas; }
    get currentParty() { return this._currentParty; }
    get nextRoomsArray() { return this._nextRoomsArray; }
    get nextlock() { return this._nextLock; }
    get nextLockName() { return this._nextLock.name; }
    get allHeldMons() { return this._allHeldMons; }

    get nextRooms() { return this._nextRoomsArray; }
    get isGameOver() { return this._isGameOver; }

    //#region "Private" functions
    _initInterlude() {
        this._checkIfAtEnd();
    }

    _checkIfAtEnd() {
        // If the nextRoomsArray is empty, there are no more rooms
        // Therefore we are at the end
        if ( this._nextRoomsArray.length === 0 ) {
            this._isGameOver = true;
        }
    }

    // TODO: handle multiple possible next rooms
    _enemyLockLoader() {
        let lockConstructor;

        try {
            lockConstructor = this._atlas.battleOrder
                .get( this._nextRoomsArray[0] ).lock;
        } catch ( error ) {
            if ( this._nextRoomsArray.length === 0 ) {
                console.log('nextRoom is empty array, we should be at end game');
            }
            else {
                console.log('idk why _enemyLockLoader() failed');
            }
        }
        
        // return nextLock;
        return new Warlock( lockConstructor );
    }

    _allHeldMonsLoader() {
        let storage = this._storage.allHeldMons;
        // .map( member => member ) is required or else billsPC ends up pointing
        // at party, not copying into its own instance
        let billsPC = this._currentParty.returnMembers().map( member => member );
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
                .concat(this._currentParty.members);
        }
        console.log(billsPC);
        return billsPC;
    }

    _nextRoomArrayGetter() {      
        let previousRoomID = this._storage.previousRoomID;

        const NEXT_ROOM_ARRAY = this._atlas
            .battleOrder
            .get( previousRoomID )
            .nextRoomID;
        return NEXT_ROOM_ARRAY;
    }
    //#endregion

    //#region "Public" functions
    healParty() {
        let members = this._currentParty.members;

        members
            .filter( daemon => daemon.isAlive )
            .forEach( daemon => daemon.restoreHP() );
    }

    restorePartyMoves() {
        let members = this._currentParty.members;

        members.forEach( daemon => daemon.restoreAllMoveUses() )
    }
    //#endregion
};

export { InterludeState }
