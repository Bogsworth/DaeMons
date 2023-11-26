function calculateDamage ( 
    data = {
        attack_stat: 40,
        defense_stat: 40,
        power_stat: 40,
        type_modifier: 1,
    }
) {
    const ATTACK = data.attack_stat;
    const DEFENSE = data.defense_stat;
    const POWER = data.power_stat;
    const MODIFIER = data.type_modifier;
    
    return Math.round( 0.4 * ( MODIFIER * ( ATTACK / DEFENSE ) * POWER ));
};

function returnIDFromName( name, map ) {
    for ( let [key, val] of map.entries() ) {
        if ( val['name'] == name ) {
            return key;
        }
    }
    
    return false;
}

function calculateTypeModifier( typeTable, attMoveTyping, defMonTyping = [] ) {
    let multiplier = 1;

    console.log(typeTable)

    defMonTyping.forEach( type => {
        multiplier *= typeTable[attMoveTyping][`vs_${type}`]
    })
    return multiplier;
}

export {
    calculateDamage,
    returnIDFromName,
    calculateTypeModifier
}