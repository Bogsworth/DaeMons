import { Atlas } from "./class-atlas.js";
import { BattleState } from "./class-battle-state.js";
import { Warlock } from "./class-warlock.js";

class StorageHandler {
    constructor(battleState = {}) {
        this.battleState = battleState;

        this.initialSessionStorage = sessionStorage;
        this.homeScreenLocation = '../../../index.html'
        this.interludeLocation = '../interlude/interlude.html'

        // this.endFight();
    }

    endFight() {
        console.log(this.battleState)
        this.savePostFightParty()
        this.getReward();
        this.getNextChallenger();

        // return;
        window.location.href = this.interludeLocation;
    }

    restoreAtlas() {
        let atlasInfoString = this.initialSessionStorage.atlas;

        if ( atlasInfoString == undefined ) {
            let newAtlas = new Atlas([1,2]);
            this.saveAtlas( newAtlas );
            return newAtlas
        }

        return new Atlas(JSON.parse(atlasInfoString, reviver));

        function reviver(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (value.dataType === 'Map') {
                    return new Map(value.value);
                }
            }
            return value;
        }
    }

    saveAtlas(atlas) {
        sessionStorage.atlas = JSON.stringify(atlas, replacer);

        function replacer(key, value) {
            if ( ! ( value instanceof Map )) {
                return value;
            }
            return {
                dataType: 'Map',
                value: [...value]
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
        const ROOM_WARLOCK = new Warlock( ATLAS.battleOrder.get(roomID).lock );
        
        return new BattleState( ROOM_WARLOCK );
    }

    savePostFightParty() {
        const PARTY = this.battleState.playerParty;

        sessionStorage.currentParty = JSON.stringify(PARTY);
    }
    
    getNextChallenger() {
        const NEXT_LOCK = this.battleState.atlas

        // sessionStorage.nextLockName = JSON.stringify(fightState.enemyLock.nextFight)
    }
    
    getReward() {
        // sessionStorage.newReward = JSON.stringify(fightState.enemyLock.reward);
    }
    
    endGame() {
        sessionStorage.clear();
        window.location.href = this.homeScreenLocation;
    }

        // createPartyFromStarter( daemon ) {
    //     console.log('Im trying to create a party')
    // }

    // copyFromAtlasString(JSONString) {
    //     let myMap = new Map(Object.entries(JSON.parse(JSONString)));
    //     console.dir(myMap, {depth: null})

    // }
}

export { StorageHandler }