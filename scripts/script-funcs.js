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

// TODO: split handleAttack() into functions
function handleAttack( typeTable, myMon, theirMon ) {
    console.log('attack button pressed');
    
    let chosenMoveIndex = document.getElementById( 'selectMoves' ).options.selectedIndex;
    let chosenMove = myMon.moves[ chosenMoveIndex - 1 ];

    if ( chosenMoveIndex == 0 ) {
        console.log('Pick a move before attacking.')
        return;
    }

    if ( myMon.stats.speed >= theirMon.stats.speed ) {
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
        updateShownHP( 'theirMonHP', theirMon )
        util.writeToMessageBox(`You did ${damage} damage using ${chosenMove.name}!`)
        awaitOk( 'test 1');

        let theirChosenMove = util.chooseMove( theirMon );
        damage = calc.calculateDamage({
            attack_stat: theirMon.stats.attack,
            defense_stat: myMon.stats.defense,
            power_stat: theirChosenMove.power,
            type_modifier: calc.calculateTypeModifier
            (
                typeTable,
                chosenMove.type, 
                theirMon.type
            )
        });
        myMon.updateHP( damage )
        updateShownHP ('myMonHP', myMon)
        util.writeToMessageBox(`They did ${damage} damage using ${theirChosenMove.name}!`)
        awaitOk( 'test 2');
    }
    else {
        let theirChosenMove = util.chooseMove( theirMon );
        let damage = calc.calculateDamage({
            attack_stat: theirMon.stats.attack,
            defense_stat: myMon.stats.defense,
            power_stat: theirChosenMove.power,
            type_modifier: calc.calculateTypeModifier
            (
                typeTable,
                chosenMove.type, 
                theirMon.type
            )
        });
        myMon.updateHP( damage );
        updateShownHP ('yourMonHP', myMon);
        util.writeToMessageBox(`They did ${damage} damage using ${theirChosenMove.name}!`);
        awaitOk( 'test 3');

        damage = calc.calculateDamage({
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
        updateShownHP( 'theirMonHP', theirMon );
        util.writeToMessageBox(`You did ${damage} damage using ${chosenMove.name}`);
        awaitOk( 'test 4' );
    }
}

function updateShownHP( ID, mon ) {

    document.getElementById( ID ).innerHTML = mon.returnCurrentHP() + '/' + mon.stats.HP
}

function handleSwitch() {
    console.log('switch button pressed');

    
}

//function handleOk( message ) {
function handleOk() {
    console.log('ok button pressed');


}

//async function awaitOk( message ) {
function awaitOk( message ) {
    // console.log('awaiting')
    // const result = await onOk( message );
    // util.writeToMessageBox( result )
    let buttonPress = false
    let button = document.getElementsByName('ok')[0]
    console.log('awaiting');

    // while ( ! buttonPress ) {
    //     button.onclick = function( buttonPress ) {
    //         buttonPress = true;
    //     }
    // }
    

}

function onOk( message ) {
    console.log('ok button pressed in awaitOk()');

    // let button = document.getElementsByName('ok')[0];
    // button.onclick = function() {
    //     return new Promise((resolve) => {
    //         resolve( message );
    //     })
    // }

    return new Promise((resolve) => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });
}



export {
    populateSelect,
    attachButton,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}