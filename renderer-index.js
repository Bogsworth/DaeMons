import * as parse from './lib/import.js';
import * as indexFuncs from './index-funcs.js';
import * as util from './lib/utility.js';
import starterJSON from './data/starting-options.json' assert { type: "json" };
import { Daemon } from './classes/class-daemon.js';
import { StorageHandler } from './classes/class-storage-handler.js';

/*
# TODO List
## Required TODOs
- [ ] TODO: A basic landing page


## Nice to have TODOs
- [ ] TODO: A nicer landing page
- [ ] TODO: Creating semi-random enemies with semi-random teams
- [ ] TODO: On landing page, change start buttons to actually be buttons
    rather than wrapped in a href link

## TODONE!!!
- [x] TODONE: Ability to choose your "starter"

*/

const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}),` +
    ` Node.js (v${window.versions.node()}), and Electron` +
    ` (v${window.versions.electron()})`;

const STARTER_IDS = ['monID000', 'monID001','monID002']


//let starterOptionArray = parse.createParty( starterJSON );
let starterOptionArray = [
    new Daemon(),
    new Daemon(),
    new Daemon()
]

starterOptionArray[0].generateDaemonFromID(STARTER_IDS[0], 'asStarter')
starterOptionArray[1].generateDaemonFromID(STARTER_IDS[1], 'asStarter')
starterOptionArray[2].generateDaemonFromID(STARTER_IDS[2], 'asStarter')

console.log(starterOptionArray);

indexFuncs.createStarterSection(starterOptionArray[0], 'option0' );
indexFuncs.createStarterSection(starterOptionArray[1], 'option1' );
indexFuncs.createStarterSection(starterOptionArray[2], 'option2' );

util.attachButtonId(
    function () {
        indexFuncs.startGame( starterOptionArray[0] );
    },
    'startButt0'
);
util.attachButtonId(
    function () {
        indexFuncs.startGame( starterOptionArray[1] );
    },
    'startButt1'
);
util.attachButtonId(
    function () {
        indexFuncs.startGame( starterOptionArray[2] );
    },
    'startButt2'
);