import { InterludeState } from "./class-interludeState.js";
import { Party } from "./class-party.js";

class InterludeUIHandler {
    constructor( interludeState = new InterludeState() ) {
        this._state = interludeState;
        this._partySelectArray = [
            'partySelect0',
            'partySelect1',
            'partySelect2'
        ];
        this._partySelects = [
            document.getElementById( this._partySelectArray[0] ),
            document.getElementById( this._partySelectArray[1] ),
            document.getElementById( this._partySelectArray[2] ),
        ];
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

        this.initUI();
    }

    get selectedParty() { return this.selectedPartyGetter(); }

    initUI() {
        this.populatePartySelects();
        this.setInitialSelectOptions();
        this.keepSelectsUnique();
        this.populateNextFight();

        this.monButtonsInit();
        this.updateInfoBox( this._state.allHeldMons );
    }

    monButtonsInit() {
        const HANDLER = this;

        this.generateMonButtons()
            .forEach(
                buttId => this.attachButtonId(
                    () => HANDLER.expandInfoBox( buttId, HANDLER._state ),
                    buttId
                )
            )   
    }

    generateMonButtons() {
        let monArray = this._state.allHeldMons;
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
            this.updateInfoBox( state.allHeldMons, buttonId );
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
    
        for ( let i = 0; i < myMon.movesNumberKnown; i++ ) {
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

    populatePartySelects() {
        this._partySelectArray
            .forEach( select => this.partySelectPopulator( select ));
    }

    partySelectPopulator( select ) {
        const UUID_ARRAY = this._state
            .allHeldMons
            .map( daemon => daemon.uuid );
        const NAME_ARRAY = this._state
            .allHeldMons
            .map( daemon => daemon.name );
        const ELEMENT = document.getElementById( select );
        
        this.populateSelect( NAME_ARRAY, UUID_ARRAY, select );
        ELEMENT.addEventListener( 'change', () => {
            this.keepSelectsUnique();
        });
    }

    populateSelect( nameArray, uuidArray, selectID ) {
        const SELECT = document.getElementById( selectID );
        let index = 0;
        
        removeSelectOptions( SELECT );
        nameArray.forEach( name => {
            const ELEMENT = document.createElement( 'option' );
            
            ELEMENT.textContent = name;
            ELEMENT.value = uuidArray[ index++ ];
            SELECT.appendChild( ELEMENT );
        })

        function removeSelectOptions( selectElement ) {
            var i, L = selectElement.options.length - 1;
            for( i = L; i > 0; i-- ) {
                selectElement.remove( i );
            }
        }
    }

    setInitialSelectOptions() {
        let index = 0;
        console.log( this._state.currentParty.members );

        this._state.currentParty.members
            .map( daemon => daemon.uuid )
            .forEach( uuid => this._partySelects[ index++ ].value = uuid );
    }

    keepSelectsUnique() {
        const NON_UNIQUE_INDEX = 0;
        const PARTY_SELECTS = this._partySelects;
        const INDEX_ARRAY = PARTY_SELECTS
            .map( element => element.selectedIndex );
        
        PARTY_SELECTS.forEach( element => {
            enableAllOptions( element );
            INDEX_ARRAY
                .filter( index => index !== NON_UNIQUE_INDEX )
                .forEach( index => element.options[index].disabled = true )
        });
    
        function enableAllOptions( selectElement ) {
            // This is just from StackOverflow >_<
            for ( let i = 0; i < selectElement.options.length; i++ ) {
                selectElement.options[i].disabled = false;
            }
        }
    }

    selectedPartyGetter() {
        const DEFAULT_STRING = 'Pick a Daemon';
        const ALL_MONS_ARRAY = this._state.allHeldMons;
        const SELECTED_MONS_UUIDS = this._partySelects
            .map( select => select.value )
            .filter( value => value !== DEFAULT_STRING );
        const SELECTED_MONS = SELECTED_MONS_UUIDS
            .map( uuid => ALL_MONS_ARRAY
                .filter( daemon => daemon.uuid === uuid ))
            .flat();
        const PARTY = new Party();

        PARTY.setParty( SELECTED_MONS );
        return PARTY;
    }

    populateNextFight() {
        const NEXT_LOCK = this._state.nextLock;
        const NAME_ID = 'lockName';
        const DESC_ID = 'lockDescription';
        const NAME_ELEMENT = document.getElementById( NAME_ID );
        const DESCRIPTION_ELEMENT = document.getElementById( DESC_ID );

        NAME_ELEMENT.textContent = NEXT_LOCK.name;
        DESCRIPTION_ELEMENT.textContent = NEXT_LOCK.description;
    }

}
export { InterludeUIHandler }