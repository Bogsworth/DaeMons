import * as util from '../lib/utility.js';

class InterludeState {
    constructor ( builder = {
        'currentParty': '""',
        'newReward': '""',
        'allHeldMons': '""',
        'nextLock': '""',
        'nextLockName': '""'

    }) {
        for (let [key, val] of Object.entries(builder)) {
            if (val == undefined ) {
                builder[key] = '""';
            }
        }

        this.currentParty = util.parseDaemonJSON
        (
            JSON.parse(builder['currentParty'])
        );
        this.newReward = JSON.parse(builder['newReward']);
        this.allHeldMons = JSON.parse(builder['allHeldMons']);
        this.nextLock = JSON.parse(builder['nextLock']);
        this.nextLockName = JSON.parse(builder['nextLockName']);

        if (builder['allHeldMons'] == '""') {
            this.updateParam( this.currentParty, 'allHeldMons' )
        }
    }

    updateParam( newPartyJSON, param ) {
        this[param] = util.parseDaemonJSON( newPartyJSON );
        sessionStorage[param] = JSON.stringify( this[param] );
    }
};

export {
    InterludeState
}
