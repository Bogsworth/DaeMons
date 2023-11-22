//import { move } from 'fs-extra';

import * as util from '../lib/calculations.js'
import * as parse from '../lib/import.js'
import * as script from './scripts.js'

function populateSelect( array = [], selectName ) {
    const select = document.getElementById( selectName )
    
    array.forEach( mon => {
        if ( mon == null ){
            return;
        }

        let element = document.createElement('option');
        element.textContent = mon.name;
        element.value = mon;
        select.appendChild( element );
    })
}

function createMyMon() {
    let monMap = parse.createMonTable();
    let moveMap = parse.createMoveTable();
    let myMon = structuredClone( monMap.get( util.returnIDFromName('Fuckboy', monMap )));

    myMon.moves[0] = structuredClone( moveMap.get( util.returnIDFromName('Laze', moveMap )));
    myMon.moves[1] = structuredClone( moveMap.get( util.returnIDFromName('Show Off', moveMap )));
    
    return myMon;
}

function createTheirMon() {
    let monMap = parse.createMonTable();
    let moveMap = parse.createMoveTable();
    let theirMon = structuredClone( monMap.get( util.returnIDFromName('Damned', monMap )));

    theirMon.moves[0] = structuredClone( moveMap.get( util.returnIDFromName('Lash Out', moveMap )));
    theirMon.moves[1] = structuredClone( moveMap.get( util.returnIDFromName('Normal Punch', moveMap )));

    return theirMon;
}


let handleAttack = function() {
    console.log('attack button pressed')
}

let handleSwitch = function() {
    console.log('switch button pressed')
}

let handleOk = function() {
    console.log('ok button pressed');
}

let myMon = [ createMyMon(), createMyMon() ]
let theirMon = createTheirMon();



populateSelect(myMon[0].moves, 'selectMoves');
populateSelect(myMon, 'selectMons');

script.attachButton( handleAttack , 'attack' )
script.attachButton( handleSwitch , 'switch' )
script.attachButton( handleOk, 'ok' )


