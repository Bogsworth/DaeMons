class UIHandler {
    constructor( battleState ) {
        this._battleState = battleState;
        this._moveArrayId = [[
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
        this._divIds = {
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

    get battleState() { return this._battleState; }
    // get moveArrayId() { return this._moveArrayId; }
    get divIds() { return this._divIds; }

    set battleState( state ) { this._battleState = state; }

    handlerInit() {
        this.changeHeader( this.generateHeaderFromWarlock() );
        this.updateMons();
        this.monButtonsInit();
        this.attachFightButtons();
        this.populateSelectInit();
        this.updateInfoBox( this._battleState.playerParty.activeMon );
    }

    changeHeader( newHeader ) {
        const ELEMENT = document.getElementById(this._divIds.header);

        ELEMENT.textContent = newHeader;
    }

    generateHeaderFromWarlock () {
        const NAME = this._battleState.enemyLock.name;
        const TITLE = `Fight with ${NAME}`;
    
        console.log( TITLE );
        return TITLE;
    }

    updateMons() {
        this.updateName();
        this.updateShownHP();
    }

    updateName() {
        let nameChanges = new Map([
            [
                this._divIds.yourMon.name,
                this._battleState.playerParty.activeMon.name
            ],
            [
                this._divIds.theirMon.name,
                this._battleState.enemyLock.party.activeMon.name
            ]
        ])
        for ( let [ key, val ] of nameChanges ) {
            document.getElementById( key ).innerHTML = val;
        } 
    }

    updateShownHP() {
        let hpChanges = new Map([
            [
                this._divIds.yourMon.HP,
                this._battleState
                    .playerParty
                    .activeMon
                    .currentHPReadable
            ],
            [
                this._divIds.theirMon.HP,
                this._battleState
                    .enemyLock
                    .party
                    .activeMon
                    .currentHPReadable
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
                    () => HANDLER.expandInfoBox( buttId, HANDLER._battleState ),
                    buttId
                )
            )   
    }

    attachFightButtons() {
        this.attachButtonId
        (
            () => this._battleState.handleAttack(),
            'attack'
        );
        this.attachButtonId
        (
            () => this._battleState.handleSwitch(),
            'switch'
        );
        this.attachButtonId( this.handleOk, 'ok' );
    }

    populateSelectInit() {
        this.populateSelect(
                this._battleState
                    .playerParty
                    .members
                    .map( daemon => daemon.name ),
                'selectMons'
        )
        this.populateSelect(
            this._battleState
                .playerParty
                .activeMon
                .moves
                .filter( move => move !== null )
                .map( move => move.name ),
            'selectMoves'
        )       
    }

    populateSelect( array, selectID ) {
        const SELECT = document.getElementById( selectID );
        
        this.removeSelectOptions( SELECT );
        array.forEach( string => {
            let element = document.createElement('option');
            
            element.textContent = string;
            SELECT.appendChild( element );
        })
    }
    
    removeSelectOptions( selectElement ) {
        var i, L = selectElement.options.length - 1;
        for( i = L; i > 0; i-- ) {
            selectElement.remove( i );
        }
    }

    generateMonButtons() {
        let monArray = this._battleState.playerParty.members
        let infoDiv = document.getElementById( 'bottomBar' );
        let i = 0;
        let buttonIdArray = [];
        
        monArray.forEach(mon => {
            let newButt = document.createElement( 'button' );
            let idText = 'mon' + i++;
    
            newButt.textContent = mon.name;
            newButt.name = idText; 
            newButt.id = idText;
            infoDiv.appendChild( newButt );
    
            buttonIdArray.push( idText );
        })
    
        return buttonIdArray;
    }

    attachButtonId( doFunction, elementId ) {
        let el = document.getElementById( elementId );
    
        document.addEventListener( "DOMContentLoaded", () => {
            el.addEventListener( "click", doFunction, false );
        })
    }

    expandInfoBox( buttonId, state ) {
        let elBar = document.getElementById( 'expandingBottomBar' );
        let hiddenElementMatcher = document.getElementById( 'buttonMatcher' );
        let currentText = hiddenElementMatcher.textContent;
    
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

    updateInfoBox( mons, buttId = false ) {
        let myMon;
        if ( buttId == false ) {
            myMon = mons;
        }
        else {
            let buttNumb = buttId.slice(-1)
            myMon = mons[ buttNumb ];
        }
    
        let constructorMap = new Map([
            ['statInfo0', myMon.type],
            ['statInfo1', myMon.statAttack],
            ['statInfo2', myMon.statDefense],
            ['statInfo3', myMon.statSpeed],
            ['expandedMon', myMon.name],
            ['expandedMonHP', myMon.currentHPReadable]
        ]);
    
        for ( let i = 0; i < myMon.returnTotalMovesKnown(); i++ ) {
            let currentMoveIds = this._moveArrayId[ i ];
            let currentMove = myMon.moves[ i ];
    
            constructorMap.set( currentMoveIds[0], currentMove.name );
            constructorMap.set( currentMoveIds[1], currentMove.type );
            constructorMap.set( currentMoveIds[2], currentMove.power );
            constructorMap.set( currentMoveIds[3], currentMove.usesReadable );
            constructorMap.set( currentMoveIds[4], currentMove.accuracy );
            constructorMap.set( currentMoveIds[5], currentMove.statsAffectedArray );
            constructorMap.set( currentMoveIds[6], currentMove.description );
        }
    
        constructorMap.forEach(( info, id ) => {
            let el = document.getElementById( id );
    
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
        const CURRENT_NAME = this._battleState.playerParty.activeMon.name;
        const PARTY = this._battleState.playerParty.members;
        const ACTIVE_MON = this._battleState.playerParty.activeMon;

        if ( CHOSEN_MON_INDEX == -1 ) {
            this.writeToMessageBox( 'Actually pick a Daemon before switching.'); 
            return false;
        }
        else if ( PARTY[ CHOSEN_MON_INDEX ].isDead ) {
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
        const ACTIVE_MON = this._battleState.playerParty.activeMon;
        const CHOSEN_MOVE_INDEX = document
            .getElementById( 'selectMoves' )
            .options
            .selectedIndex;
        const CHOSEN_MOVE = ACTIVE_MON.moves[ CHOSEN_MOVE_INDEX - 1];

        if ( CHOSEN_MOVE_INDEX == 0 ) {
            this.writeToMessageBox('Pick a move before attacking.');
            return false;
        }
        else if ( ACTIVE_MON.isDead ) {
            this.writeToMessageBox( `Your Daemon is dead, choose a new one` );
            return false;
        }
        else if ( CHOSEN_MOVE.usesRemaining <= 0 ) {
            this.writeToMessageBox( `You have no more uses of that move` );
            return false;
        }
        else {
            return true;
        }
    }

    writeToMessageBox( message ) {
        const ID = this._divIds.messageBoxId;
        const element = document.getElementById( ID );

        console.log( message );
        element.textContent = message;
        return;
    }

    preRoundInit(btnResolver) {
        const btn = document.getElementById( 'ok' );

        btn.addEventListener( 'click', btnResolver );
        this.disableButtons();
    }

    postRoundCleanUp( btnResolver ) {
        const btn = document.getElementById( 'ok' );

        this.enableButtons();
        btn.removeEventListener( 'click', btnResolver );
        this.writeToMessageBox( 'What do you want to do?' );
    }

    disableButtons( buttNames = [ 'attack', 'switch' ] ) {
        buttNames.forEach( name => this.disableButton( name ));
    }

    disableButton( name ) {
        let element = document.getElementsByName( name )[0];
        element.disabled = true;
    }
    
    enableButtons( buttNames = [ 'attack', 'switch' ] ) {
        buttNames.forEach( name => this.enableButton( name ));
    }

    enableButton( name ) {
        let element = document.getElementsByName( name )[0];
        element.disabled = false;
    }

}

export { UIHandler }