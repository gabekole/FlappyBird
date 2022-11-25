import { Sprite } from 'pixi.js'

let state = {
    mode: 'menu', //menu, game, dead
    inGameState: {
        currentScore: 0,
        distance: 0,
    },
    history: {
        highScore: 0,
        maxDistance: 0,
    },
}

function startGame() {

}

export { startGame };