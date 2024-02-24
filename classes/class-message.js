import * as calc from '../lib/Calculations.js'

class Message {
    constructor( battleState, isPlayerActive, chosenMove, damage ) {
        
        this.battleState = battleState;
        this.chosenMove = chosenMove;
        this.isPlayerActive = isPlayerActive;
        this.moveHit = chosenMove.isHitOnLastUse;
        this.damage = damage;
        this.message = '';

        this.attackingMon = this.returnAttacker();
        this.defendingMon = this.returnDefender();

        this.typeMod = calc.calculateTypeModifier
        (
            this.battleState.typeTable,
            this.chosenMove.type, 
            this.defendingMon.type
        );

        this.statsAffectedArray = this.chosenMove.statsAffectedArray;
        this.activeLock = this.setActiveLock();

        this.templates = this.createTemplates();
    }

    createTemplates() {
        let moveAffectsStats = this.chosenMove.isStatsAffected;
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
            const TARGET = effect[0]
            const STAT = effect[1];
            const IS_SELF_TARGETING = ( TARGET === 'self' );

            if ( IS_SELF_TARGETING ) {
                if ( this.isPlayerActive ) {
                    templates.affectSelf = {}
                    templates.affectSelf.player = `Your ${this.attackingMon.name} `
                    + `increased its ${STAT} stat`
                }
                else {
                    templates.affectSelf = {}
                    templates.affectSelf.enemy = `Enemy ${this.attackingMon.name} `
                    + `increased its ${STAT} stat`
                }
            }
            else {
                if ( this.isPlayerActive ) {
                    templates.affectOther = {}
                    templates.affectOther.player = `Your ${this.attackingMon.name} `
                    + `reduced opponent's ${this.defendingMon.name} ${STAT} stat`
                }
                else {
                    templates.affectOther = {};
                    templates.affectOther.enemy = `Enemy ${this.attackingMon.name} `
                    + `reduced your ${this.defendingMon.name}'s ${STAT} stat`
                }
            }
        });

        return templates;
    }

    returnAttacker() {
        if (this.isPlayerActive) {
            return this.battleState.playerParty.activeMon;
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    returnDefender() {
        if (! this.isPlayerActive) {
            return this.battleState.playerParty.activeMon
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    setActiveLock() {
        if (this.isPlayerActive) {
            return 'player';
        }
        else {
            return 'enemy';
        }
    }

    returnMessage() {
        let activeLock = this.setActiveLock();
        let isMoveDamaging = this.chosenMove.power !== 0;
        let isMoveStatAffecting = this.statsAffectedArray.length !== 0;
        let isMoveSuperEffective = ( this.typeMod > 1 ) && ( this.chosenMove.power != 0 )

        if ( ! this.moveHit ) {
            this.message += this.templates.missed[ activeLock ];
            return this.message;
        }
        if ( isMoveDamaging ) {
            this.message += this.templates.didDamage[ activeLock ];
        }
        if ( isMoveStatAffecting ) {
            if ( this.templates.affectSelf ) {
                this.message += this.templates.affectSelf[ activeLock ];
            }
            if (this.templates.affectOther ) {
                this.message += this.templates.affectOther[ activeLock ];
            }
        }
        if ( isMoveSuperEffective ) {
            this.message += this.templates.superEffective[ activeLock ];
        }

        return this.message;
    }
}

export { Message }