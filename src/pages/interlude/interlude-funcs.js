import * as parse from '../../../lib/Import.js'
import * as calc from '../../../lib/Calculations.js'
import * as scripts from '../battle/script-funcs.js'
import * as util from '../../../lib/utility.js'
import { Daemon } from '../../../Data/ClassDaemon.js';

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
    scripts.populateSelect(SELECTED_MON.moves, MOVE_EL_ID);
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

    document.getElementById(MOVE_STATS_EL_ID).textContent = moveToPrintable( SELECTED_MOVE );
}

// TODO: Make moveToPrintable() actually legible in app
function moveToPrintable( move ) {
    let message = '';

    message += 'TYPE: ' + move.type + '\n'
    message += 'POWER: ' + move.power + '\n';
    message += 'ACCURACY: ' + move.accuracy + '\n';
    message += 'USES: ' + move.uses + '\n';
    return message;
}

function importPartyChoices( state ) {
    let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect'];
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
        //let selectedMonJSON = select.value;
        let selectedMonJSON = JSON.parse(select.value);
        console.log(select.value)

        tempStorage.push(selectedMonJSON);
    })
    //state.currentParty = JSON.stringify(tempStorage)
    state.currentParty = tempStorage
    
    
    //sessionStorage.currentParty = JSON.stringify(tempStorage);
    sessionStorage.currentParty = JSON.stringify(tempStorage)
    console.log(sessionStorage.currentParty)
    console.log(state.currentParty)
    
}

//function populatePartySelects( currentParty, selectElements, state ) { 
function populatePartySelects( state, selectElements ) {  
    let i = 0;
    
    state['currentParty'].forEach( mon => {
        scripts.setDefaultSelectValue(selectElements[i++], mon.name );
    });

    selectElements.forEach ( sel_el => {
        sel_el.addEventListener( 'change', function () {
            importPartyChoices(state);
        });
    })
}

function populateChallenger( name ) {
    let warlocks = parse.createWarlocks();
    let nextLock = warlocks.get( calc.returnIDFromName( name, warlocks));
    console.log(warlocks)
    console.log(nextLock)

    sessionStorage.nextLock = JSON.stringify(nextLock);
    console.log(sessionStorage)
    populateNextFight( nextLock );
}

function healMons( interludeState, parameters ) {
    healSubset( interludeState, parameters[0] );
    healSubset( interludeState, parameters[1] );
}

function healSubset( interludeState, parameter ) {
    let daemons = interludeState[parameter];
    
    daemons.forEach( mon => {
        mon.currentHP = mon.stats.HP;
    })

    interludeState.updateParam( daemons, parameter)
}

function handleReward( rewardString, FULL_DAEMON_LIST, currentParty ) {
    let reward = JSON.parse(rewardString);
    let rewardID = calc.returnIDFromName( reward.name, FULL_DAEMON_LIST );
    let moveMap = parse.createMoveTable();

    console.log(currentParty)
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

function initSessionStorage() {
    if ( sessionStorage.currentParty == undefined ) {
        sessionStorage.currentParty = '""';
    }
    if ( sessionStorage.newReward == undefined ) {
        sessionStorage.reward = '""';
    }
    if ( sessionStorage.allHeldMons == undefined ) {
        sessionStorage.allHeldMons = '""';
    }
    if ( sessionStorage.nextLock == undefined ) {
        sessionStorage.nextLock = '""';
    }
}

function handleSessionStorage() {
    let CURRENT_PARTY_JSON = JSON.parse( sessionStorage.currentParty );
    let REWARD = JSON.parse( sessionStorage.newReward );
    let ALL_HELD_MONS_JSON = JSON.parse( sessionStorage.allHeldMons );
    let NEXT_LOCK = JSON.parse( sessionStorage.nextLock );
    let currentParty = [];
    let allHeldMons = [];

    if ( ! ALL_HELD_MONS_JSON ) {
        ALL_HELD_MONS_JSON = CURRENT_PARTY_JSON
    }
    currentParty = util.parseDaemonJSON( CURRENT_PARTY_JSON );
    allHeldMons = util.parseDaemonJSON( ALL_HELD_MONS_JSON );

    return {
        currentParty: currentParty,
        newReward: REWARD,
        allHeldMons: allHeldMons,
        nextLock: NEXT_LOCK
    }
}

function interludeToSessionStorage( state ) {
    let sessionStateArray = [
        'currentParty',
        'newReward',
        'allHeldMons',
        'nextLock'
    ];
    let i = 0;
    console.log('the interlude state')
    console.log(state)

    //state.forEach( val => {
    for  ( const [key, val] of Object.entries(state)) {
        sessionStorage[sessionStateArray[i++]] = JSON.stringify(val);
    }
    console.log(sessionStorage);
}

function loadBattle() {
    console.log('Im in loadBattle');
    //importPartyChoices( interludeState );
    //interludeToSessionStorage( );
    console.log(sessionStorage)
    //return;
    window.location.href = '../battle/battle.html';
}

export {
    populateNextFight,
    updateDaemonSummary,
    loadBattle,
    healMons,
    populatePartySelects,
    setupReadyButton,
    populateChallenger,
    handleReward,
    populateDaemonInspect,
    handleSessionStorage,
    initSessionStorage
}