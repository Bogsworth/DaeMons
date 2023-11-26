import * as calc from '../lib/calculations.js';

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


let handleAttack = function() {
//let handleAttack = function( typeTable, myMon, theirMon ) {
    console.log('attack button pressed');
    // let chosenMove = document.getElementById( 'selectMoves' ).options.selectedIndex;

    // console.log(chosenMove)

    // if ( chosenMove == 'Moves' ) {
    //     return;
    // }

    // console.log(myMon)
    // console.log(myMon.moves[chosenMove])

    // let damage = calc.calculateDamage({
    //     attack_stat: myMon.stats.attack,
    //     defense_stat: theirMon.stats.defense,
    //     power_stat: chosenMove.power,
    //     type_modifier: calc.calculateTypeModifier
    //     (
    //         typeTable,
    //         myMon.moves[chosenMove], 
    //         theirMon.type
    //     )
    // });

    // theirMon.stats.HP -= damage;
}

let handleSwitch = function() {
    console.log('switch button pressed');


}

let handleOk = function() {
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