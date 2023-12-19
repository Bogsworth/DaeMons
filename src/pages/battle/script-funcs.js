/*
# TODO List
- TODO: Split this file up into battle-funcs.js and maybe move more general functions into utility.js or similar
*/

import * as calc from '../../../lib/calculations.js';
import * as util from '../../../lib/utility.js';

function populateSelect( array = [], selectName ) {
    const select = document.getElementById( selectName );
    
    removeSelectOptions( select );
    
    array.forEach( mon => {
        if ( mon == null ){
            return;
        }
        let element = document.createElement('option');
        
        element.textContent = mon.name;
        
        element.value = JSON.stringify(mon);
        //element.value = mon;
        console.log(element.value)
        
        select.appendChild( element );
    });
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
    document.getElementById(ID.HP).innerHTML = HP + '/' + MAX_HP + ' hp';
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
        const ENEMY_MOVE = util.chooseMove( theirMon );

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
            useMove( typeTable, myMon, theirMon, chosenMove, true );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
            useMove( typeTable, theirMon, myMon, ENEMY_MOVE, false );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
        }
        else {
            useMove( typeTable, theirMon, myMon, ENEMY_MOVE, false );
            await waitForPress();
            if ( util.checkIfHPZero( myMon, theirMon )) {
                break round;
            }
            useMove( typeTable, myMon, theirMon, chosenMove, true );
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
                    endFight( fightState );
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

function endFight( fightState ) {
    util.savePostFightParty( fightState.myParty );
    // This line originally worked before refactor to move a lot of files around for readability
    //window.location.href = '../pages/interlude/interlude.html';
    window.location.href = '../interlude/interlude.html';
    //window.location.href = '/src/pages/interlude/interlude.html';
    // win.loadURL(`../pages/interlude/interlude.html`);

}

function useMove( typeTable, attackingMon, defendingMon, chosenMove, playerActiveFlag ) {
    class MessageClass {
        constructor(playerMessage, enemyMessage) {
            this['player'] = playerMessage;
            this['enemy'] = enemyMessage;
        }
    }
    const TYPE_MOD = calc.calculateTypeModifier
    (
        typeTable,
        chosenMove.type, 
        defendingMon.type
    );
    let message = '';
    let activeLock = '';
    let damage = calc.calculateDamage(
    {
        attack_stat: attackingMon.stats.attack,
        defense_stat: defendingMon.stats.defense,
        power_stat: chosenMove.power,
        type_modifier: TYPE_MOD
    });
    const templates = {
        didDamage: new MessageClass(
            `Your ${attackingMon.name} did ${damage} using ${chosenMove.name}`,
            `Enemy ${attackingMon.name} did ${damage} using ${chosenMove.name}`
        ),
        missed: new MessageClass (
            `Your ${attackingMon.name} used ${chosenMove.name} but it missed...`,
            `Enemy ${attackingMon.name} used ${chosenMove.name} but it missed!`
        ),
        failed: new MessageClass ( 'but it failed...', 'but it failed!' ),
        superEffective: new MessageClass (
            ` - it's super effective!`,
            ` - it's super effective!`
        ),
        // elementName seems backwards, but it's to apply damage to enemy Mon
        elementName: new MessageClass ('theirMonHP', 'yourMonHP' ) ,
        usedMove: new MessageClass ( '', '' )
    }

    console.log('attacking Mon: ')
    console.log(attackingMon)
    console.log('chosen move: ' + chosenMove.name)
    console.log('chosen move type: ' + chosenMove.type)
    console.log('defendingMon type: ' + defendingMon.type)
    console.log('type modifier: ' + TYPE_MOD)

    if (playerActiveFlag) {
        activeLock = 'player';
    }
    else {
        activeLock = 'enemy';
    }

    if ( ! calc.checkIfHit( chosenMove )) {
        message += templates.missed[ activeLock ];
        util.writeToMessageBox( message );
        return;
    }

    message += templates.didDamage[ activeLock ];
    if ( TYPE_MOD > 1 ) {
        message += templates.superEffective[ activeLock ];
    }
    defendingMon.updateHP( damage );
    console.log(templates.elementName[ activeLock])
    util.updateShownHP( templates.elementName[ activeLock ], defendingMon)
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

    switchMons();

    function waitForPress() {
        return new Promise(resolve => waitForPressResolve = resolve);
    }

    function btnResolver() {
        if (waitForPressResolve) {
            waitForPressResolve();
        }
    }

    async function switchMons() {
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
            const ENEMY_MOVE = util.chooseMove( theirMon );
            //theirMove( typeTable, activeMon, theirMon );
            useMove( typeTable, theirMon, activeMon, ENEMY_MOVE, false );
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
    setDefaultSelectValue,
    changeHeader,
    generateHeaderFromWarlock,
    attachButton,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}