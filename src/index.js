import { autoDetectRenderer, Container } from 'pixi.js'
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


   const fps = 48;
   let now;
   let then = Date.now();
   const interval = 1000/fps;
   let delta;

   const gameUpdateTime = 12;
    
   // https://gist.github.com/elundmark/38d3596a883521cb24f5
   function draw() {
       requestAnimationFrame(draw);
        
       now = Date.now();
       delta = now - then;
        
       if (delta > interval) {
           then = now - (delta % interval);
            
           renderer.render(stage);
       }
   }
   draw();

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