//import { move } from 'fs-extra';

import * as util from '../lib/Calculations.js'
import * as parse from '../lib/Import.js'

function populateMoveSelect( moveArray = []) {
    const select = document.getElementById('selectMoves')
    
    moveArray.forEach( move => {
        if ( move == null ){
            return;
        }

        let element = document.createElement('option');
        element.textContent = move.name;
        element.value = move;
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


let myMon = createMyMon();
let theirMon = createTheirMon();

populateMoveSelect(myMon.moves);
