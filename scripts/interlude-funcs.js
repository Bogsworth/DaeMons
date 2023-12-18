import * as parse from '../lib/Import.js'
import * as calc from '../lib/Calculations.js'
import * as scripts from './script-funcs.js'

function populateNextFight( warlock ) {
    const NAME_ID = 'lockName';
    const DESC_ID = 'lockDescription';

    let nameEl = document.getElementById( NAME_ID );
    let descEl = document.getElementById( DESC_ID );

    nameEl.textContent = warlock.name;
    descEl.textContent = warlock.description;
}

function updateDaemonSummary() {
    const MON_TABLE = parse.createMonTable();
    const IDs = {
        summary: "monSummary",
        type: "monType",
    };
    const SELECT_ID = 'daemonListSelect';
    const SELECT = document.getElementById( SELECT_ID );
    const SELECTED_NAME = SELECT[SELECT.selectedIndex].textContent;
    const SELECTED_MON = MON_TABLE.get( calc.returnIDFromName( SELECTED_NAME, MON_TABLE ))

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
}

function loadBattle() {
    console.log('Im in loadBattle');
    window.location.href = './battle.html';
}

function populateParty( currentPartyJSON, selectElements, allDaemons ) {
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

    populateNextFight( nextLock );
}

function populateDaemonInspect() {
    const SELECT_ID = 'daemonListSelect';
    const SEL_ELEMENT = document.getElementById(SELECT_ID);
    
    SEL_ELEMENT.addEventListener( 'change', updateDaemonSummary );
}

export {
    populateNextFight,
    updateDaemonSummary,
    loadBattle,
    populateParty,
    setupReadyButton,
    populateChallenger,
    populateDaemonInspect
}