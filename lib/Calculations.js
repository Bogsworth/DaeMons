import * as parse from './Import.js';

function calculateDamage ( data = {
    attacker: "",
    defender: "",
    move: "",
    typeModifier: ""
}) {
    const POWER = data.move.power;
    const TYPE_MOD = data.typeModifier;

    const MODIFIED_ATT = data.attacker.statAttackModified;
    const MODIFIED_DEF = data.defender.statDefenseModified;

    let results = 0.4 * ( TYPE_MOD * ( MODIFIED_ATT / MODIFIED_DEF ) * POWER );
    if ( results < 1 && POWER !== 0 ) {
        results = 1;
    }

    return Math.round( results );
}

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
    calculateDamage,
    returnIDFromName,
    calculateTypeModifier,
    getRandomInt
}