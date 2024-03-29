function returnIDFromName( name, map ) {
    for ( let [ID, val] of map.entries() ) {
        if ( val['name'] == name ) {
            return ID;
        }
    }
    
    return false;
}

function calculateTypeModifier( typeTable, attMoveTyping, defMonTyping = [] ) {
    let multiplier = 1;

    defMonTyping.forEach( type => {
        multiplier *= typeTable[ attMoveTyping ][ `vs_${type}` ]
    })
    return multiplier;
}

function getRandomInt( max ) {
    return Math.floor( Math.random() * max );
}

export {
    returnIDFromName,
    calculateTypeModifier,
    getRandomInt
}