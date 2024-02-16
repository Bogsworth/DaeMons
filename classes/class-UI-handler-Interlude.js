import { InterludeState } from "./class-interludeState.js";

class UIHandlerInt {
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

        this.populatePartySelects();
    }

    populatePartySelects() {
        this.partySelectArray
            .forEach( select => this.partySelectPopulator( select ))
    }

    partySelectPopulator( select ) {
        const UUID_ARRAY = this.state
            .currentParty
            .members.map( daemon => daemon.returnUUID() );
        const NAME_ARRAY = this.state
            .currentParty
            .members.map( daemon => daemon.returnName() );
        const ELEMENT = document.getElementById( select );
        
        this.populateSelect( NAME_ARRAY, UUID_ARRAY, select );
        ELEMENT.addEventListener( 'change', () => {
            this.keepSelectsUnique();
        });
    }

    keepSelectsUnique() {
        const INDEX_ARRAY = [];
        const NON_UNIQUE_INDEX = 0;
        const PARTY_SELECTS = this.partySelects;
    
        PARTY_SELECTS.forEach( element => {
            enableAllOptions( element );
            INDEX_ARRAY.push(element.selectedIndex);
        });
        PARTY_SELECTS.forEach( element => {
            INDEX_ARRAY
                .filter( index => index !== NON_UNIQUE_INDEX)
                .forEach( index => element.options[index].disabled = true )
        });
    
        function enableAllOptions( selectElement ) {
            for ( let i = 0; i < selectElement.options.length; i++ ) {
                selectElement.options[i].disabled = false;
            }
        }
    }

    populateSelect(nameArray, uuidArray, selectID) {
        const SELECT = document.getElementById( selectID );
        let i = 0;
        
        this.removeSelectOptions( SELECT );
        nameArray.forEach( name => {
            let element = document.createElement('option');
            
            element.textContent = name;
            element.value = uuidArray[i++];
            SELECT.appendChild( element );
        })
    }

    removeSelectOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for( i = L; i > 0; i-- ) {
            selectElement.remove(i);
        }
    }


}
export { UIHandlerInt }