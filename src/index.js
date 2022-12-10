import { autoDetectRenderer, Container, Text } from 'pixi.js'
import './styles/style.css'
import { createGameUpdate } from './gameLoop.ts'
import constants from './constants'

// Initialize PixiJS aplication
// Load them google fonts before starting...
window.WebFontConfig = {
    google: {
        families: ['VT323'],
    },
};

/* eslint-disable */
// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());
/* eslint-enabled */



function initialize(){

    const stage = new Container();

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

   let lastRenderTime = performance.now();
   let lastGameUpdateTime = performance.now();
   const renderInterval = 1000.0/120.0;
   const gameUpdateInterval = 1000.0/40.0;

   
    
   // https://gist.github.com/elundmark/38d3596a883521cb24f5
   function update() {
       requestAnimationFrame(update);

       let now = performance.now(); 
       let renderDelta = now - lastRenderTime;
       let gameDelta = now - lastGameUpdateTime;

       if(renderDelta > renderInterval){
            renderer.render(stage);
            lastRenderTime = now;
       }
       if(gameDelta > gameUpdateInterval){
            gameUpdate(gameDelta/15.0);
            lastGameUpdateTime = now;
       }
   }
   update();

}


initialize();