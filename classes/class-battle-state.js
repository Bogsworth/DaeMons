import * as parse from '../lib/Import.js'
import * as util from '../lib/utility.js'
import * as calc from '../lib/Calculations.js'
import * as battFuncs from '../src/pages/battle/battle-funcs.js'
import { Party } from './class-party.js'
import { Warlock } from './class-warlock.js'
import { Daemon } from './class-daemon.js'
import { OnBattleEnd } from './class-on-battle-end.js'
import { Message } from './class-message.js'

class BattleState {
    constructor( enemyLock = new Warlock()) {
        
        this.handler;
        this.playerParty = this.partyLoader(sessionStorage.currentParty);
        this.enemyLock = enemyLock;
        this.TYPE_TABLE = parse.createCounterTable();
        this.battleEnder = new OnBattleEnd();
    }

    setHandlerInit(handler) {
        this.handler = handler;
    }

    partyLoader(storage) {
        let parsedStorage = JSON.parse(storage);
        // console.log(sessionStorage.currentParty);
        // console.log(parsedStorage);

        let partyArray = [];
        
        parsedStorage.forEach(daemon => {
            let newMon = new Daemon();

            newMon.copyFromData(JSON.stringify(daemon));
            partyArray.push(newMon);
        })
        return new Party( partyArray );
    }

