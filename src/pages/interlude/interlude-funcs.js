import * as parse from '../../../lib/import.js'
import * as calc from '../../../lib/calculations.js'
import * as util from '../../../lib/utility.js'

function setupReadyButton() {
    const READY_BTN_NAME = 'startFight';
    const READY_BTN = document.getElementsByName(READY_BTN_NAME)[0];
    
    READY_BTN.addEventListener('click', loadBattle);
}

function populateNextFight( warlock ) {
    const NAME_ID = 'lockName';
    const DESC_ID = 'lockDescription';

    let nameEl = document.getElementById( NAME_ID );
    let descEl = document.getElementById( DESC_ID );

    nameEl.textContent = warlock.name;
    descEl.textContent = warlock.description;
}

function populateDaemonInspect() {
    const SELECT_ID = 'daemonListSelect';
    const SEL_ELEMENT = document.getElementById(SELECT_ID);

    const MOVE_SEL_ID = 'moveSelect';
    const MOVE_SEL_EL = document.getElementById( MOVE_SEL_ID );
    
    SEL_ELEMENT.addEventListener( 'change', updateDaemonSummary );
    MOVE_SEL_EL.addEventListener( 'change', updateMoveStats);

}

function updateDaemonSummary() {
    const IDs = {
        summary: "monSummary",
        type: "monType",
    };
    const SELECT_ID = 'daemonListSelect';
    const MOVE_EL_ID = 'moveSelect';
    const SELECT = document.getElementById( SELECT_ID );
    const SELECTED_VAL = SELECT[SELECT.selectedIndex].value;
    const SELECTED_MON = JSON.parse(SELECTED_VAL);

    console.log(SELECTED_VAL)
    if ( SELECT.selectedIndex == 0 ) {
        document
            .getElementById(IDs.summary)
            .textContent
            = "summary";
        document
            .getElementById(IDs.type)
            .textContent
            = "type(s)";
        return;
    }

    document
        .getElementById(IDs.summary)
        .textContent
        = "currently no summaries in MON_TABLE";
    document
        .getElementById(IDs.type)
        .textContent
        = SELECTED_MON.type;
    util.populateSelect(SELECTED_MON.moves, MOVE_EL_ID);
}

function updateMoveStats() {
    const MOVE_EL_ID = 'moveSelect';
    const MOVE_STATS_EL_ID = 'moveStats';
    const SELECT = document.getElementById( MOVE_EL_ID );
    const SELECTED_VAL = SELECT[SELECT.selectedIndex].value;
    const SELECTED_MOVE = JSON.parse(SELECTED_VAL);

    if ( SELECT.selectedIndex == 0 ) {
        document.getElementById( MOVE_STATS_EL_ID ) = 'move stats';
    }

    document
        .getElementById(MOVE_STATS_EL_ID)
        .textContent = moveToPrintable( SELECTED_MOVE );
}

// - [ ] TODO: Make moveToPrintable() actually legible in app
function moveToPrintable( move ) {
    let message = '';

    message += 'TYPE: ' + move.type + '\n'
    message += 'POWER: ' + move.power + '\n';
    message += 'ACCURACY: ' + move.accuracy + '\n';
    message += 'USES: ' + move.uses + '\n';

    return message;
}

function importPartyChoices( state ) {
    let selectArray = [
        'partySelect0',
        'partySelect1',
        'partySelect2',
        'daemonListSelect'
    ];
    let partySelects = [
        document.getElementById( selectArray[0] ),
        document.getElementById( selectArray[1] ),
        document.getElementById( selectArray[2] ),
    ];
    let tempStorage = [];

    partySelects.forEach( select => {
        if ( select.selectedIndex == 0) {
            return;
        }
        let selectedMonJSON = JSON.parse(select.value);        
        
        console.log(select.value);
        tempStorage.push(selectedMonJSON);
    })
    state.currentParty = tempStorage;
    sessionStorage.currentParty = JSON.stringify(tempStorage);

    console.log(sessionStorage.currentParty);
    console.log(state.currentParty);
}

