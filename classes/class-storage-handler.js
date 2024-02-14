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
        // this.battleState.playerParty.savePostFightParty();
        //util.savePostFightParty( fightState.myParty );
        this.getReward();
        this.getNextChallenger();
        console.log(sessionStorage);
        console.log('and parsed:')
        console.log(JSON.parse(sessionStorage.currentParty));
        // return;
        window.location.href = this.interludeLocation;
    }

    restoreAtlas() {
        let atlasInfoString = this.initialSessionStorage.atlas;
        console.log(atlasInfoString)

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

    createPartyFromStarter( daemon ) {
        console.log('Im trying to create a party')
    }

    copyFromAtlasString(JSONString) {
        let myMap = new Map(Object.entries(JSON.parse(JSONString)));
        console.dir(myMap, {depth: null})

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
        let roomID = this.initialSessionStorage.currentRoomID;
        let atlas = this.restoreAtlas();

        if ( roomID == undefined ) {
            roomID = INIT_ROOM;
        }
        const ROOM_WARLOCK = new Warlock( atlas.battleOrder.get(roomID).lock );
        
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
}

export { StorageHandler }