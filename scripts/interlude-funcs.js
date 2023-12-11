import * as parse from '../lib/Import.js'
import * as calc from '../lib/Calculations.js'

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
    console.log('Im in loadBattle')
    window.location.href = './index.html'
}

export {
    populateNextFight,
    updateDaemonSummary,
    loadBattle
}