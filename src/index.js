import { Application } from 'pixi.js'
import './styles/style.css'
import { startGame } from './gameloop.js'

// Initialize PixiJS aplication
const app = new Application({
     background: '#1099bb',
     antialias: true,
     autoDensity: true,
     width: 600,
     height: 600,
    });

const gameArea = document.getElementById('game-area')
gameArea.appendChild(app.view);


startGame()