function populatePartySelects( state, selectElements ) {  
    let i = 0;
    
    state['currentParty'].forEach( mon => {
        let nameStr = mon.returnName();
        
        if (util.checkIfHPZero( mon )) {
            nameStr += ' (dead)';
        }

        util.setDefaultSelectValue(selectElements[i++], nameStr );
    });

    selectElements.forEach ( sel_el => {
        sel_el.addEventListener( 'change', function () {
            importPartyChoices(state);
            keepSelectsUnique( state, selectElements );
        });
    })
}

function keepSelectsUnique( state, selectElements ) {
    let indexArray = [];

    selectElements.forEach( el => {
        enableAllOptions( el );
        indexArray.push(el.selectedIndex);
    });
    selectElements.forEach( el => {
        indexArray.forEach( index => {
            if ( index == 0 ) {
                return;
            }
            el.options[index].disabled = true;
        })
    });

    //selEl is Select Element
    function enableAllOptions( selEl ) {
        for ( let i = 0; i < selEl.options.length; i++ ) {
            selEl.options[i].disabled = false;
        }
    }
}

function populateChallenger( name ) {
    let warlocks = parse.createWarlocks();
    let nextLock = warlocks.get( calc.returnIDFromName( name, warlocks));
    console.log(nextLock);

    sessionStorage.nextLock = JSON.stringify(nextLock);
    console.log(sessionStorage)
    populateNextFight( nextLock );
}

function healSuperset( interludeState, parameters ) {
    parameters.forEach( parameter => {
        healMons( interludeState, parameter );
    });
}

/**
 * This function will not heal a Daemon if they're already dead
 */
function healMons( interludeState, parameter ) {
    let daemons = interludeState[parameter];
    
    daemons.forEach( mon => {
        if ( util.checkIfHPZero( mon )) {
            return;
        }
        mon.currentHP = mon.returnHPStat();
    })
    interludeState.updateParam( daemons, parameter );
}

function restoreMoveUsesSuperSet( interludeState, parameters ) {
    parameters.forEach( parameter => {
        console.log('restoring moves')
        restoreMoveUses( interludeState, parameter );
    })
}

function restoreMoveUses( interludeState, parameter ) {
    let daemons = interludeState[parameter];
    console.log(daemons)
    console.log(daemons[0].moves[0].remainingUses)

    daemons.forEach( mon => {
        mon.restoreAllMoveUses();
    })
    interludeState.updateParam( daemons, parameter );
}

function handleReward( rewardString, FULL_DAEMON_LIST, currentParty ) {
    let reward = JSON.parse(rewardString);
    let rewardID = calc.returnIDFromName( reward.name, FULL_DAEMON_LIST );
    let moveMap = parse.createMoveTable();

    if ( ! FULL_DAEMON_LIST.has(rewardID) ) {
        return;
    }

    // TODO: see if we need to clone the newDaemon
    let newDaemon = FULL_DAEMON_LIST.get(rewardID);
    
    reward.moves.forEach( move => {
        if (move == null) {
            return;
        }
        parse.addMove( move, newDaemon, reward, moveMap )
    })
    currentParty.push( newDaemon ) ;
}

function loadBattle() {
    let party = util.parseDaemonJSON(JSON.parse(sessionStorage.currentParty))

    console.log('Im in loadBattle');
    console.log(sessionStorage);

    if ( util.checkIfPartyContainsDeadMon( party )) {
        const CONFIRMATION_MSG = 'You are bringing a dead Daemon with you, are you sure you want to do that?';
        
        if ( confirm( CONFIRMATION_MSG )) {
            window.location.href = '../battle/battle.html';
        }
        else {
            return;
        }
    }

    window.location.href = '../battle/battle.html';
}

export {
    populateNextFight,
    updateDaemonSummary,
    loadBattle,
    healSuperset,
    restoreMoveUsesSuperSet,
    populatePartySelects,
    keepSelectsUnique,
    setupReadyButton,
    populateChallenger,
    handleReward,
    populateDaemonInspect
}