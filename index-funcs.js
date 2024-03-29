import { Party } from './classes/class-party.js';

function createStarterSection( daemon, optionId ) {
    const NAME = daemon.name;
    const TYPE = daemon.typeAsString;
    const DESC = `The daemon ${NAME} is a pretty cool dude.`      
    let elIdMap = new Map([
        ['option0', ['name0', 'type0', 'desc0']],
        ['option1', ['name1', 'type1', 'desc1']],
        ['option2', ['name2', 'type2', 'desc2']]
    ]);
    let idArray = elIdMap.get( optionId );
    let infoArray = [ NAME, TYPE, DESC ];

    idArray.forEach( elementId => {
        let i = idArray.indexOf( elementId );
        let el = document.getElementById( elementId );

        el.textContent = infoArray[i];
    });
}

function startGame( chosenMon ) {
    // util.savePostFightParty( [chosenMon] );
    let party = new Party()
    party.addMonToParty( chosenMon )
    party.saveToLocation();
    console.log( sessionStorage )

    window.location.href = "./src/pages/battle/battle.html"

}

export {
    createStarterSection,
    startGame
}