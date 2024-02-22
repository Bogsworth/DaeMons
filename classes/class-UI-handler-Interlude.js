import { InterludeState } from "./class-interludeState.js";
import { Party } from "./class-party.js";

class InterludeUIHandler {
    constructor( interludeState = new InterludeState() ) {
        this.state = interludeState;
        this.partySelectArray = [
            'partySelect0',
            'partySelect1',
            'partySelect2'
        ];
        this.daemonSelectID = 'daemonListSelect';
        this.partySelects = [
            document.getElementById( this.partySelectArray[0] ),
            document.getElementById( this.partySelectArray[1] ),
            document.getElementById( this.partySelectArray[2] ),
        ];

        this.initUI();
    }

    initUI() {
        this.populatePartySelects();
        this.setInitialSelectOptions();
        this.keepSelectsUnique();
    }

    populatePartySelects() {
        this.partySelectArray
            .forEach( select => this.partySelectPopulator( select ));
    }

    partySelectPopulator( select ) {
        const UUID_ARRAY = this.state
            .allHeldMons
            .map( daemon => daemon.returnUUID() );
        const NAME_ARRAY = this.state
            .allHeldMons
            .map( daemon => daemon.returnName() );
        const ELEMENT = document.getElementById( select );
        
        this.populateSelect( NAME_ARRAY, UUID_ARRAY, select );
        ELEMENT.addEventListener( 'change', () => {
            this.keepSelectsUnique();
        });
    }

    keepSelectsUnique() {
        const NON_UNIQUE_INDEX = 0;
        const PARTY_SELECTS = this.partySelects;
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

    populateSelect(nameArray, uuidArray, selectID) {
        const SELECT = document.getElementById( selectID );
        let index = 0;
        
        this.removeSelectOptions( SELECT );
        nameArray.forEach( name => {
            const ELEMENT = document.createElement( 'option' );
            
            ELEMENT.textContent = name;
            ELEMENT.value = uuidArray[ index++ ];
            SELECT.appendChild( ELEMENT );
        })
    }

    setInitialSelectOptions() {
        let index = 0;
        console.log(this.state.currentParty.members)

        this.state.currentParty.members
            .map( daemon => daemon.returnUUID() )
            .forEach( uuid => this.partySelects[index++].value = uuid );
    }

    removeSelectOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for( i = L; i > 0; i-- ) {
            selectElement.remove(i);
        }
    }

    returnSelectedParty() {
        const DEFAULT_STRING = 'Pick a Daemon';
        const ALL_MONS_ARRAY = this.state.allHeldMons;
        const SELECTED_MONS_UUIDS = this.partySelects
            .map( select => select.value )
            .filter( value => value !== DEFAULT_STRING );
        const SELECTED_MONS = SELECTED_MONS_UUIDS
            .map( uuid => ALL_MONS_ARRAY
                .filter( daemon => daemon.returnUUID() === uuid ))
            .flat();
        const PARTY = new Party();

        PARTY.setParty( SELECTED_MONS );
        return PARTY;
    }

}
export { InterludeUIHandler }