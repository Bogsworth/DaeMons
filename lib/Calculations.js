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
    const MODIFIED_DEF = data.defender.returnModifiedStat( 'defense' );

    let results = 0.4 * ( TYPE_MOD * ( MODIFIED_ATT / MODIFIED_DEF ) * POWER );

    return Math.round( results );
}

function modifyStat( stat, modifier ) {
    let modifiedStat = stat * ( 10 + modifier ) / 10 ;
    return modifiedStat;
}

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
    calculateTypeModifier,
    getRandomInt
}