    handleAttack () {
        console.log('attack button pressed');

        let myMon = this.playerParty.activeMon;
        let theirParty = this.enemyLock.party.members;
        let waitForPressResolve;

        function waitForPress() {
            return new Promise(resolve => waitForPressResolve = resolve);
        }
    
        let btnResolver = function() {
            if ( waitForPressResolve ) {
                waitForPressResolve();
            }
        }

        roundRunner(this);

        async function roundRunner(state) {
            const HANDLER = state.handler;
            HANDLER.preRoundInit(btnResolver);
            
            if (! HANDLER.monFightChecker() ) {
                await waitForPress();
                HANDLER.postRoundCleanUp(btnResolver)
                return;
            }

            const ACTIVE_MON = state.playerParty.activeMon
            const CHOSEN_MOVE_INDEX = document
                .getElementById( 'selectMoves' )
                .options
                .selectedIndex;
            const CHOSEN_MOVE = ACTIVE_MON.returnMoves()[ CHOSEN_MOVE_INDEX - 1];
            const THEIR_MON = state.enemyLock.party.activeMon;
            const THEIR_MOVE = state.enemyLock.chooseMove();
            
            let turnOrder = [];
            let myTurn = {
                mon: ACTIVE_MON,
                move: CHOSEN_MOVE,
                activeFlag: true
            };
            let theirTurn = {
                mon: THEIR_MON,
                move: THEIR_MOVE,
                activeFlag: false
            };
    
            if (
                ACTIVE_MON.returnModifiedStat('speed') >=
                THEIR_MON.returnModifiedStat('speed')
            ) {
                turnOrder.push(myTurn);
                turnOrder.push(theirTurn);
            }
            else {
                turnOrder.push(theirTurn);
                turnOrder.push(myTurn);
            }

            state.useMove
            (
                turnOrder[0].mon,
                turnOrder[1].mon,
                turnOrder[0].move,
                turnOrder[0].activeFlag
            );
            HANDLER.updateInfoBox(myMon);
            await waitForPress();

            if (   
                ! ( myMon.returnCurrentHP() <= 0 ) &&
                ! ( THEIR_MON.returnCurrentHP() <= 0 )
            ) {
                state.useMove
                (
                    turnOrder[1].mon,
                    turnOrder[0].mon,
                    turnOrder[1].move,
                    turnOrder[1].activeFlag
                );
                HANDLER.updateInfoBox(myMon);
                await waitForPress();
            }

            let theirMonBitTracker =  + (THEIR_MON.returnTrueIfDead());
            let myMonBitTracker = + (myMon.returnTrueIfDead());
            let bitTracker = theirMonBitTracker.toString() + myMonBitTracker.toString();
            console.log(bitTracker)

            //#region
            /**
             *
             * bitTracker is a string representing a two bit binary number.
             * The right bit is a 0 if your Daemon did not die
             * The right bit is a 1 if your Daemon did die
             * 
             * The left bit is a 0 if enemy Daemon did not die
             * The left bit is a 1 if enemy Daemon did die
             * 
             *   _____      _____ 
             *  |  _  |    |  _  |
             *  | |/' |    | |/' |
             *  |  /| |    |  /| |
             *  \ |_/ /    \ |_/ /
             *   \___/      \___/ 
             *  ******      *******               
             * their mon.  your mon.  
             *  
             * The bits below mean neither Mon died
             *   _____   _____ 
             *  |  _  | |  _  |
             *  | |/' | | |/' |
             *  |  /| | |  /| |
             *  \ |_/ / \ |_/ /
             *   \___/   \___/ 
             * 
             * The bits below mean your Daemon died, there is an additional check to see if you lost
             *   _____   __  
             *  |  _  | /  | 
             *  | |/' | `| | 
             *  |  /| |  | | 
             *  \ |_/ / _| |_
             *   \___/  \___/
             * 
             * The bits below mean their Daemon died, there is a check to see if they lost, if not, they switch.
             *   __    _____ 
             *  /  |  |  _  |
             *  `| |  | |/' |
             *   | |  |  /| |
             *  _| |_ \ |_/ /
             *  \___/  \___/ 
             * 
             * The bits below mean both your Daemon and theirs died. Check to see if you lose first, 
             * then it checks if the enemy lost
             *    __    __  
             *   /  |  /  | 
             *   `| |  `| | 
             *    | |   | | 
             *   _| |_ _| |_
             *   \___/ \___/
             *
             * 
             * Special thanks to Teddy for the ascii art
             */
            //#endregion
    
            switch (bitTracker) {
                case '00':
                    // Nothing?
                    break;
                case '01':
                    if ( ! state.playerParty.checkIfWipe())  {
                        HANDLER.writeToMessageBox( 'Your dude has died, RIP');
                        await waitForPress();
                        break;
                    }
                    HANDLER.writeToMessageBox( `You have no more Daemons to connect to` );
                    await waitForPress();
                    HANDLER.writeToMessageBox( `Without the protection of any Daemons you cannot go on`);
                    await waitForPress();
                    HANDLER.writeToMessageBox( `You lose.` );
                    await waitForPress();
                    state.battleEnder.endGame();
                    break;
                case '10':
                    if ( state.enemyLock.party.checkIfWipe()) {
                        HANDLER.writeToMessageBox( 'Their dude has died, hell yeah!');
                        await waitForPress();
                        HANDLER.writeToMessageBox( `You've defeated this dingus!` )
                        await waitForPress();
                        if ( state.enemyLock.reward != "" ) {
                            let reward = state.enemyLock.reward;

                            // TODO: Make better reward handling
                            HANDLER.writeToMessageBox( `You've earned a(n) ${reward.name}!`);
                            await waitForPress();
                        }
                        state.battleEnder.endFight( state );
                        break;
                    }
                    HANDLER.writeToMessageBox( 'Their dude has died, hell yeah!');
                    await waitForPress();
                    HANDLER.writeToMessageBox( `They lost connection with their ${THEIR_MON.name}`)
                    await waitForPress();
                    
                    // TODO: This doesn't properly handle enemies switching, fix it
                    THEIR_MON = theirParty[theirParty.indexOf(THEIR_MON) + 1];
                    fightState.theirActiveMon = THEIR_MON;
                    HANDLER.writeToMessageBox( `They connect with ${THEIR_MON.name}` );
                    HANDLER.updateMons();
                    await waitForPress();
                    break;
                case '11':

                    HANDLER.writeToMessageBox( 'Your dude has died, RIP');
                    await waitForPress();
                    if ( state.playerParty.checkIfWipe() ) {
                        HANDLER.writeToMessageBox( `You have no more Daemons to connect to` );
                        await waitForPress();
                        HANDLER.writeToMessageBox( `Without the protection of any Daemons you cannot go on`);
                        await waitForPress();
                        HANDLER.writeToMessageBox( `You lose.` );
                        await waitForPress();
                        state.battleEnder.endGame();
                        break;
                    }
                    if (! state.enemyLock.party.members.checkIfWipe()) {
                        break;
                    }
                    HANDLER.writeToMessageBox( 'Their dude has died, hell yeah!');
                    await waitForPress();
                    HANDLER.writeToMessageBox( `You've defeated this dingus!` )
                    await waitForPress();
                    if ( state.enemyLock.reward != "" ) {
                        let reward = state.enemyLock.reward;

                        // TODO: Make better reward handling
                        HANDLER.writeToMessageBox( `You've earned a(n) ${reward.name}!`);
                        await waitForPress();
                    }
                    state.battleEnder.endFight( state );
                    break;
            }
            HANDLER.postRoundCleanUp( btnResolver );
        }
    }
    
