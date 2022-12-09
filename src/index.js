import { autoDetectRenderer, Container } from 'pixi.js'
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
// Load them google fonts before starting...
window.WebFontConfig = {
    google: {
        families: ['VT323'],
    },
    active() {
        init();
    },
};

/* eslint-disable */
// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());
/* eslint-enabled */



function initialize(){

    const stage = new Container();

    const renderUpdateTime = 22;
    const gameUpdateTime = 10;

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
        setTimeout(()=>{requestAnimationFrame(()=>{renderUpdate(now)})}, renderUpdateTime);
    }
    requestAnimationFrame(()=>{renderUpdate(performance.now)});

    function gameLogic(lastTime){
        let now = performance.now();
        let delta = now - lastTime;

        //Update state
        gameUpdate(delta/15.0);

        now = performance.now();
        setTimeout(()=>{gameLogic(now)}, gameUpdateTime);
    }
    gameLogic(performance.now());

}


initialize();