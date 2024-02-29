import { Atlas } from "./class-atlas.js";
import { BattleState } from "./class-battle-state.js";
import { Warlock } from "./class-warlock.js";
import { Party } from "./class-party.js";

class StorageHandler {
    constructor( battleState = {} ) {
        this._battleState = battleState;
        this._UIHandler;

        this._initialSessionStorage = sessionStorage;
        this._homeScreenLocation = '../../../index.html';
        this._interludeLocation = '../interlude/interlude.html';
        this._battleLocation = '../battle/battle.html';
        
        // this.endFight();
    }

    get battleState() { return this._battleState; }
    get UIHandler() { return this._UIHandler; }
    get initialSessionStorage() { return this._initialSessionStorage; }
    get homeScreenLocation() { return this._homeScreenLocation; }
    get interludeLocation() { return this._interludeLocation; }
    get battleLocation() { return this._battleLocation; }

    set battleState( newState ) { this._battleState = newState; }
    set UIHandler( handler ) { this._UIHandler = handler; }

    endFight() {
        this.savePostFightData();
        //return;
        window.location.href = this.interludeLocation;
    }

    startFight() {
        const PARTY = this.UIHandler.selectedParty;
        let isADeadMonInParty = ! PARTY.members.every( daemon => ! daemon.isDead );

        if ( isADeadMonInParty ) {
            const CONFIRMATION_MSG = 'You are bringing a dead Daemon with you, are you sure you want to do that?';
            
            if ( ! confirm( CONFIRMATION_MSG )) {
                return;
            }
        } 

        this.savePostInterludeData();
        // return;
        window.location.href = this.battleLocation;
    }

    savePostFightData() {
        console.log(this.battleState);
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
        const PREVIOUS_ROOM = this.battleState.atlas.battleOrder.get( PREVIOUS_ROOM_ID );
        
        sessionStorage.currentRoomID = PREVIOUS_ROOM.nextRoomID[0];
    }

    savePostInterludeParty() {
        const PARTY = this.UIHandler.returnSelectedParty();

        console.log(PARTY);
        sessionStorage.currentParty = JSON.stringify( PARTY );
    }

    savePostInterludeBillsPC() {
        const PARTY = this.UIHandler.returnSelectedParty().members;
        const UUIDs = PARTY.map( daemon => daemon.uuid )
        const BILLS_PC = this.battleState.allHeldMons
            .filter( daemon => ! UUIDs.includes( daemon.uuid ));
    
        console.log(BILLS_PC);
        sessionStorage.allHeldMons = JSON.stringify(BILLS_PC);
    }

    restoreAtlas() {
        let atlasInfoString = this.initialSessionStorage.atlas;
        const DEFAULT_ATLAS = new Atlas( [ 1,2 ] );
        let isNoSavedAtlas = ( atlasInfoString === undefined );

        if ( isNoSavedAtlas ) {
            this.saveAtlas( DEFAULT_ATLAS );
            return DEFAULT_ATLAS;
        }
       
        return new Atlas(JSON.parse(atlasInfoString, reviver));

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

    loadRoom() {
        const INIT_ROOM = 'roomID000';
        const ATLAS = this.restoreAtlas();
        let roomID = this.initialSessionStorage.currentRoomID;

        if ( roomID == undefined ) {
            roomID = INIT_ROOM;
            sessionStorage.previousRoomID = roomID;
        }
        
        const ROOM_WARLOCK = new Warlock( ATLAS.battleOrder.get( roomID ).lock );

        return new BattleState( ROOM_WARLOCK );
    }

    savePostFightParty() {
        const PARTY = this.battleState.playerParty;

        sessionStorage.currentParty = JSON.stringify(PARTY);
    }

    getReward() {
        // sessionStorage.newReward = JSON.stringify(fightState.enemyLock.reward);
    }
    
    getNextChallenger() {
        const NEXT_LOCK = this.battleState.atlas

        // sessionStorage.nextLockName = JSON.stringify(fightState.enemyLock.nextFight)
    }
    
    endGame() {
        sessionStorage.clear();
        window.location.href = this.homeScreenLocation;
    }
}

export { StorageHandler }