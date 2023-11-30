import * as parse from './import.js'
import * as calc from './calculations.js'
import { Daemon } from '../Data/ClassDaemon.js'

function createParty( array = [] ) {
    let party = [];
    // Input is an array of strings corresponding to Daemon names
    
    array.forEach( mon => {
        party.push(createMyMon( mon ));
    })

    return party;
}

function createMyMon( name ) {
    let monMap = parse.createMonTable();
    let moveMap = parse.createMoveTable();
    let myMon = new Daemon();

    myMon.copyMon(monMap.get( calc.returnIDFromName( name, monMap )));

    myMon.moves[0] = structuredClone( moveMap.get( calc.returnIDFromName('Laze', moveMap )));
    myMon.moves[1] = structuredClone( moveMap.get( calc.returnIDFromName('Show Off', moveMap )));
    
    return myMon;
}

function createTheirMon( name ) {
    let monMap = parse.createMonTable();
    let moveMap = parse.createMoveTable();
    let theirMon = new Daemon();

    theirMon.copyMon(monMap.get( calc.returnIDFromName( name, monMap )));

    theirMon.moves[0] = structuredClone( moveMap.get( calc.returnIDFromName('Lash Out', moveMap )));
    theirMon.moves[1] = structuredClone( moveMap.get( calc.returnIDFromName('Normal Punch', moveMap )));

    return theirMon;
}

function chooseMove( mon ) {
   let i = 0;
    mon.moves.forEach( move => {
        if ( move != null ) {
            i++;
        }
    })
    let chosenMoveIndex = calc.getRandomInt( i );

    return mon.moves[ chosenMoveIndex ]
}

function writeToMessageBox( message ) {
    let messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    console.log(message);
    return;
}

function updateShownHP( ID, mon ) {
    document.getElementById( ID ).innerHTML = mon.returnCurrentHP() + '/' + mon.stats.HP
}

function checkIfHPZero( yourMon, theirMon ) {
    if (
        yourMon.returnCurrentHP() <= 0  ||
        theirMon.returnCurrentHP() <=0
    ) {
        return true;
    }
    else {
        return false;
    }
}

export {
    createParty,
    createMyMon,
    createTheirMon,
    chooseMove,
    writeToMessageBox,
    updateShownHP,
    checkIfHPZero
}