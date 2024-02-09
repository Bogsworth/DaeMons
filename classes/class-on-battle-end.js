import { Atlas } from "./class-atlas.js";
import { BattleState } from "./class-battle-state.js";

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
        return;
        window.location.href = this.interludeLocation;
    }

    restoreAtlas() {
        let atlasInfoString = this.initialSessionStorage.atlas;

        if ( atlasInfoString == undefined ) {
            let newAtlas = new Atlas([1,2]);
            this.saveAtlas( newAtlas );
            return newAtlas
        }

        console.log(sessionStorage)
        console.dir(atlasInfoString, {depth: null})

        this.copyFromAtlasString(atlasInfoString)

        return new Atlas(JSON.parse(atlasInfoString));
    }

    copyFromAtlasString(JSONString) {
        let myMap = new Map(Object.entries(JSON.parse(JSONString)));
        console.dir(myMap, {depth: null})

    }

    saveAtlas(atlas) {
        sessionStorage.atlas = JSON.stringify(atlas);
    }

    loadRoom() {
        let roomID = this.initialSessionStorage.currentRoomID;
        let atlas = this.restoreAtlas();

        if ( roomID == undefined ) {
            return new BattleState( atlas.battleOrder.get('roomID000').lock)
        }
        
        return  new BattleState( sessionStorage.currentRoomID )
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