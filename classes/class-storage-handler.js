import { Atlas } from "./class-atlas.js";
import { BattleState } from "./class-battle-state.js";
import { Warlock } from "./class-warlock.js";
import { Party } from "./class-party.js";

class StorageHandler {
    constructor( currentState = {} ) {
        this._state = currentState;
        this._UIHandler;
        this._initialSessionStorage = sessionStorage;
        this._locations = {
            homePage: '../../../index.html',
            interludePage: '../interlude/interlude.html',
            battlePage: '../battle/battle.html'
        }
    }

    get state() { return this._state; }
    get UIHandler() { return this._UIHandler; }
    get initialSessionStorage() { return this._initialSessionStorage; }
    get homePage() { return this._locations.homePage; }
    get interludePage() { return this._locations.interludePage; }
    get battlePage() { return this._locations.battlePage; }
    get chosenParty() { return this.UIHandler.selectedParty; }

    set state( newState ) { this._state = newState; }
    set UIHandler( handler ) { this._UIHandler = handler; }

    endFight() {
        this.savePostFightData();
        //return;
        window.location.href = this.interludePage;
    }

    startFight() {
        const PARTY = this.chosenParty;
        let isADeadMonInParty = ! PARTY.members.every( daemon => ! daemon.isDead );

        if ( isADeadMonInParty ) {
            const CONFIRMATION_MSG = 'You are bringing a dead Daemon with you, are you sure you want to do that?';
            
            if ( ! confirm( CONFIRMATION_MSG )) {
                return;
            }
        } 

        this.savePostInterludeData();
        // return;
        window.location.href = this.battlePage;
    }

    savePostFightData() {
        console.log(this.state);
        this.savePostFightParty();
        this.getReward();
        this.getNextChallenger();
    }

    savePostInterludeData() {
        this.savePostInterludeParty();
        this.savePostInterludeBillsPC();
        this.saveNextRoomID();
    }
    
    saveNextRoomID() {
        const PREVIOUS_ROOM_ID = this.initialSessionStorage.previousRoomID;
        const PREVIOUS_ROOM = this.state.atlas.battleOrder.get( PREVIOUS_ROOM_ID );
        
        sessionStorage.currentRoomID = PREVIOUS_ROOM.nextRoomID[0];
    }

    savePostInterludeParty() {
        const PARTY = this.chosenParty;

        console.log(PARTY);
        sessionStorage.currentParty = JSON.stringify( PARTY );
    }

    savePostInterludeBillsPC() {
        const PARTY = this.chosenParty.members;
        const UUIDs = PARTY.map( daemon => daemon.uuid )
        const BILLS_PC = this.state.allHeldMons
            .filter( daemon => ! UUIDs.includes( daemon.uuid ));
    
        console.log( BILLS_PC );
        sessionStorage.allHeldMons = JSON.stringify( BILLS_PC );
    }

    getAtlasBuilder() {
        const DEFAULT_ATLAS = new Atlas([ 1, 2 ]);
        let atlasInfoString = this.initialSessionStorage.atlas;
        let isNoSavedAtlas = ( atlasInfoString === undefined );

        if ( isNoSavedAtlas ) {
            this.saveAtlas( DEFAULT_ATLAS );
            return DEFAULT_ATLAS;
        }

        const ATLAS_BUILDER = JSON.parse( atlasInfoString, reviver );
        return ATLAS_BUILDER;
       
        // return new Atlas( JSON.parse( atlasInfoString, reviver ));

        function reviver( key, value ) {
            if ( typeof value === 'object' && value !== null ) {
                if ( value.dataType === 'Map' ) {
                    return new Map( value.value );
                }
            }
            return value;
        }
    }

    saveAtlas( atlas ) {
        sessionStorage.atlas = JSON.stringify( atlas, replacer );

        function replacer( key, value ) {
            if ( ! ( value instanceof Map )) {
                return value;
            }
            return {
                dataType: 'Map',
                value: [ ...value ]
            };
        }
    }

    getRoomWarlock() {
        const INIT_ROOM = 'roomID000';
        const ATLAS = new Atlas( this.getAtlasBuilder() );
        let roomID = this.initialSessionStorage.currentRoomID;

        if ( roomID == undefined ) {
            roomID = INIT_ROOM;
            sessionStorage.previousRoomID = roomID;
        }
        
        const ROOM_WARLOCK = new Warlock( ATLAS.battleOrder.get( roomID ).lock );

        return ROOM_WARLOCK;
    }

    savePostFightParty() {
        const PARTY = this.state.playerParty;

        sessionStorage.currentParty = JSON.stringify(PARTY);
    }

    getReward() {
        // sessionStorage.newReward = JSON.stringify(fightState.enemyLock.reward);
    }
    
    getNextChallenger() {
        const NEXT_LOCK = this.state.atlas

        // sessionStorage.nextLockName = JSON.stringify(fightState.enemyLock.nextFight)
    }
    
    endGame() {
        sessionStorage.clear();
        window.location.href = this.homePage;
    }
}

export { StorageHandler }