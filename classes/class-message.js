import * as calc from '../lib/Calculations.js'

class Message {
    constructor(battleState, activeFlag, chosenMove) {
        
        this.battleState = battleState;
        this.chosenMove = chosenMove;
        this.activeFlag = activeFlag;
        this.message = '';

        this.attackingMon = this.returnAttacker();
        this.defendingMon = this.returnDefender();

        this.typeMod = calc.calculateTypeModifier
        (
            this.battleState.TYPE_TABLE,
            this.chosenMove.returnType(), 
            this.defendingMon.returnType()
        );


        this.damage = calc.calculateDamage( {
            attacker: this.attackingMon,
            defender: this.defendingMon,
            move: this.chosenMove,
            typeModifier: this.typeMod
        } );
        this.statsAffectedArray = this.chosenMove.returnStatsAffectedArray();
        this.activeLock = this.setActiveLock();

        this.templates = this.createTemplates();
    }

    createTemplates() {
        let moveAffectsStats = this.chosenMove.returnStatAffectedBool();
        let templates = {
            didDamage: {
                player: `Your ${this.attackingMon.name} did ${this.damage} using ${this.chosenMove.name}`,
                enemy: `Enemy ${this.attackingMon.name} did ${this.damage} using ${this.chosenMove.name}`
            },
            missed: {
                player: `Your ${this.attackingMon.name} used ${this.chosenMove.name} but it missed...`,
                enemy: `Enemy ${this.attackingMon.name} used ${this.chosenMove.name} but it missed!`
            },
            failed: {
                player: 'but it failed...',
                enemy: 'but it failed!'
            },
            superEffective:{
                player: ` - it's super effective!`,
                enemy: ` - it's super effective!`
            }
        }
        if ( ! moveAffectsStats) {
            return templates;
        }

        this.statsAffectedArray.forEach( effect => {
            let target = effect[0]
            let stat = effect[1];
            let selfTargeting = ( target == 'self' );

            if ( selfTargeting ) {
                if ( this.activeFlag ) {
                    templates.affectSelf = {}
                    templates.affectSelf.player = `Your ${this.attackingMon.name} `
                    + `increased its ${stat} stat`
                }
                else {
                    templates.affectSelf = {}
                    templates.affectSelf.enemy = `Enemy ${this.attackingMon.name} `
                    + `increased its ${stat} stat`
                }
            }
            else {
                if ( this.activeFlag ) {
                    templates.affectOther = {}
                    templates.affectOther.player = `Your ${this.attackingMon.name} `
                    + `reduced opponent's ${this.defendingMon.name} ${stat} stat`
                }
                else {
                    templates.affectOther = {};
                    templates.affectOther.enemy = `Enemy ${this.attackingMon.name} `
                    + `reduced your ${this.defendingMon.name}'s ${stat} stat`
                }
            }
        });

        return templates;
    }

    returnAttacker() {
        if (this.activeFlag) {
            return this.battleState.playerParty.activeMon;
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    returnDefender() {
        if (! this.activeFlag) {
            return this.battleState.playerParty.activeMon
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    setActiveLock() {
        if (this.activeFlag) {
            return 'player';
        }
        else {
            return 'enemy';
        }
    }

    returnMessage() {
        let activeLock = this.setActiveLock();
        let moveHits = this.chosenMove.checkIfHit();
        let moveDoesDamage = ( this.chosenMove.returnPower() != 0 );
        let moveAffectsStats = (this.statsAffectedArray.length != 0);
        let moveSuperEffective = ( this.typeMod > 1 ) && ( this.chosenMove.power != 0 )

        if ( ! moveHits ) {
            this.message += this.templates.missed[ activeLock ];
            return this.message;
        }
        if ( moveDoesDamage ) {
            this.message += this.templates.didDamage[ activeLock ];
        }
        if ( moveAffectsStats ) {
            if ( this.templates.affectSelf ) {
                console.log(this.templates)
                this.message += this.templates.affectSelf[ activeLock ];
            }
            if (this.templates.affectOther ) {
                this.message += this.templates.affectOther[ activeLock ];
            }
        }
        if ( moveSuperEffective ) {
            this.message += this.templates.superEffective[ activeLock ];
        }

        return this.message;
    }


}

export { Message }