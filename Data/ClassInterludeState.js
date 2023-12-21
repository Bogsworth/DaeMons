import * as util from '../lib/utility.js';

class InterludeState {
    constructor ( builder = {
        'currentParty': '""',
        'newReward': '""',
        'allHeldMons': '""',
        'nextLock': '""',

    }) {
        for (let [key, val] of Object.entries(builder)) {
            console.log(key)
            if (val == undefined ) {
                builder[key] = '""';
            }
        }

        console.log(JSON.parse(builder['currentParty']))
        this.currentParty = util.parseDaemonJSON(JSON.parse(builder['currentParty']));
        this.newReward = JSON.parse(builder['newReward']);
        this.allHeldMons = JSON.parse(builder['allHeldMons']);
        this.nextLock = JSON.parse(builder['nextLock']);

        if (builder['allHeldMons'] == '""') {
            this.updateParam( this.currentParty, 'allHeldMons' )
        }
    }

    updateParam( newPartyJSON, param ) {
        // Can this be done, or does it need to be 'param' or something else?
        this[param] = util.parseDaemonJSON( newPartyJSON );
        sessionStorage[param] = JSON.stringify( this[param] );
    }
};

export {
    InterludeState
}
