import * as parse from '../../../lib/Import.js'
import * as calc from '../../../lib/Calculations.js'
import * as scripts from '../battle/script-funcs.js'

function populateNextFight( warlock ) {
    const NAME_ID = 'lockName';
    const DESC_ID = 'lockDescription';

    let nameEl = document.getElementById( NAME_ID );
    let descEl = document.getElementById( DESC_ID );

    nameEl.textContent = warlock.name;
    descEl.textContent = warlock.description;
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

function loadBattle() {
    console.log('Im in loadBattle');
    importPartyChoices();
    //return;
    window.location.href = '../battle/battle.html';
}

function importPartyChoices() {
    let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect'];
    let partySelects = [
        document.getElementById( selectArray[0] ),
        document.getElementById( selectArray[1] ),
        document.getElementById( selectArray[2] ),
    ];
    console.log('in importPartyChoices()')
    //sessionStorage.currentParty = '';
    let tempStorage = [];

    partySelects.forEach( select => {
        if ( select.selectedIndex == 0) {
            return;
        }
        let selectedMonJSON = select.value
        //console.log(selectedMonJSON);
        tempStorage.push(selectedMonJSON);
    })

    sessionStorage.currentParty = JSON.stringify(tempStorage);
    console.log(sessionStorage.currentParty)
}

function populatePartySelects( currentPartyJSON, selectElements, allDaemons ) {
    let currentParty = JSON.parse( currentPartyJSON );
    let i = 0;

    currentParty.forEach( mon => {
        scripts.setDefaultSelectValue(selectElements[i++], mon.name );
    });
}

function setupReadyButton() {
    const READY_BTN_NAME = 'startFight';
    const READY_BTN = document.getElementsByName(READY_BTN_NAME)[0];
    
    READY_BTN.addEventListener('click', loadBattle);
}

function populateChallenger() {
    let warlocks = parse.createWarlocks();
    let nextLock = warlocks.get( calc.returnIDFromName('Mirror-You', warlocks));

    sessionStorage.nextLock = JSON.stringify(nextLock);
    console.log(sessionStorage)
    populateNextFight( nextLock );
}

function handleReward( rewardString, FULL_DAEMON_LIST, currentParty ) {
    let reward = JSON.parse(rewardString);
    let rewardID = calc.returnIDFromName( reward.name, FULL_DAEMON_LIST );
    let moveMap = parse.createMoveTable();
    console.log('in handleReward')
    console.log(reward.name)
    console.log(rewardID)
    console.log( FULL_DAEMON_LIST.has(rewardID) )
    console.log(FULL_DAEMON_LIST)
    if ( ! FULL_DAEMON_LIST.has(rewardID) ) {
        return;
    }
    console.log(FULL_DAEMON_LIST.get(rewardID))
    // TODO: see if we need to clone the newDaemon
    let newDaemon = FULL_DAEMON_LIST.get(rewardID);
    
    reward.moves.forEach( move =>{
        if (move == null) {
            return;
        }
        
        parse.addMove( move, newDaemon, reward, moveMap)
    })
    currentParty.push( newDaemon) ;
}

function populateDaemonInspect() {
    const SELECT_ID = 'daemonListSelect';
    const SEL_ELEMENT = document.getElementById(SELECT_ID);

    const MOVE_SEL_ID = 'moveSelect';
    const MOVE_SEL_EL = document.getElementById( MOVE_SEL_ID );
    
    SEL_ELEMENT.addEventListener( 'change', updateDaemonSummary );
    MOVE_SEL_EL.addEventListener( 'change', updateMoveStats);

}

export {
    populateNextFight,
    updateDaemonSummary,
    loadBattle,
    populatePartySelects as populateParty,
    setupReadyButton,
    populateChallenger,
    handleReward,
    populateDaemonInspect
}