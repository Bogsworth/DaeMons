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

        console.log(builder)

        this.currentParty = util.parseDaemonJSON
        (
            JSON.parse(builder['currentParty'])
        );
        this.newReward = JSON.parse(builder['newReward']);
        //this.allHeldMons = JSON.parse(builder['allHeldMons']);

        this.nextLock = JSON.parse(builder['nextLock']);
        this.nextLockName = JSON.parse(builder['nextLockName']);

        if (builder['allHeldMons'] == '""') {
            this.allHeldMons = Object.assign([], this.currentParty)
        }
        else {
            this.allHeldMons = util.parseDaemonJSON
            (
                JSON.parse(builder['allHeldMons'])
            );
            // console.log('all held mons')
            // console.log(this.allHeldMons)
        }
    }

    updateParam( data, param ) {
        this[param] = data;

        if (typeof(data) == 'object' ) {
            sessionStorage[param] = JSON.stringify( this[param] );
        }
        else {
            sessionStorage[param] = this[param];
        }
    }

};

export {
    InterludeState
}
