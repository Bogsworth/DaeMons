//import { move } from 'fs-extra';
import * as util from '../lib/calculations.js'
import * as parse from '../lib/import.js'

function attachButton( doFunction, elementID ) {
    let el = document.getElementsByName( elementID );

    document.addEventListener("DOMContentLoaded", () => {

        //if (el.addEventListener)
            el[0].addEventListener("click", doFunction, false);
        //else if (el.attachEvent)
            //el.attachEvent('onclick', doFunction);

    })
}

export {
    attachButton
}