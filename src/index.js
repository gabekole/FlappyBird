import { Application, Sprite } from 'pixi.js'
import './styles/style.css'
import { createGameUpdate } from './gameLoop.js'
import constants from './constants.js'

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