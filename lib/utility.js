import * as parse from './import.js'
import * as calc from './calculations.js'

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
    let myMon = structuredClone( monMap.get( calc.returnIDFromName(name, monMap )));

    myMon.moves[0] = structuredClone( moveMap.get( calc.returnIDFromName('Laze', moveMap )));
    myMon.moves[1] = structuredClone( moveMap.get( calc.returnIDFromName('Show Off', moveMap )));
    
    return myMon;
}

function createTheirMon( name ) {
    let monMap = parse.createMonTable();
    let moveMap = parse.createMoveTable();
    let theirMon = structuredClone( monMap.get( calc.returnIDFromName(name, monMap )));

    theirMon.moves[0] = structuredClone( moveMap.get( calc.returnIDFromName('Lash Out', moveMap )));
    theirMon.moves[1] = structuredClone( moveMap.get( calc.returnIDFromName('Normal Punch', moveMap )));

    return theirMon;
}

export {
    createParty,
    createMyMon,
    createTheirMon
}