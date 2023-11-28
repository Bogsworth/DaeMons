import * as calc from '../lib/calculations.js';
import * as parse from '../lib/import.js';
import * as util from '../lib/utility.js';

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

function attachButton( doFunction, elementID ) {
    let el = document.getElementsByName( elementID );

    document.addEventListener("DOMContentLoaded", () => {

        //if (el.addEventListener)
        el[0].addEventListener("click", doFunction, false);
        //else if (el.attachEvent)
            //el.attachEvent('onclick', doFunction);
    })
}


function updateMon( mon, isYourMon = true) {
    let ID = {
        name: 'theirMon',
        HP: 'theirMonHP'
    }
    
    if ( isYourMon == true ) {
        ID.name = 'yourMon';
        ID.HP = 'yourMonHP';
    }

    document.getElementById(ID.name).innerHTML = mon.name
    document.getElementById(ID.HP).innerHTML = mon.stats.HP + '/' + mon.stats.HP
}

function handleAttack( typeTable, myMon, theirMon ) {
    console.log('attack button pressed');
    
    let chosenMoveIndex = document.getElementById( 'selectMoves' ).options.selectedIndex;
    let chosenMove = myMon.moves[ chosenMoveIndex - 1 ];

    if ( chosenMoveIndex == 0 ) {
        console.log('Pick a move before attacking.')
        return;
    }

    let waitForPressResolve;
    const btn = document.getElementsByName('ok')[0];

    roundRunner();

    function waitForPress() {
        return new Promise(resolve => waitForPressResolve = resolve);
    }

    function btnResolver() {
        if (waitForPressResolve) {
            waitForPressResolve();
        }
    }

    // TODO: detach attack and switch buttons to prevent doing extra attacks
    async function roundRunner() {
        btn.addEventListener( 'click', btnResolver );
        
        round: if ( myMon.stats.speed >= theirMon.stats.speed ) {
            yourMove( typeTable, myMon, theirMon, chosenMove );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
            theirMove( typeTable, myMon, theirMon );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
        }
        else {
            theirMove( typeTable, myMon, theirMon );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
            yourMove( typeTable, myMon, theirMon, chosenMove );
            await waitForPress();
            if ( util.checkIfHPZero (myMon, theirMon )) {
                break round;
            }
        }

        if ( util.checkIfHPZero( myMon, theirMon )) {
            if ( myMon.returnCurrentHP() <= 0 )
            {
                util.writeToMessageBox( 'Your dude has died, RIP');
                await waitForPress();
            }
            else {
                util.writeToMessageBox( 'Their dude has died, hell yeah!');
                await waitForPress();
            }
        }

        // Cleanup
        btn.removeEventListener( 'click', btnResolver );
        util.writeToMessageBox( 'What do you want to do?' );
    }
}

// function handleDaemonZeroHP( myMon, theirMon ) {
//     if ( myMon.returCurrentHP() <= 0 )
//     {
//         util.writeToMessageBox( 'Your dude has died, RIP');
//         await waitForPress();
//     }
//     else {
//         util.writeToMessageBox( 'Their dude has died, hell yeah!');
//         await waitForPress();
//     }
// }

function yourMove( typeTable, myMon, theirMon, chosenMove ) {
    let damage = calc.calculateDamage({
        attack_stat: myMon.stats.attack,
        defense_stat: theirMon.stats.defense,
        power_stat: chosenMove.power,
        type_modifier: calc.calculateTypeModifier
        (
            typeTable,
            chosenMove.type, 
            theirMon.type
        )
    });

    theirMon.updateHP( damage );
    util.updateShownHP( 'theirMonHP', theirMon )
    util.writeToMessageBox(`You did ${damage} damage using ${chosenMove.name}!`)
}

function theirMove(typeTable, myMon, theirMon) {
    let theirChosenMove = util.chooseMove( theirMon );
    let damage = calc.calculateDamage({
        attack_stat: theirMon.stats.attack,
        defense_stat: myMon.stats.defense,
        power_stat: theirChosenMove.power,
        type_modifier: calc.calculateTypeModifier
        (
            typeTable,
            theirChosenMove.type, 
            theirMon.type
        )
    });
    
    myMon.updateHP( damage )
    util.updateShownHP ('yourMonHP', myMon)
    util.writeToMessageBox(`They did ${damage} damage using ${theirChosenMove.name}!`)
}

function handleSwitch() {
    console.log('switch button pressed');

}

function handleOk() {
    console.log('ok button pressed');
}

export {
    populateSelect,
    attachButton,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}