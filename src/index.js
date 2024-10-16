import { autoDetectRenderer, Container, Ticker } from 'pixi.js'
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
        background: '#0x87CEEB',
        antialias: false,
        autoDensity: true,
        width: constants['gameWidth'],
        height: constants['gameHeight'],
        resolution: 1, // Set to 1 to ensure pixel-perfect rendering
        antialias: false,
        hello: true,
    });

   const gameArea = document.getElementById('game-area')
    
   gameArea.appendChild(renderer.view);
   
   
   // Function to handle scaling
   function handleResize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const windowRatio = windowWidth / windowHeight;
        const gameRatio = constants['gameWidth'] / constants['gameHeight'];

        let scale;
        if (windowRatio > gameRatio) {
            // Window is wider than the game ratio
            scale = windowHeight / constants['gameHeight'];
        } else {
            // Window is taller than the game ratio
            scale = windowWidth / constants['gameWidth'];
        }

        // Apply the scale to the renderer view (canvas)
        renderer.view.style.width = `${constants['gameWidth'] * scale}px`;
        renderer.view.style.height = `${constants['gameHeight'] * scale}px`;
    }

    // Initial resize
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

   
   const gameUpdate = createGameUpdate(stage, renderer);

   const ticker = new Ticker();
   ticker.maxFPS = 70;
   ticker.minFPS = 0;

   ticker.add((delta) => {
        gameUpdate(delta);
        renderer.render(stage);
   });

   ticker.start();
    

}


initialize();