    useMove( attackingMon, defendingMon, chosenMove, playerActiveFlag ) {
        const TYPE_MOD = calc.calculateTypeModifier
        (
            this.TYPE_TABLE,
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
        let messageMaker = new Message(this, playerActiveFlag, chosenMove);
        let message = messageMaker.returnMessage();

        console.log( ROUND_INFO );

        chosenMove
            .returnStatsAffectedArray()
            .forEach( effect => {
                let target = effect[0]
                let stat = effect[1];
                let change = effect[2];
                if ( target == 'self' ) {
                    attackingMon.updateTempStatChange( stat, change );
                }
                if (target == 'enemy') {
                    defendingMon.updateTempStatChange( stat, change );
                }
        })
        chosenMove.decrementRemainingUses();
        defendingMon.updateHP( damage );
        this.handler.updateShownHP()
        this.handler.writeToMessageBox( message );
    }

    handleSwitch() {   
        let waitForPressResolve;

        function waitForPress() {
            return new Promise(resolve => waitForPressResolve = resolve);
        }
    
        let btnResolver = function() {
            if ( waitForPressResolve ) {
                waitForPressResolve();
            }
        }

        console.log('switch button pressed');
        console.log(this.playerParty.members)
        switchMons( this );
    
        async function switchMons( state ) {
            let theirMon = state.enemyLock.party.activeMon;
            let activeMon = state.playerParty.activeMon;
            const CHOSEN_MON_INDEX = document
                .getElementById( 'selectMons' )
                .options
                .selectedIndex - 1;
            const HANDLER = state.handler;

            HANDLER.preRoundInit( btnResolver );

            if ( ! HANDLER.monSwitchChecker() ) {
                await waitForPress();
                HANDLER.postRoundCleanUp(btnResolver)
                return;
            }
            await waitForPress();

            const NEW_NAME = state.playerParty.members[ CHOSEN_MON_INDEX ].returnName();
            let prevMon = activeMon;

            // Actually switch daemons
            state.playerParty.switchActiveDaemonToIndex(CHOSEN_MON_INDEX)
            activeMon = state.playerParty.activeMon;

            // Update UI
            HANDLER.updateInfoBox( activeMon );
            HANDLER.updateMons();
            HANDLER.populateSelectInit();
            HANDLER.writeToMessageBox( `You turn your mind's eye to ${NEW_NAME}` );
            await waitForPress();
    
            // Enemy gets an attack if you weren't forced to switch
            if ( prevMon.returnCurrentHP() > 0 ) {
                const ENEMY_MOVE = state.enemyLock.chooseMove();
                
                state.useMove( theirMon, activeMon, ENEMY_MOVE, false );
                HANDLER.updateInfoBox(activeMon)
                await waitForPress();
            }
            HANDLER.postRoundCleanUp(btnResolver)
        }
    }
}

export { BattleState }