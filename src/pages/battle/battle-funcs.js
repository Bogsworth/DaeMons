/*
# TODO List
## Required TODOs

## TODONE!!!
- TODONE: Split this file up into battle-funcs.js and more general functions into utility.js
*/

import * as calc from '../../../lib/calculations.js';
import * as util from '../../../lib/utility.js';
import * as parse from '../../../lib/import.js';
import { Move } from '../../../data/class-move.js'

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

function loadMyParty() {
    let myParty = [];

    if (sessionStorage.currentParty == undefined ) {
        myParty = parse.createParty();
    } 
    else {
        let partyJSON = JSON.parse(sessionStorage.currentParty);

        myParty = util.parseDaemonJSON(partyJSON);
    }

    return myParty;
}

function loadCurrentLock() {
    let currentLock;
    let warlocks = parse.createWarlocks();

    if ( sessionStorage.nextLock == undefined ) {
        currentLock = warlocks.get( calc.returnIDFromName('Pushover', warlocks));
    }
    else {
        let lockJSON = JSON.parse(sessionStorage.nextLock);
        console.log(lockJSON)
        currentLock = warlocks.get( calc.returnIDFromName( lockJSON.name, warlocks))
    }

    return currentLock;
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
        preGame();

        // Weed out exceptions
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

        const CURRENT_NAME = activeMon.name;
        const NEW_NAME = myParty[ chosenMonIndex ].name;
        let prevMon = activeMon;

        util.writeToMessageBox( `You sever your mind link with ${CURRENT_NAME}` );
        await waitForPress();

        util.writeToMessageBox( `You turn your mind's eye to ${NEW_NAME}` );
        fightState.myActiveMon.resetTempStatModifiers();
        fightState.myActiveMon = myParty[ chosenMonIndex ];
        activeMon = fightState.myActiveMon;

        // Update UI
        updateMon( activeMon, true );
        util.updateShownHP( 'yourMonHP', activeMon )
        util.populateSelect( activeMon.moves, 'selectMoves' );
        util.populateSelect( myParty, 'selectMons' );
        await waitForPress();

        if (! util.checkIfHPZero( prevMon ) ) {
            const ENEMY_MOVE = util.chooseMove( theirMon );
            
            useMove( typeTable, theirMon, activeMon, ENEMY_MOVE, false );
            await waitForPress();
        }
        
        cleanUp();
    }

    function preGame() {
        btn.addEventListener( 'click', btnResolver );
        disableButtons();
    }

    function cleanUp() {
        enableButtons();
        btn.removeEventListener( 'click', btnResolver );
        util.writeToMessageBox( 'What do you want to do?' );
    }
}

