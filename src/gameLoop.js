import { Sprite, Text, Texture } from 'pixi.js'
import { titleTextStyle } from './styles/textStyles.js'
import { boxCollides } from './collision.ts'
import playerImg from '../public/assets/wing.png'
import groundImg from '../public/assets/grass.png'
import { Player } from './players.ts';
import constants from './constants.js'


// Creating the player components
const graphic = Sprite.from(playerImg);
graphic.width = 100;
graphic.height = 100;
const hitbox = new Sprite(Texture.WHITE);
hitbox.width = 65;
hitbox.height = 75;

// Create ground sprite 
const ground = Sprite.from(groundImg);
ground.width = constants['gameWidth'];
ground.height = 50;
ground.anchor.set(0,1);
ground.x = 0;
ground.y = constants['gameHeight'];

// Create state variables
let state = {
    mode: 'menu', //menu, game, dead
    modeStarted: 0, //0 if mode not run before
    inGameState: {
        currentScore: 0,
        distance: 0,
    },
    history: {
        highScore: 0,
        maxDistance: 0,
    },
    player: new Player(graphic, hitbox),
}



function menuUpdate(delta, app) {
    if (!state['modeStarted']){
        app.stage.removeChildren();
        const clickableArea = new Sprite();
        clickableArea.width = app.screen.width;
        clickableArea.height = app.screen.height;
        clickableArea.interactive = true;
        clickableArea.on('pointerdown', ()=>{console.log('play'); state['mode'] = 'play', state['modeStarted'] = 0;});
        app.stage.addChild(clickableArea)

        const richText = new Text('Flappy Bird Clone', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);

        state['modeStarted'] = 1;
    }
}


function playUpdate(delta, app) {
    if (!state['modeStarted']){
        app.stage.removeChildren();
        const clickableArea = new Sprite();
        clickableArea.width = app.screen.width;
        clickableArea.height = app.screen.height;
        clickableArea.interactive = true;
        app.stage.addChild(clickableArea)

        clickableArea.on('pointerdown', ()=>{ state['player'].setVelocity(-10); });


        state['player'].setVelocity(0);
        app.stage.addChild(state['player'].hitbox);
        app.stage.addChild(state['player'].graphic);

        state['player'].setPosition(80, 50);

        app.stage.addChild(ground);

        state['modeStarted'] = 1;
    }
    state['player'].updatePhysics(delta, .5, 25);

    if (boxCollides(state['player'].hitbox, ground)){
        state['mode'] = 'dead';
        state['modeStarted'] = 0;
        console.log('collide');
    }
}

function deadUpdate(delta, app) {
    if (!state['modeStarted']){
        const clickableArea = app.stage.getChildAt(0);
        clickableArea.removeAllListeners();

        clickableArea.on('pointerdown', ()=>{ state['mode'] = 'play'; state['modeStarted'] = 0;})

        const richText = new Text('Click to play again', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);
    
        state['modeStarted'] = 1;
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