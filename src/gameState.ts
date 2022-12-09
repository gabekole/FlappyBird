// Create state variables
let state = {
    mode: 'idle', //play, dead, idle
    modeStarted: false, 
    inGameState: {
        currentScore: 0,
        distanceSinceSpawn: 0,
        totalDistance: 0,
        onGround: false,
    },
    history: {
        highScore: 0,
    },
}
export default state;