function handleAttack( fightState ) {
    let typeTable = fightState.TYPE_TABLE;
    let myMon = fightState.myActiveMon;
    let myParty = fightState.myParty;
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

    async function roundRunner() {
        preGame();
        
        // Weed out exceptions
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

        let chosenMove = myMon.moves[chosenMoveIndex - 1]
        console.log(chosenMove)
        if ( chosenMove.returnUses() <= 0 ) {
            util.writeToMessageBox( `You have no more uses of that move` );
            await waitForPress();
            cleanUp();
            return;
        }
 
        let turnOrder = [];
        let myTurn = {
            mon: myMon,

            move: chosenMove,
            activeFlag: true
        };
        let theirTurn = {
            mon: theirMon,
            move: util.chooseMove( theirMon ),
            activeFlag: false
        };

        if (
            myMon.returnModifiedStat('speed') >=
            theirMon.returnModifiedStat('speed')
        ) {
            turnOrder.push(myTurn);
            turnOrder.push(theirTurn);
        }
        else {
            turnOrder.push(theirTurn);
            turnOrder.push(myTurn);
        }

        useMove
        (
            typeTable,
            turnOrder[0].mon,
            turnOrder[1].mon,
            turnOrder[0].move,
            turnOrder[0].activeFlag
        );
        turnOrder[0].move.decrementRemainingUses();
        await waitForPress();

        if (! util.checkIfHPZero( myMon, theirMon )) {
            useMove
            (
                typeTable,
                turnOrder[1].mon,
                turnOrder[0].mon,
                turnOrder[1].move,
                turnOrder[1].activeFlag
            );
            turnOrder[1].move.decrementRemainingUses();
            await waitForPress();
        }

        // TODO: check for loss state for player
        hpCheck: if ( util.checkIfHPZero( myMon, theirMon )) {
            if ( myMon.returnCurrentHP() <= 0 )
            {
                util.writeToMessageBox( 'Your dude has died, RIP');
                await waitForPress();
                if (util.checkIfWipe( myParty )) {
                    util.writeToMessageBox( `You have no more Daemons to connect to` );
                    await waitForPress();
                    util.writeToMessageBox( `Without the protection of any Daemons you cannot go on`);
                    await waitForPress();
                    util.writeToMessageBox( `You lose.` );
                    await waitForPress();
                    endGame();
                    break hpCheck;
                }
            }
            else {
                util.writeToMessageBox( 'Their dude has died, hell yeah!');
                await waitForPress();
                if ( util.checkIfWipe( theirParty )) {
                    util.writeToMessageBox( `You've defeated this dingus!` )
                    await waitForPress();
                    if ( fightState.enemyLock.reward != "" ) {
                        let reward = fightState.enemyLock.reward
                        util.writeToMessageBox( `You've earned a(n) ${reward.name}!`);
                        await waitForPress();
                    }
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

    function preGame() {
        btn.addEventListener( 'click', btnResolver );
        disableButtons();
    }

    function cleanUp() {
        enableButtons();
        btn.removeEventListener( 'click', btnResolver );
        util.writeToMessageBox( 'What do you want to do?' );
    } 
}

function useMove( typeTable, attackingMon, defendingMon, chosenMoveObject, playerActiveFlag ) {
    class MessageClass {
        constructor(playerMessage, enemyMessage) {
            this['player'] = playerMessage;
            this['enemy'] = enemyMessage;
        }
    }
    let message = '';
    let chosenMove = new Move( chosenMoveObject );
    const TYPE_MOD = calc.calculateTypeModifier
    (
        typeTable,
        chosenMove.returnType(), 
        defendingMon.returnType()
    );

    const ROUND_INFO = {
        attacker: attackingMon,
        defender: defendingMon,
        move: chosenMove,
        typeModifier: TYPE_MOD
    };
    let damage = calc.calculateDamage( ROUND_INFO );
    let statsAffectedArray = chosenMove.returnStatsAffectedArray();
    let activeLock = setActiveLock( playerActiveFlag );

    const templates = {
        didDamage: new MessageClass(
            `Your ${attackingMon.name} did ${damage} using ${chosenMove.name}`,
            `Enemy ${attackingMon.name} did ${damage} using ${chosenMove.name}`
        ),
        missed: new MessageClass (
            `Your ${attackingMon.name} used ${chosenMove.name} but it missed...`,
            `Enemy ${attackingMon.name} used ${chosenMove.name} but it missed!`
        ),
        failed: new MessageClass (
            'but it failed...',
            'but it failed!'
        ),
        superEffective: new MessageClass (
            ` - it's super effective!`,
            ` - it's super effective!`
        ),
        // affectedEnemyStat: new MessageClass (
        //     `Your ${attackingMon.name} reduced opponent's ${defendingMon} ${stat} stat`,
        //     `Enemy ${attackingMon.name} reduced your ${defendingMon.name}'s ${stat} stat`
        // ),
        // affectedOwnStat: new MessageClass (
        //     `Your ${attackingMon.name} increased its ${stat} stat`,
        //     `Enemy ${attackingMon.name} increased its ${stat} stat`
        // ),

        // elementName seems backwards, but it's to apply damage to enemy Mon
        elementName: new MessageClass ('theirMonHP', 'yourMonHP' ) ,
        usedMove: new MessageClass ( '', '' )
    }

    console.log('attacking Mon: ')
    console.log(attackingMon)
    console.log('defending Mon: ')
    console.log(defendingMon)
    console.log('chosen move: ') 
    console.log(chosenMove)
    console.log('type modifier: ' + TYPE_MOD)

    if ( ! calc.checkIfHit( chosenMove )) {
        message += templates.missed[ activeLock ];
        util.writeToMessageBox( message );
        return;
    }

    if (chosenMove.power != 0) {
        message += templates.didDamage[ activeLock ];
    }

    if ( statsAffectedArray.length != 0 ) {
        console.log(statsAffectedArray)
        statsAffectedArray.forEach( effect => {
            let target = effect[0]
            let stat = effect[1];
            let change = effect[2];

            if ( target == 'self' ) {
                attackingMon.updateTempStatChange( stat, change );

                if ( playerActiveFlag ) {
                    message += `Your ${attackingMon.name} increased its ${stat} stat`
                }
                else {
                    message += `Enemy ${attackingMon.name} increased its ${stat} stat`
                }
            }
            else {
                defendingMon.updateTempStatChange( stat, change );
                if ( playerActiveFlag ) {
                    message += `Your ${attackingMon.name} reduced opponent's ${defendingMon.name} ${stat} stat`
                }
                else {
                    message += `Enemy ${attackingMon.name} reduced your ${defendingMon.name}'s ${stat} stat`
                }
            }
        });
    }

    if ( TYPE_MOD > 1 ) {
        message += templates.superEffective[ activeLock ];
    }

    defendingMon.updateHP( damage );
    util.updateShownHP( templates.elementName[ activeLock ], defendingMon)
    util.writeToMessageBox( message );

    function setActiveLock( activeFlag ) {
        if (activeFlag) {
            return 'player';
        }
        else {
            return 'enemy';
        }
    }
}

function handleOk() {
    console.log('ok button pressed');
}

function disableButtons(buttNames = [ 'attack', 'switch']) {
    buttNames.forEach( name => {
        util.disableButton(name);
    })
}

function enableButtons(buttNames = [ 'attack', 'switch']) {
    buttNames.forEach( name => {
        util.enableButton(name);
    })
}

function endFight( fightState ) {
    util.savePostFightParty( fightState.myParty );
    getReward( fightState );
    getNextChallenger( fightState );
    window.location.href = '../interlude/interlude.html';
}

function getNextChallenger( fightState ) {
    sessionStorage.nextLockName = JSON.stringify(fightState.enemyLock.nextFight)
}

function getReward( fightState ) {
    sessionStorage.newReward = JSON.stringify(fightState.enemyLock.reward);
}

function endGame() {
    sessionStorage.clear();
    window.location.href = '../../../index.html';
}

export {
    changeHeader,
    generateHeaderFromWarlock,
    loadMyParty,
    loadCurrentLock,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}