import { Sprite, Text, Texture, Container, Application, BaseTexture, Rectangle, TilingSprite, Renderer } from 'pixi.js'

import { titleTextStyle } from './styles/textStyles.js'
import { boxCollides, floorCollides, pipeCollides } from './collision'
import { Player } from './players'
import constants from './constants'
import { Pipe } from './pipe'
import state from './gameState'
import parallaxBackground from './parallaxBackground'

import playerImg from '../public/assets/wing.png'
import groundImg from '../public/assets/grass.png'
import pipeImg from '../public/assets/pipe.png'


function getGameUpdateFuncs(stage : Container, renderer: Renderer) {
    // Create container for pipes
    const backLayer = new Container();

    // Creating the player components
    const graphic = Sprite.from(playerImg);
    graphic.width = constants['player']['width'];
    graphic.height = constants['player']['height'];
    const hitbox = new Sprite();
    hitbox.width = constants['player']['hitboxWidth'];
    hitbox.height = constants['player']['hitboxHeight'];
    const player = new Player(graphic, hitbox);

    // Create ground sprite
    const gnd = new BaseTexture(groundImg);
    const gndTex = new Texture(gnd, new Rectangle(0, 0, 512, 100));
    const ground = new TilingSprite(gndTex);
    ground.width = constants['gameWidth'];
    ground.height = 10;
    ground.anchor.set(0,1);
    ground.x = 0;
    ground.y = constants['gameHeight'];

    //Create background
    const background = new parallaxBackground();

    //Create pipe texture
    const pipeTexture = Texture.from(pipeImg);


    let menuClick = (event : any)=>{
        console.log('menuClick');
        console.log(event, typeof(event));
        state['mode'] = 'play';
        state['modeStarted'] = false;
    }

    function menuUpdate(delta : number) {
        if (!state['modeStarted']){
            stage.removeChildren();
            backLayer.removeChildren();
            const clickableArea = new Sprite();
            clickableArea.width = renderer.screen.width;
            clickableArea.height = renderer.screen.height;
            clickableArea.interactive = true;
            clickableArea.on('pointerdown', menuClick);
            document.removeEventListener('keypress', deathClick);
            document.addEventListener('keypress', menuClick);
            stage.addChild(clickableArea)
            

            const richText = new Text('Flappy Bird Clone', titleTextStyle);
            richText.x = 50;
            richText.y = 220;
            
            stage.addChild(richText);

            state['modeStarted'] = true;
        }
    }

    let pipes : Pipe[] = [];
    let playClick = (event : any) => {
        console.log('playClick');
        player.setVelocity(-10);
    }
    const scoreText = new Text('0', titleTextStyle);
    scoreText.x = 300 - (scoreText.width/2.0);
    scoreText.y = 50;
    function playUpdate(delta : number) {
        if (!state['modeStarted']){
            state['inGameState']['totalDistance'] = 0;
            state['inGameState']['distanceSinceSpawn'] = 0
            stage.removeChildren();
            backLayer.removeChildren();
            const clickableArea = new Sprite();
            clickableArea.width = renderer.screen.width;
            clickableArea.height = renderer.screen.height;
            clickableArea.interactive = true;
            stage.addChild(clickableArea)

            background.resetBackgroundPosition();
            ground.tilePosition.x = 0;
            stage.addChild(background);

            stage.addChild(backLayer);
            stage.addChild(scoreText);
            document.removeEventListener('keypress', deathClick);
            document.removeEventListener('keypress', menuClick);
            clickableArea.on('pointerdown', playClick);
            document.addEventListener('keypress', playClick);
            state['inGameState']['onGround'] = false;

            player.setVelocity(-5);
            stage.addChild(player.hitbox);
            stage.addChild(player.graphic);

            player.setPosition(140, 50);

            stage.addChild(ground);

            state['modeStarted'] = true;
        }
        state['inGameState']['currentScore'] = Math.floor(Math.max(0, (state['inGameState']['totalDistance']-constants['gameWidth']-constants['player']['hitboxWidth'])/constants['pipes']['distancePerSpawn']))
        scoreText.text = state['inGameState']['currentScore'];
        player.updatePhysics(delta, .5, 25);
        state['inGameState']['distanceSinceSpawn'] += delta*constants['moveSpeed'];
        state['inGameState']['totalDistance'] += delta*constants['moveSpeed'];


        if(state['inGameState']['distanceSinceSpawn'] > constants['pipes']['distancePerSpawn']){
            const p = new Pipe(pipeTexture)
            p.setGapLocation(p.width + Math.random()*(constants['gameHeight'] - p.gap - 2*p.width));
            backLayer.addChild(p.topHalf);
            backLayer.addChild(p.bottomHalf)
            pipes.push(p);

            state['inGameState']['distanceSinceSpawn'] -= constants['pipes']['distancePerSpawn'];
        }

        if (floorCollides(player.hitbox, ground)){
            state['mode'] = 'dead';
            state['modeStarted'] = false;
            state['inGameState']['onGround'] = true;
            pipes = []
            console.log('collideGround');
        }

        // Check for pipe collision and update positions
        pipes.forEach((pipe) => {
            if ( pipeCollides(player.hitbox, pipe)){
                console.log('collidePipe')
                state['mode'] = 'dead';
                state['modeStarted'] = false;
                player.setVelocity(.1);
                pipes = [];
            }
            pipe.updatePosition(delta);
        });

        // Remove pipes that are offscreen
        pipes = pipes.filter((pipe) => {
            if( pipe.bottomHalf.getBounds().right < 0){
                stage.removeChild(pipe.bottomHalf);
                stage.removeChild(pipe.topHalf);
                pipe.bottomHalf.destroy();
                pipe.topHalf.destroy();
                return false;
            }
            return true;
        })

        background.updateBackground(delta);
        ground.tilePosition.x -= delta*constants['moveSpeed'];
    }

    let deathClick = (event : any) => {
        console.log('deathClick');
        state['mode'] = 'play';
        state['modeStarted'] = false;
    }
    function deadUpdate(delta : number) {
        if (!state['modeStarted']){
            const clickableArea = stage.getChildAt(0);
            clickableArea.removeAllListeners();

            clickableArea.on('pointerdown', deathClick);

            document.removeEventListener('keypress', playClick);
            document.addEventListener('keypress', deathClick);
            const richText = new Text('Click to play again', titleTextStyle);
            richText.x = 50;
            richText.y = 220;
            
            stage.addChild(richText);
        
            state['modeStarted'] = true;
        }

        if(!state['inGameState']['onGround']){
            player.updatePhysics(delta, .5, 25);

            if (boxCollides(player.hitbox, ground)){
                player.setVelocity(.1);
                state['inGameState']['onGround'] = true;
                console.log('collideGround');
            }
        }

    }

    return [menuUpdate, playUpdate, deadUpdate];
}


function createGameUpdate(stage : Container, renderer: Renderer) {
    let [menuUpdate, playUpdate, deadUpdate] = getGameUpdateFuncs(stage, renderer);
    function gameUpdate(delta : number) {
        if (state['mode'] == 'menu') {
            menuUpdate(delta)
        }
        if (state['mode'] == 'play'){
            playUpdate(delta);
        }
        if (state['mode'] == 'dead'){
            deadUpdate(delta);
        }
    }
    return gameUpdate;
}


export { createGameUpdate };