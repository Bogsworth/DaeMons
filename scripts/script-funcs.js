import * as calc from '../lib/calculations.js';
import * as util from '../lib/utility.js';

function populateSelect( array = [], selectName ) {
    const select = document.getElementById( selectName );
    
    removeSelectOptions( select );
    
    array.forEach( mon => {
        if ( mon == null ){
            return;
        }

        let element = document.createElement('option');
        element.textContent = mon.name;
        element.value = mon;
        select.appendChild( element );
    });
}

function changeHeader( newHeader ) {
    document
        .getElementById('header')
        .textContent 
        = newHeader;
}

function generateHeaderFromWarlock ( warlock ) {
    const NAME = warlock.name;
    const TITLE = `Fight with ${NAME}`;

    console.log(TITLE);
    return TITLE;
}

function removeSelectOptions(selectElement) {
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
    const NAME = mon.name;
    const MAX_HP = mon.stats.HP;
    const HP = mon.returnCurrentHP();
    let ID = {
        name: 'theirMon',
        HP: 'theirMonHP'
    }
    
    if ( isYourMon == true ) {
        ID.name = 'yourMon';
        ID.HP = 'yourMonHP';
    }
    document.getElementById(ID.name).innerHTML = NAME;
    document.getElementById(ID.HP).innerHTML = HP + '/' + MAX_HP;
}

function handleAttack( fightState ) {
    let typeTable = fightState.TYPE_TABLE;
    let myMon = fightState.myActiveMon;
    let theirParty = fightState.theirParty;
    let theirMon = fightState.theirActiveMon;
    let chosenMoveIndex = document
        .getElementById( 'selectMoves' )
        .options
        .selectedIndex;
    let waitForPressResolve;
    const btn = document.getElementsByName('ok')[0];

    console.log('attack button pressed');
    console.log(theirMon);
    console.log(myMon);

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
        let chosenMove = myMon.moves[ chosenMoveIndex - 1 ];

        btn.addEventListener( 'click', btnResolver );

        if ( chosenMoveIndex == 0 ) {
            util.writeToMessageBox('Pick a move before attacking.')
            await waitForPress();
            cleanUp();
            return;
        }
        
        if ( myMon.returnCurrentHP() <= 0 ) {
            util.writeToMessageBox( `Your Daemon is dead, choose a new one` );
            await waitForPress();
            cleanUp();
            return;
        }

        console.log(chosenMove);

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

        // TODO: check for loss state for player
        hpCheck: if ( util.checkIfHPZero( myMon, theirMon )) {
            if ( myMon.returnCurrentHP() <= 0 )
            {
                util.writeToMessageBox( 'Your dude has died, RIP');
                await waitForPress();
            }
            else {
                util.writeToMessageBox( 'Their dude has died, hell yeah!');
                await waitForPress();
                if ( util.checkIfEnemyWipe( theirParty )) {
                    util.writeToMessageBox( `You've defeated this dingus!` )
                    await waitForPress();
                    break hpCheck;
                }
                util.writeToMessageBox( `They lost connection with their ${theirMon.name}`)
                await waitForPress();

                theirMon = theirParty[theirParty.indexOf(theirMon) + 1];
                fightState.theirActiveMon = theirMon;
                util.writeToMessageBox( `They connect with ${theirMon.name}` );
                updateMon( theirMon, false );
                await waitForPress();
            }
        }
        cleanUp();
    }

    function cleanUp() {
        btn.removeEventListener( 'click', btnResolver );
        util.writeToMessageBox( 'What do you want to do?' );
    } 
}

function yourMove( typeTable, myMon, theirMon, chosenMove ) {
    const TYPE_MOD = calc.calculateTypeModifier
    (
        typeTable,
        chosenMove.type, 
        theirMon.type
    );
    let message = '';
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

    message += `You did ${damage} damage using ${chosenMove.name}!`
    if ( TYPE_MOD > 1 ) {
        message += ` It's super effective!`
    }

    theirMon.updateHP( damage );
    util.updateShownHP( 'theirMonHP', theirMon );
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
    let message = '';
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

    message += `Enemy ${theirMon.name} did ${damage} damage ` + 
        `using ${theirChosenMove.name}!`
    if ( damage.type_modifier > 1 ) {
        message += ` It's super effective!`
    }
    
    myMon.updateHP( damage )
    util.updateShownHP ( 'yourMonHP', myMon );
    util.writeToMessageBox( message );
}

function handleSwitch( fightState ) {   
    let typeTable = fightState.TYPE_TABLE;
    let myParty = fightState.myParty;
    let theirMon = fightState.theirActiveMon;
    let activeMon = fightState.myActiveMon;
    let chosenMonIndex = document
        .getElementById( 'selectMons' )
        .options
        .selectedIndex - 1;
    const btn = document.getElementsByName('ok')[0];
    
    let waitForPressResolve;

    console.log('switch button pressed');
    console.log(myParty)

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
        const CURRENT_NAME = activeMon.name;
        const NEW_NAME = myParty[ chosenMonIndex ].name;
        let prevMon = activeMon;

        console.log(myParty)

        btn.addEventListener( 'click', btnResolver );

        if ( chosenMonIndex == -1 ) {
            util.writeToMessageBox( 'Pick a Daemon to choose for before switching.'); 
            await waitForPress();
            cleanUp();
            return;
        }
        if ( myParty[ chosenMonIndex ].returnCurrentHP() <= 0 ) {
            util.writeToMessageBox( `That Daemon is dead and gone, you cannot switch to them.` );
            await waitForPress();
            cleanUp();
            return;
        }
        if ( chosenMonIndex == myParty.indexOf( activeMon ) ) {
            util.writeToMessageBox( 'Pick a Daemon that is not currently active.' );
            await waitForPress();
            cleanUp();
            return;
        }

        util.writeToMessageBox( `You sever your mind link with ${CURRENT_NAME}` );
        await waitForPress();

        util.writeToMessageBox( `You turn your mind's eye to ${NEW_NAME}` );
        fightState.myActiveMon = myParty[ chosenMonIndex ];
        activeMon = fightState.myActiveMon;

        // Update UI
        updateMon( activeMon, true );
        util.updateShownHP( 'yourMonHP', activeMon )
        populateSelect( activeMon.moves, 'selectMoves' );
        populateSelect( myParty, 'selectMons' );
        await waitForPress();

        if (! util.checkIfHPZero( prevMon ) ) {
            theirMove( typeTable, activeMon, theirMon );
            await waitForPress();
        }
        
        cleanUp();
    }

    function cleanUp() {
        btn.removeEventListener( 'click', btnResolver );
        util.writeToMessageBox( 'What do you want to do?' );
    }
}

function handleOk() {
    console.log('ok button pressed');
}

export {
    populateSelect,
    changeHeader,
    generateHeaderFromWarlock,
    attachButton,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}