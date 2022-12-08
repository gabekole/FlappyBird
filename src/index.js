import { Application, autoDetectRenderer, Container } from 'pixi.js'
import './styles/style.css'
import { createGameUpdate } from './gameLoop.ts'
import constants from './constants'

// TODO 
// Player animations
// Sound
// Menu Rework (HighScore)
// Pre-Play scene  
// Pipe texture vertical tiling
// Difficulty scaling
// Player skins / Background skins that can be set in menu
// Coins to collect to purchase player skins
// Boss battle?

// Initialize PixiJS aplication
function initialize(){

    const stage = new Container();

    const renderUpdateTime = 15;
    const gameUpdateTime = 20;

    const renderer = autoDetectRenderer({
        background: '#1099bb',
        antialias: false,
        autoDensity: true,
        width: constants['gameWidth'],
        height: constants['gameHeight'],
        hello: true,
    });

   const gameArea = document.getElementById('game-area')
    
   gameArea.appendChild(renderer.view);
   const gameUpdate = createGameUpdate(stage, renderer);

   

    function renderUpdate(lastTime){
        let now = performance.now();
        let delta = now - lastTime;

        renderer.render(stage);

        now = performance.now();
        setTimeout(()=>{requestAnimationFrame(()=>{renderUpdate(now)})}, renderUpdateTime-delta);
    }
    requestAnimationFrame(()=>{renderUpdate(performance.now)});

    function gameLogic(lastTime){
        let now = performance.now();
        let delta = now - lastTime;

        //Update state
        gameUpdate(delta/15.0);

        now = performance.now();
        setTimeout(()=>{gameLogic(now)}, gameUpdateTime-delta);
    }
    gameLogic(performance.now());

}


initialize();