import * as calc from './calculations.js'
import * as parse from './import.js';
import { Daemon } from '../data/class-daemon.js'

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
    document
        .getElementById( ID )
        .innerHTML
        = mon.returnCurrentHP() + '/' + mon.stats.HP + ' hp';
}

function attachButton( doFunction, elementID ) {
    let el = document.getElementsByName( elementID );

    document.addEventListener("DOMContentLoaded", () => {

        //if (el.addEventListener)
            el[0].addEventListener("click", doFunction, false);
        //else if (el.attachEvent)
            //el.attachEvent('onclick', doFunction);
    })
}

function attachButtonId( doFunction, elementId ) {
    let el = document.getElementById( elementId );

    document.addEventListener("DOMContentLoaded", () => {
        el.addEventListener("click", doFunction, false);
    })
}

function checkIfWipe( party ) {
    let isWiped = true;
 
    party.every( mon => {
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

function populateSelect( array = [], selectName, checkForDead = false ) {
    const select = document.getElementById( selectName );
    removeSelectOptions( select );
    array.forEach( mon => {
        if ( mon == null ){
            return;
        }
        let element = document.createElement('option');
        let content = mon.name;

        if ( checkForDead ) {
            if ( checkIfHPZero( mon )) {
                content += ' (dead)';
            }
        }

        element.textContent = content;
        element.value = JSON.stringify(mon); 
        select.appendChild( element );
    });
}

function removeSelectOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for( i = L; i > 0; i-- ) {
        selectElement.remove(i);
    }
}

function setDefaultSelectValue( select, textString ) {
    for (var i=0; i<select.options.length; i++) {
        let option = select.options[i];

        if (option.text == textString) {
           option.setAttribute('selected', true);
           return; 
        } 
    }
}

function checkIfAffectStat( move ) {
    let check = returnStatsAffectedArray( move );

    if ( check ) {
        return true;
    }
    else {
        return false;
    }
}

function disableButton( name ) {
    let element = document.getElementsByName( name )[0];
    element.disabled = true;
}

function enableButton( name ) {
    let element = document.getElementsByName( name )[0];
    element.disabled = false;
}

function checkIfPartyContainsDeadMon( monArray ) {
    let containsDeadFlag = false;

    monArray.forEach( mon => {
        if ( checkIfHPZero( mon )) {
            containsDeadFlag = true;
        }
    });
    return containsDeadFlag;
}

export {
    chooseMove,
    writeToMessageBox,
    updateShownHP,
    attachButton,
    attachButtonId,
    checkIfWipe,
    checkIfHPZero,
    savePostFightParty,
    parseDaemonJSON,
    populateSelect,
    setDefaultSelectValue,
    checkIfAffectStat,
    disableButton,
    enableButton,
    checkIfPartyContainsDeadMon
}