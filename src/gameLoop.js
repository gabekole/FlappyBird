import { Sprite, Text, Texture, Container } from 'pixi.js'
import { titleTextStyle } from './styles/textStyles.js'
import { boxCollides, pipeCollides } from './collision.ts'
import playerImg from '../public/assets/wing.png'
import groundImg from '../public/assets/grass.png'
import pipeImg from '../public/assets/pipe.png'
import { Player } from './players.ts'
import constants from './constants.js'
import { Pipe } from './pipe.ts'

// Create container for pipes
const backLayer = new Container();

// Creating the player components
const graphic = Sprite.from(playerImg);
graphic.width = constants['player']['width'];
graphic.height = constants['player']['height'];
const hitbox = new Sprite();
hitbox.width = constants['player']['hitboxWidth'];
hitbox.height = constants['player']['hitboxHeight'];

// Create ground sprite 
const ground = Sprite.from(groundImg);
ground.width = constants['gameWidth'];
ground.height = 50;
ground.anchor.set(0,1);
ground.x = 0;
ground.y = constants['gameHeight'];

//Create pipe texture
const pipeTexture = Texture.from(pipeImg);

// Create state variables
let state = {
    mode: 'menu', //menu, game, dead
    modeStarted: false, 
    inGameState: {
        currentScore: 0,
        distanceSinceSpawn: 0,
        totalDistance: 0,
        onGround: false,
    },
    history: {
        highScore: 0,
        maxDistance: 0,
    },
    player: new Player(graphic, hitbox),
}


let menuClick = (event)=>{
    console.log('play');
    state['mode'] = 'play';
    state['modeStarted'] = false;
}

function menuUpdate(delta, app) {
    if (!state['modeStarted']){
        app.stage.removeChildren();
        backLayer.removeChildren();
        const clickableArea = new Sprite();
        clickableArea.width = app.screen.width;
        clickableArea.height = app.screen.height;
        clickableArea.interactive = true;
        clickableArea.on('pointerdown', menuClick);
        document.removeEventListener('keypress', deathClick);
        document.addEventListener('keypress', menuClick);
        app.stage.addChild(clickableArea)
        

        const richText = new Text('Flappy Bird Clone', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);

        state['modeStarted'] = true;
    }
}

let pipes = [];
let playClick = (event) => {
    state['player'].setVelocity(-10);
}
const scoreText = new Text('0', titleTextStyle);
scoreText.x = 300 - (scoreText.width/2.0);
scoreText.y = 50;
function playUpdate(delta, app) {
    if (!state['modeStarted']){
        state['inGameState']['totalDistance'] = 0;
        state['inGameState']['distanceSinceSpawn'] = 0
        app.stage.removeChildren();
        backLayer.removeChildren();
        app.stage.addChild(backLayer);
        const clickableArea = new Sprite();
        clickableArea.width = app.screen.width;
        app.stage.addChild(scoreText);
        clickableArea.height = app.screen.height;
        clickableArea.interactive = true;
        app.stage.addChild(clickableArea)
        document.removeEventListener('keypress', deathClick);
        document.removeEventListener('keypress', menuClick);
        clickableArea.on('pointerdown', playClick);
        document.addEventListener('keypress', playClick);
        state['inGameState']['onGround'] = false;

        state['player'].setVelocity(-5);
        app.stage.addChild(state['player'].hitbox);
        app.stage.addChild(state['player'].graphic);

        state['player'].setPosition(140, 50);

        app.stage.addChild(ground);

        state['modeStarted'] = true;
    }
    state['inGameState']['currentScore'] = Math.floor(Math.max(0, (state['inGameState']['totalDistance']-constants['gameWidth']-constants['player']['hitboxWidth'])/constants['pipes']['distancePerSpawn']))
    scoreText.text = state['inGameState']['currentScore'];
    state['player'].updatePhysics(delta, .5, 25);
    state['inGameState']['distanceSinceSpawn'] += delta*constants['moveSpeed'];
    state['inGameState']['totalDistance'] += delta*constants['moveSpeed'];


    if(state['inGameState']['distanceSinceSpawn'] > constants['pipes']['distancePerSpawn']){
        const p = new Pipe(pipeTexture)
        p.setGapLocation((Math.random()*250+10))
        backLayer.addChild(p.topHalf);
        backLayer.addChild(p.bottomHalf)
        pipes.push(p);

        state['inGameState']['distanceSinceSpawn'] -= constants['pipes']['distancePerSpawn'];
    }

    if (boxCollides(state['player'].hitbox, ground)){
        state['mode'] = 'dead';
        state['modeStarted'] = false;
        state['inGameState']['onGround'] = true;
        pipes = []
        console.log('collideGround');
    }

    pipes.forEach((pipe) => {
        if ( pipeCollides(state['player'].hitbox, pipe)){
            console.log('collidePipe')
            state['mode'] = 'dead';
            state['modeStarted'] = false;
            state['player'].setVelocity(.1);
            pipes = [];
        }
        pipe.updatePosition(delta);
    });
}

let deathClick = (event) => {
    state['mode'] = 'play';
    state['modeStarted'] = 0;
}
function deadUpdate(delta, app) {
    if (!state['modeStarted']){
        const clickableArea = app.stage.getChildAt(0);
        clickableArea.removeAllListeners();

        clickableArea.on('pointerdown', deathClick)

        document.removeEventListener('keypress', playClick);
        document.addEventListener('keypress', deathClick);
        const richText = new Text('Click to play again', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);
    
        state['modeStarted'] = 1;
    }

    if(!state['inGameState']['onGround']){
        state['player'].updatePhysics(delta, .5, 25);

        if (boxCollides(state['player'].hitbox, ground)){
            state['player'].setVelocity(.1);
            state['inGameState']['onGround'] = true;
            console.log('collideGround');
        }
    }

}

function gameUpdate(delta, app) {
    if (state['mode'] == 'menu') {
        menuUpdate(delta, app)
    }
    if (state['mode'] == 'play'){
        playUpdate(delta, app);
    }
    if (state['mode'] == 'dead'){
        deadUpdate(delta, app);
    }
}

export { gameUpdate };