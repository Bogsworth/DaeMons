import * as calc from '../lib/calculations.js';
import * as util from '../lib/utility.js';

function populateSelect( array = [], selectName ) {
    const select = document.getElementById( selectName )
    
    removeOptions(select)
    
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

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for( i = L; i > 0; i-- ) {
        selectElement.remove(i);
    }
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
    document.getElementById(ID.HP).innerHTML = mon.returnCurrentHP() + '/' + mon.stats.HP
}

function handleAttack( typeTable, myMon, theirMon ) {
    console.log('attack button pressed');
    
    let chosenMoveIndex = document.getElementById( 'selectMoves' ).options.selectedIndex;
    let chosenMove = myMon.moves[ chosenMoveIndex - 1 ];
    console.log(myMon)
    console.log(chosenMove)

    // TODO: move this to messageBox
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
        
        if ( myMon.returnCurrentHP() <= 0 ) {
            util.writeToMessageBox( `Your Daemon is dead, choose a new one` );
            await waitForPress();
            cleanUp();
            return;
        }

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

        // TODO: Force enemy to switch on dead Mon
        // TODO: check for loss state for either player
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

        cleanUp();

        function cleanUp() {
            btn.removeEventListener( 'click', btnResolver );
            util.writeToMessageBox( 'What do you want to do?' );
        }  
    }
}

function yourMove( typeTable, myMon, theirMon, chosenMove ) {
    const TYPE_MOD = calc.calculateTypeModifier
    (
        typeTable,
        chosenMove.type, 
        theirMon.type
    )
    let damage = calc.calculateDamage(
    {
        attack_stat: myMon.stats.attack,
        defense_stat: theirMon.stats.defense,
        power_stat: chosenMove.power,
        type_modifier: TYPE_MOD
    });

    if ( ! calc.checkIfHit( chosenMove )) {
        util.writeToMessageBox( `You used ${chosenMove.name} ` + 
            `but it missed...`);
        return;
    }

    theirMon.updateHP( damage );
    util.updateShownHP( 'theirMonHP', theirMon )
    let message = `You did ${damage} damage using ${chosenMove.name}!`
    if ( TYPE_MOD > 1 ) { message += ` It's super effective!` }
    util.writeToMessageBox( message );

}

function theirMove(typeTable, myMon, theirMon) {
    let theirChosenMove = util.chooseMove( theirMon );
    const TYPE_MOD = calc.calculateTypeModifier
    (
        typeTable,
        theirChosenMove.type, 
        theirMon.type
    )
    let damage = calc.calculateDamage(
    {
        attack_stat: theirMon.stats.attack,
        defense_stat: myMon.stats.defense,
        power_stat: theirChosenMove.power,
        type_modifier: TYPE_MOD
    });

    if ( ! calc.checkIfHit( theirChosenMove )) {
        util.writeToMessageBox( ` Enemy ${theirMon.name} ` +
            `used ${theirChosenMove.name} but missed!` );
        return;
    }
    
    myMon.updateHP( damage )
    util.updateShownHP ( 'yourMonHP', myMon );

    let message = `Enemy ${theirMon.name} did ${damage} damage ` + 
        `using ${theirChosenMove.name}!`
    if ( damage.type_modifier > 1 ) { message += ` It's super effective!` }
    util.writeToMessageBox( message );
}

function handleSwitch( typeTable, myParty, theirMon) {
    console.log('switch button pressed');
    
    let currentMonDead = false;
    if ( myParty[0].returnCurrentHP() <= 0) {
        currentMonDead = true;
    }

    let chosenMonIndex = document
        .getElementById( 'selectMons' )
        .options
        .selectedIndex - 1;
    let chosenMon = myParty[ chosenMonIndex ];

    // TODO: move this to messageBox
    if ( chosenMonIndex == -1 ) {
        console.log('Pick a Daemon to choose for before switching.');
        return;
    }
    // TODO: move this to messageBox
    if ( chosenMonIndex == 0 ) {
        console.log( 'Pick a Daemon that is not currently active.' );
        return;
    }

    let waitForPressResolve;
    const btn = document.getElementsByName('ok')[0];

    switchMons( myParty );

    function waitForPress() {
        return new Promise(resolve => waitForPressResolve = resolve);
    }

    function btnResolver() {
        if (waitForPressResolve) {
            waitForPressResolve();
        }
    }

    async function switchMons( myParty ) {
        console.log(myParty)

        const CURRENT_NAME = myParty[ 0 ].name;
        const NEW_NAME = myParty[ chosenMonIndex ].name;

        btn.addEventListener( 'click', btnResolver );

        if ( myParty[ chosenMonIndex ].returnCurrentHP() <= 0 ) {
            util.writeToMessageBox( `That Daemon is dead and gone, you cannot switch to them.` );
            await waitForPress();
            cleanUp();
            return;
        }

        util.writeToMessageBox( `You sever your mind link with ${CURRENT_NAME}` );
        await waitForPress();

        util.writeToMessageBox( `You turn your minds' eye to ${NEW_NAME}` );
        [ myParty[0], myParty[ chosenMonIndex ]] = [ myParty[ chosenMonIndex ], myParty[ 0 ]];

        // Update UI
        updateMon( myParty[0], true );
        util.updateShownHP( 'yourMonHP', myParty[0] )
        populateSelect( myParty[0].moves, 'selectMoves' );
        populateSelect( myParty, 'selectMons' );
        await waitForPress();

        if (! currentMonDead ) {
            theirMove( typeTable, myParty[0], theirMon );
            await waitForPress();
        }
        
        cleanUp();

        function cleanUp() {
            btn.removeEventListener( 'click', btnResolver );
            util.writeToMessageBox( 'What do you want to do?' );
        }
    }
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