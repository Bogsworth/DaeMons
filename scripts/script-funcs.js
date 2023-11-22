function populateSelect( array = [], selectName ) {
    const select = document.getElementById( selectName )
    
    array.forEach( mon => {
        if ( mon == null ){
            return;
        }

        let element = document.createElement('option');
        element.textContent = mon.name;
        element.value = mon;
        select.appendChild( element );
    })
}

function attachButton( doFunction, elementID ) {
    let el = document.getElementsByName( elementID );

    document.addEventListener("DOMContentLoaded", () => {

        //if (el.addEventListener)
            el[0].addEventListener("click", doFunction, false);
        //else if (el.attachEvent)
            //el.attachEvent('onclick', doFunction);

    })
}

function updateMon( mon, isYourMon = true) {
    let ID = {
        name: 'theirMon',
        HP: 'theirMonHP'
    }
    
    if ( isYourMon == true ) {
        ID = {
            name: 'yourMon',
            HP: 'yourMonHP'
        }
    }
    console.log(mon)

    document.getElementById(ID.name).innerHTML = mon.name
    document.getElementById(ID.HP).innerHTML = mon.stats.HP + '/' + mon.stats.HP
}

let handleAttack = function() {
    console.log('attack button pressed');
}

let handleSwitch = function() {
    console.log('switch button pressed');


}

let handleOk = function() {
    console.log('ok button pressed');
}


export {
    populateSelect,
    attachButton,
    updateMon,
    handleAttack,
    handleSwitch,
    handleOk
}