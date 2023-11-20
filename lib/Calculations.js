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
    const MODIFIER = type_modifier;
    
    return MODIFIER * ( ATTACK / DEFENSE ) * POWER;
};

function returnMonID( name, monMap ) {
    for ( let [key, val] of monMap.entries() ) {
        if ( val['name'] == name ) {
            return key;
        }
    }
    
    return false;
}
