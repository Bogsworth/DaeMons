import * as scripts from './scripts/script-funcs';

let party = ['Fuckboy', 'Imp', 'Jingoist']
let allDaemonsHeld = ['Fuckboy', 'Imp', 'Jingoist', 'Damned', 'Succubus']

let selectArray = ['partySelect0', 'partySelect1', 'partySelect2', 'daemonListSelect']

selectArray.forEach( select => {
    scripts.populateSelect( allDaemonsHeld, select)
})
