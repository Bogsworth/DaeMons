function calculateDamage ( 
    data = {
        attack_stat: 40,
        defense_stat: 40,
        power_stat: 40
    }
) {
    const ATTACK = data.attack_stat;
    const DEFENSE = data.defense_stat;
    const POWER = data.power_stat;
    
    return ( ATTACK / DEFENSE ) * POWER;
}