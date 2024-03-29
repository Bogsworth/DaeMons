import * as calc from '../lib/Calculations.js'

class Message {
    constructor( battleState, isPlayerActive, chosenMove, damage ) {
        
        this._battleState = battleState;
        this._chosenMove = chosenMove;
        this._isPlayerActive = isPlayerActive;
        this._damage = damage;
        this._typeMod = calc.calculateTypeModifier
        (
            this.battleState.typeTable,
            this.chosenMove.type, 
            this.defendingMon.type
        );
        this._activeLock;
        this._templates;
        this._text = '';

        this.initFunc();
    }

    get battleState() { return this._battleState; }
    get chosenMove() { return this._chosenMove; }
    get isPlayerActive() { return this._isPlayerActive; }
    get damage() { return this._damage; }
    get attackingMon() { return this.returnAttacker(); }
    get defendingMon() { return this.returnDefender(); }
    get typeMod() { return this._typeMod; }
    get activeLock() { return this._activeLock; }
    get statsAffectedArray() { return this.chosenMove.statsAffectedArray }
    get templates() { return this._templates; }

    get text() { return this._text; }
    set addToText( string ) { this._text += string; }

    initFunc() {
        this.setActiveLock();
        this.initTemplates();
        this.initMessage();
    }

    initTemplates() {
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
            superEffective: {
                player: ` - it's super effective!`,
                enemy: ` - it's super effective!`
            },
            affectSelf: {},
            affectOther: {}
        }

        if ( moveAffectsStats ) {
            this.statsAffectedArray
                .forEach( effect => 
                    this.writeStatAffectTemplate( effect, templates )
                );
        }
        
        this._templates = templates;
    }

    writeStatAffectTemplate( effect, templates ) {
        const TARGET = effect[0]
        const STAT = effect[1];
        const IS_SELF_TARGETING = ( TARGET === 'self' );

        if ( IS_SELF_TARGETING ) {
            if ( this.isPlayerActive ) {
                templates.affectSelf.player = `Your ${this.attackingMon.name} `
                + `increased its ${STAT} stat`;
            }
            else {
                templates.affectSelf.enemy = `Enemy ${this.attackingMon.name} `
                + `increased its ${STAT} stat`;
            }
        }
        else {
            if ( this.isPlayerActive ) {
                templates.affectOther.player = `Your ${this.attackingMon.name} `
                + `reduced opponent's ${this.defendingMon.name} ${STAT} stat`;
            }
            else {
                templates.affectOther.enemy = `Enemy ${this.attackingMon.name} `
                + `reduced your ${this.defendingMon.name}'s ${STAT} stat`;
            }
        }
    }

    returnAttacker() {
        if ( this.isPlayerActive ) {
            return this.battleState.playerParty.activeMon;
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    returnDefender() {
        if ( ! this.isPlayerActive ) {
            return this.battleState.playerParty.activeMon
        }
        return this.battleState.enemyLock.party.activeMon;
    }

    setActiveLock() {
        let activeLock = 'enemy';
        
        if ( this.isPlayerActive ) {
            activeLock = 'player';
        }
        this._activeLock = activeLock;
    }

    initMessage() {
        let activeLock = this.activeLock;
        let didMoveHit = this.chosenMove.isHitOnLastUse;
        let isMoveDamaging = this.chosenMove.power !== 0;
        let isMoveStatAffecting = this.statsAffectedArray.length !== 0;
        let isMoveSuperEffective = ( this.typeMod > 1 ) && ( this.chosenMove.power != 0 )

        if ( ! didMoveHit ) {
            this.addToText = this.templates.missed[ activeLock ];
            return;
        }

        if ( isMoveDamaging ) {
            this.addToText = this.templates.didDamage[ activeLock ];
        }
        if ( isMoveStatAffecting ) {
            let isMoveSelfAffecting = Object
                .keys(this.templates.affectSelf).length !== 0;
            let isMoveOtherAffecting = Object.
                keys(this.templates.affectOther).length !== 0;

            if ( isMoveSelfAffecting ) {
                this.addToText = this.templates.affectSelf[ activeLock ];
            }
            if ( isMoveOtherAffecting ) {
                this.addToText = this.templates.affectOther[ activeLock ];
            }
        }
        if ( isMoveSuperEffective ) {
            this.addToText = this.templates.superEffective[ activeLock ];
        }
    }
}

export { Message }