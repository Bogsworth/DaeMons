import * as parse from './import.js'
import * as calc from './calculations.js'
import { Daemon } from '../Data/ClassDaemon.js'

function chooseMove( mon ) {
    let totalMovesKnown = mon.returnTotalMovesKnown()
    let chosenMoveIndex = calc.getRandomInt( totalMovesKnown );

    return mon.moves[ chosenMoveIndex ];
}

function writeToMessageBox( message ) {
    console.log(message);
    
    document
        .getElementById('messageBox')
        .textContent = message;
    return;
}

function updateShownHP( ID, mon ) {
    document.getElementById( ID ).innerHTML = mon.returnCurrentHP() + '/' + mon.stats.HP
}

function checkIfEnemyWipe( theirParty ) {
    let isWiped = true;
 
    theirParty.every( mon => {
        if ( mon.returnCurrentHP() > 0 ) {
            isWiped = false;
        }
        return isWiped;
    })

    return isWiped;
}

// TODO: this could be cleaner
function checkIfHPZero( yourMon, theirMon = false ) {
    if ( theirMon == false ) {
        if ( yourMon.returnCurrentHP() <= 0 ) {
            return true;
        }
        return false;
    }
    if (
        yourMon.returnCurrentHP() <= 0  ||
        theirMon.returnCurrentHP() <= 0
    ) {
        return true;
    }
    else {
        return false;
    }
}

function savePostFightParty( party ) {
    const PARTY_STR = JSON.stringify( party );
    sessionStorage.currentParty = PARTY_STR;
}

function parseDaemonJSON( JSONData ) {
    let dataArray = [];
    JSONData.forEach( mon => {
        let tempMon = new Daemon;
        
        tempMon.copyFromData( JSON.stringify(mon) );
        dataArray.push(tempMon);
    });

    return dataArray;
}

export {
    chooseMove,
    writeToMessageBox,
    updateShownHP,
    checkIfEnemyWipe,
    checkIfHPZero,
    savePostFightParty,
    parseDaemonJSON
}