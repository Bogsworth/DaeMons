class UIHandler {
    constructor(battleState) {
        this.battleState = battleState;
        this.moveArrayId = [[
            'moveName0',
            'moveType0',
            'movePower0',
            'moveUses0',
            'moveAccuracy0',
            'moveStatsAffected0',
            'moveDesc0'
        ],
        [
            'moveName1',
            'moveType1',
            'movePower1',
            'moveUses1',
            'moveAccuracy1',
            'moveStatsAffected1',
            'moveDesc1'
        ],
        [
            'moveName2',
            'moveType2',
            'movePower2',
            'moveUses2',
            'moveAccuracy2',
            'moveStatsAffected2',
            'moveDesc2'
        ],
        [
            'moveName3',
            'moveType3',
            'movePower3',
            'moveUses3',
            'moveAccuracy3',
            'moveStatsAffected3',
            'moveDesc3'
        ]];
        this.divIds = {
            yourMon:{
                HP: 'yourMonHP',
                name: 'yourMon'
            },
            theirMon: {
                HP: 'theirMonHP',
                name: 'theirMon'
            },
            messageBoxId: 'messageBox',
            header: 'header'
        }

        this.handlerInit();
    }

    handlerInit() {
        this.changeHeader(this.generateHeaderFromWarlock());
        this.updateMons();
        this.monButtonsInit();
        this.attachFightButtons();
        this.populateSelectInit();
        this.updateInfoBox(this.battleState.playerParty.activeMon);
    }

    changeHeader( newHeader ) {
        const ELEMENT = document.getElementById(this.divIds.header);

        ELEMENT.textContent = newHeader;
    }

    generateHeaderFromWarlock () {
        const NAME = this.battleState.enemyLock.name;
        const TITLE = `Fight with ${NAME}`;
    
        console.log(TITLE);
        return TITLE;
    }

    updateMons() {
        this.updateName();
        this.updateShownHP();
    }

    updateName() {
        let nameChanges = new Map([
            [
                this.divIds.yourMon.name,
                this.battleState.playerParty.activeMon.returnName()
            ],
            [
                this.divIds.theirMon.name,
                this.battleState.enemyLock.party.activeMon.returnName()
            ]
        ])
        for ( let [ key, val ] of nameChanges ) {
            document.getElementById( key ).innerHTML = val;
        } 
    }

    updateShownHP() {
        let hpChanges = new Map([
            [
                this.divIds.yourMon.HP,
                this.battleState
                    .playerParty
                    .activeMon
                    .returnCurrentHPReadable()
            ],
            [
                this.divIds.theirMon.HP,
                this.battleState
                    .enemyLock
                    .party
                    .activeMon
                    .returnCurrentHPReadable()
            ]
        ]);
        
        for ( let [ key, val ] of hpChanges ) {
            document.getElementById( key ).innerHTML = val;
        }    
    }

    monButtonsInit() {
        const HANDLER = this;

        this.generateMonButtons()
            .forEach(
                buttId => this.attachButtonId(
                    () => HANDLER.expandInfoBox( buttId, HANDLER.battleState ),
                    buttId
                )
            )   
    }

    attachFightButtons() {
        this.attachButtonId
        (
            () => this.battleState.handleAttack(),
            'attack'
        );
        this.attachButtonId
        (
            () => this.battleState.handleSwitch(),
            'switch'
        );
        this.attachButtonId( this.handleOk, 'ok' );
    }

    populateSelectInit() {
        this.populateSelect(
                this.battleState
                    .playerParty
                    .members
                    .map(daemon => daemon.returnName()),
                'selectMons'
        )
        this.populateSelect(
            this.battleState
                .playerParty
                .activeMon
                .returnMoves()
                .filter(move => move != null)
                .map(move => move.returnName()),
            'selectMoves'
        )       
    }

    populateSelect(array, selectID) {
        const SELECT = document.getElementById( selectID );
        
        this.removeSelectOptions( SELECT );
        array.forEach( string => {
            let element = document.createElement('option')
            
            element.textContent = string;
            SELECT.appendChild( element );
        })
    }
    
    removeSelectOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for( i = L; i > 0; i-- ) {
            selectElement.remove(i);
        }
    }

    generateMonButtons() {
        let monArray = this.battleState.playerParty.members
        let infoDiv = document.getElementById('bottomBar');
        let i = 0;
        let buttonIdArray = [];
        
        monArray.forEach(mon => {
            let newButt = document.createElement('button');
            let idText = 'mon' + i++;
    
            newButt.textContent = mon.returnName();
            newButt.name = idText; 
            newButt.id = idText;
            infoDiv.appendChild( newButt );
    
            buttonIdArray.push(idText);
        })
    
        return buttonIdArray;
    }

    attachButtonId( doFunction, elementId ) {
        let el = document.getElementById( elementId );
    
        document.addEventListener("DOMContentLoaded", () => {
            el.addEventListener("click", doFunction, false);
        })
    }

    expandInfoBox( buttonId, state ) {
        let elBar = document.getElementById( 'expandingBottomBar' );
        let hiddenElementMatcher = document.getElementById( 'buttonMatcher' );
        let currentText = hiddenElementMatcher.textContent
    
        if (
            ! ( elBar.style.flexGrow == 0 ) &&
            currentText == buttonId
        ) {
            elBar.style.flexGrow = 0;
        }
        else {
            elBar.style.flexGrow = 1;
            // Update info
    
            this.updateInfoBox( state.playerParty.members, buttonId );
            hiddenElementMatcher.textContent = buttonId;
        }   
    }

    updateInfoBox( mons, buttId = false) {
        let myMon;
        if (buttId == false ) {
            myMon = mons;
        }
        else {
            let buttNumb = buttId.slice(-1)
            myMon = mons[ buttNumb ];
        }
    
        let constructorMap = new Map([
            ['statInfo0', myMon.returnType()],
            ['statInfo1', myMon.returnAttackStat()],
            ['statInfo2', myMon.returnDefenseStat()],
            ['statInfo3', myMon.returnSpeedStat()],
            ['expandedMon', myMon.returnName()],
            ['expandedMonHP', myMon.returnCurrentHPReadable()]
        ]);
    
        for (let i = 0; i < myMon.returnTotalMovesKnown(); i++) {
            let currentMoveIds = this.moveArrayId[i];
            let currentMove = myMon.moves[i];
    
            constructorMap.set(currentMoveIds[0], currentMove.returnName());
            constructorMap.set(currentMoveIds[1], currentMove.returnType());
            constructorMap.set(currentMoveIds[2], currentMove.returnPower());
            constructorMap.set(currentMoveIds[3], currentMove.returnUsesReadable());
            constructorMap.set(currentMoveIds[4], currentMove.returnAccuracy());
            constructorMap.set(currentMoveIds[5], currentMove.returnStatsAffectedArray());
            constructorMap.set(currentMoveIds[6], currentMove.returnDescription());
        }
    
        constructorMap.forEach((info, id) => {
            let el = document.getElementById(id);
    
            el.textContent = info;
        }) 
    }

    handleOk() {
        console.log('ok button pressed');
    }

    monSwitchChecker() {
        const CHOSEN_MON_INDEX = document
            .getElementById( 'selectMons' )
            .options
            .selectedIndex - 1;
        const CURRENT_NAME = this.battleState.playerParty.activeMon.returnName();
        const PARTY = this.battleState.playerParty.members;
        const ACTIVE_MON = this.battleState.playerParty.activeMon;

        if ( CHOSEN_MON_INDEX == -1 ) {
            this.writeToMessageBox( 'Actually pick a Daemon before switching.'); 
            return false;
        }
        else if ( PARTY[ CHOSEN_MON_INDEX ].returnCurrentHP() <= 0 ) {
            this.writeToMessageBox( `That Daemon is dead and gone, you cannot switch to them.` );
            return false;
        }
        else if ( CHOSEN_MON_INDEX == PARTY.indexOf(ACTIVE_MON) ) {
            this.writeToMessageBox( 'Pick a Daemon that is not currently active.' );
            return false;
        }
        else {
            this.writeToMessageBox( `You sever your mind link with ${CURRENT_NAME}` );
            return true;
        }
    }

    monFightChecker() {
        const ACTIVE_MON = this.battleState.playerParty.activeMon
        const CHOSEN_MOVE_INDEX = document
            .getElementById( 'selectMoves' )
            .options
            .selectedIndex;
        const CHOSEN_MOVE = ACTIVE_MON.returnMoves()[ CHOSEN_MOVE_INDEX - 1];

        if ( CHOSEN_MOVE_INDEX == 0 ) {
            this.writeToMessageBox('Pick a move before attacking.')
            return false;
        }
        else if ( ACTIVE_MON.returnCurrentHP() <= 0 ) {
            this.writeToMessageBox( `Your Daemon is dead, choose a new one` );
            return false;
        }
        else if ( CHOSEN_MOVE.returnUses() <= 0 ) {
            this.writeToMessageBox( `You have no more uses of that move` );
            return false;
        }
        else {
            return true;
        }
    }

    writeToMessageBox( message ) {
        const ID = this.divIds.messageBoxId;
        const element = document.getElementById( ID );

        console.log(message);
        element.textContent = message;
        return;
    }

    preRoundInit(btnResolver) {
        const btn = document.getElementById('ok');

        btn.addEventListener( 'click', btnResolver );
        this.disableButtons();
    }

    postRoundCleanUp(btnResolver) {
        const btn = document.getElementById('ok');

        this.enableButtons();
        btn.removeEventListener( 'click', btnResolver );
        this.writeToMessageBox( 'What do you want to do?' );
    }

    disableButtons(buttNames = [ 'attack', 'switch']) {
        buttNames.forEach( name => {
            this.disableButton(name);
        })
    }
    
    enableButtons(buttNames = [ 'attack', 'switch']) {
        buttNames.forEach( name => {
            this.enableButton(name);
        })
    }

    disableButton( name ) {
        let element = document.getElementsByName( name )[0];
        element.disabled = true;
    }
    
    enableButton( name ) {
        let element = document.getElementsByName( name )[0];
        element.disabled = false;
    }

}

export { UIHandler }