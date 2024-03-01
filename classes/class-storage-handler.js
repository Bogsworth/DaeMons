import { Atlas } from "./class-atlas.js";
import { Warlock } from "./class-warlock.js";
import { Daemon } from "./class-daemon.js";
import { Move } from "./class-move.js";

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
    get isGameOver() { return this._state.isGameOver; }

    set state( newState ) { this._state = newState; }
    set UIHandler( handler ) { this._UIHandler = handler; }

    checkIfEndGame() {
        if ( ! this.isGameOver ) {
            return;
        }

        const END_GAME_MSG = "Congratulations! You've beaten the game!\n" + 
            "Would you like to play again?\n" +
            "Please pretend this says 'Yes' and 'No'";
        
        if ( confirm( END_GAME_MSG ) ) {
            this.endGame();
        }
        else {
            console.log( 'Somehow quit program' );
            // TODO: Quit program
        }
    }

    endFight() {
        this.savePostFightData();
        // Uncomment and recomment to pause stay on screen
        // return;
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
        // Uncomment and recomment to pause stay on screen
        // return;
        window.location.href = this.battlePage;
    }

    savePostFightData() {
        console.log(this.state);
        this.savePostFightParty();
        this.saveReward();
        this.iterateRoom();
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

    saveReward() {
        const REWARD_OBJECT = this._state.enemyLock.reward;
        const REWARD_TYPE = this._state.enemyLock.rawRewardData.type;
        const TO_SAVE = {
            data: REWARD_OBJECT,
            type: REWARD_TYPE
        };
        
        sessionStorage.newReward = JSON.stringify( TO_SAVE );
    }

    loadReward() {
        const REWARD_DATA = JSON.parse( this._initialSessionStorage.newReward );
        
        if ( REWARD_DATA.type === 'Daemon' ) {
            const REWARD = new Daemon( REWARD_DATA.data );

            this._state.allHeldMons.push( REWARD );
            return
        }

        if ( REWARD_DATA.type === 'Move' ) {
            const REWARD = new Move( REWARD_DATA.data );

            // TODO: Handle a move as a reward
            console.log( 'idk how to handle this yet...' );
            return;
        }
    }
    
    iterateRoom() {
        sessionStorage.previousRoomID = sessionStorage.currentRoomID;
    }
    
    endGame() {
        sessionStorage.clear();
        window.location.href = this.homePage;
    }
}

export { StorageHandler }