import * as parse from './Import.js';

function calculateDamage ( data = {
    attacker: "",
    defender: "",
    move: "",
    typeModifier: ""
}) {
    const MOVE = data.move;
    const POWER = MOVE.returnPower()
    const TYPE_MOD = data.typeModifier;

    const MODIFIED_ATT = data.attacker.returnModifiedStat( 'attack' );
    let MODIFIED_DEF = data.defender.returnModifiedStat( 'defense' );
    if (MODIFIED_DEF < 1) {
        MODIFIED_DEF = 1;
    }

    let results = 0.4 * ( TYPE_MOD * ( MODIFIED_ATT / MODIFIED_DEF ) * POWER );
    if ( results < 1  && POWER != 0 ) {
        results = 1;
    }

    return Math.round( results );
}

function modifyStat( stat, modifier ) {
    let modifiedStat = stat * ( 10 + (modifier/2) ) / 10 ;
    return modifiedStat;
}

// TO REMOVE, in move class
function checkIfHit( move ) {
    const HIT_CHANCE = move.accuracy / 100;
    const RAND = Math.random();

    if ( RAND > HIT_CHANCE ) {
        return false;
    }
    else {
        return true;
    }
}

function returnIDFromName( name, map ) {
    for ( let [ID, val] of map.entries() ) {
        if ( val['name'] == name ) {
            return ID;
        }
    }
    
    return false;
}

// function returnTrainersOfTier( tier ) {
//     let locks = parse.createWarlocks();
//     let locksOfTier = [];

//     locks.forEach( lock => {
//         if ( lock.tier == tier ) {
//             locksOfTier.push( lock );
//         }
//     })

//     return locksOfTier;
// }

function returnWithMatchingParamters( list, parameter, matcher ) {
    let subArray = [];

    list.forEach( element => {
        if ( element[parameter] == matcher ) {
            subArray.push( element );
        }
    })

    return subArray;
}

function calculateTypeModifier( typeTable, attMoveTyping, defMonTyping = [] ) {
    let multiplier = 1;

    defMonTyping.forEach( type => {
        multiplier *= typeTable[attMoveTyping][`vs_${type}`]
    })
    return multiplier;
}

function getRandomInt( max ) {
    return Math.floor(Math.random() * max);
}

export {
    calculateDamage,
    modifyStat,
    checkIfHit,
    returnIDFromName,
    returnWithMatchingParamters,
    calculateTypeModifier,
    //returnTrainersOfTier,
    getRandomInt
}