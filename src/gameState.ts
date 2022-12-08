// Create state variables
let state = {
    mode: 'idle', //menu, play, dead, idle
    modeStarted: false, 
    inGameState: {
        currentScore: 0,
        distanceSinceSpawn: 0,
        totalDistance: 0,
        onGround: false,
    },
    history: {
        highScore: 0,
        maxDistance: 0,
    },
}
export default state;