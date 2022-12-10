import { Application, autoDetectRenderer, Container, Ticker } from 'pixi.js'
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

   const ticker = new Ticker();
   ticker.maxFPS = 70;
   ticker.minFPS = 0;

   ticker.add((delta) => {
        console.log(ticker.FPS);
        gameUpdate(delta);
        renderer.render(stage);
   });

   ticker.start();
    

}


initialize();