import * as util from './lib/utility.js'

function createStarterSection( daemon, optionId ) {
    const NAME = daemon.returnName();
    const TYPE = typeToReadable(daemon.returnType());
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
    util.savePostFightParty( [chosenMon] );
}

// Helper functions
function typeToReadable( typeArray ) {
    if ( typeArray.length == 1 ) {
        return typeArray[0];
    }
    else if ( typeArray.length == 2) {
        return `${typeArray[0]}, ${typeArray[1]}`;
    }
}

export {
    createStarterSection,
    startGame
}