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

    const renderer = autoDetectRenderer({
        background: '#1099bb',
        antialias: true,
        autoDensity: true,
        width: constants['gameWidth'],
        height: constants['gameHeight'],
    });

   const gameArea = document.getElementById('game-area')
    
   gameArea.appendChild(renderer.view);
   const gameUpdate = createGameUpdate(stage, renderer);

   

    function renderUpdate(lastTime){
        let now = performance.now();
        let delta = now - lastTime;
        
        renderer.render(stage);
        requestAnimationFrame(()=>{renderUpdate(delta)});
    }
    requestAnimationFrame(()=>{renderUpdate(performance.now)});

    function gameLogic(lastTime){
        let now = performance.now();
        let delta = now - lastTime;

        //Update state
        gameUpdate(delta/15);

        now = performance.now();
        setTimeout(()=>{gameLogic(now)}, 20-delta);
    }
    gameLogic(performance.now());

}


initialize();