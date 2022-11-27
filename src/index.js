import { Application } from 'pixi.js'
import './styles/style.css'
import { gameUpdate } from './gameLoop.js'

// Initialize PixiJS aplication
function initialize(){
    const app = new Application({
        background: '#1099bb',
        antialias: true,
        autoDensity: true,
        width: 600,
        height: 600,
       });
   
   const gameArea = document.getElementById('game-area')

   if (gameArea == null){
       return;
   }
    
   gameArea.appendChild(app.view);
   

   app.ticker.add( (()=>gameUpdate(app)) )
}


initialize();