import { Application, autoDetectRenderer } from 'pixi.js'
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
    const app = new Application({
        background: '#1099bb',
        antialias: true,
        autoDensity: true,
        width: constants['gameWidth'],
        height: constants['gameHeight'],
       });
   
   const gameArea = document.getElementById('game-area')

   if (gameArea == null){
       return;
   }
    
   gameArea.appendChild(app.view);
   

   const gameUpdate = createGameUpdate(app);
   app.ticker.add( ((delta)=>gameUpdate(delta, app)) )
}


initialize();