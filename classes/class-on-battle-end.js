class OnBattleEnd {
    constructor() {

        let homeScreenLocation = '../../../index.html'
        let interludeLocation = '../interlude/interlude.html'
    }

    endFight( fightState ) {
        fightState.playerParty.savePostFightParty();
        //util.savePostFightParty( fightState.myParty );
        getReward( fightState );
        getNextChallenger( fightState );
        console.log(sessionStorage)
        // return;
        window.location.href = this.interludeLocation;
    }
    
    getNextChallenger( fightState ) {
        sessionStorage.nextLockName = JSON.stringify(fightState.enemyLock.nextFight)
    }
    
    getReward( fightState ) {
        sessionStorage.newReward = JSON.stringify(fightState.enemyLock.reward);
    }
    
    endGame() {
        sessionStorage.clear();
        window.location.href = this.homeScreenLocation;
    }
}

export { OnBattleEnd }