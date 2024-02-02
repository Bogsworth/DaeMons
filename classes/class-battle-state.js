import * as parse from '../lib/Import.js'
import { Party } from './class-party.js'
import { Warlock } from './class-warlock.js'
import { Daemon } from './class-daemon.js'

class BattleState {
    constructor(enemyLock = new Warlock()) {
        
        this.playerParty = this.partyLoader(sessionStorage.currentParty);
        this.enemyLock = enemyLock;
        this.TYPE_TABLE = parse.createCounterTable();

    }

    partyLoader(storage) {


        let parsedStorage = JSON.parse(storage);
        // console.log(sessionStorage.currentParty);
        // console.log(parsedStorage);

        let partyArray = [];
        
        parsedStorage.forEach(daemon => {
            let newMon = new Daemon();

            newMon.copyFromData(JSON.stringify(daemon));
            partyArray.push(newMon);
        })
        return new Party(partyArray);
    }


}

export { BattleState }