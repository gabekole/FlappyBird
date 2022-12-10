import { Sprite, Text, Texture, Container, BaseTexture, Rectangle, TilingSprite, Renderer } from 'pixi.js'

import { titleTextStyle, scoreTextStyle } from './styles/textStyles'
import { floorCollides, pipeCollides } from './collision'
import { Player } from './players'
import constants from './constants'
import { Pipe } from './pipe'
import state from './gameState'
import ScoreCard from './scoreCard'
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

    let pipes : Pipe[] = [];
    let playClick = (event : any) => {
        player.setVelocity(-10);
    }

    let idleClick = (event : any) => {
        state['modeStarted'] = false;
        state['mode'] = 'play';
    }
    function idleUpdate(delta : number) {
        if (!state['modeStarted']){
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

            document.removeEventListener('keypress', deathClick);
            document.removeEventListener('keypress', playClick);

            clickableArea.on('pointerdown', idleClick);
            document.addEventListener('keypress', idleClick);

            player.setVelocity(-5);
            player.setRotation(0);
            stage.addChild(player.hitbox);
            stage.addChild(player.graphic);

            player.setPosition(140, .35*constants['gameHeight']);

            stage.addChild(ground);

            state['modeStarted'] = true;
        }
        player.undulateUpdate(delta, .35*constants['gameHeight']);

        background.updateBackground(delta);
        ground.tilePosition.x -= delta*constants['moveSpeed'];
    }

    let scoreText : Text;
    function playUpdate(delta : number) {
        if (!state['modeStarted']){
            state['inGameState']['totalDistance'] = 0;
            state['inGameState']['distanceSinceSpawn'] = 0



            const clickableArea = stage.getChildAt(0);
            clickableArea.removeAllListeners();


            scoreText = new Text('0', scoreTextStyle);
            scoreText.x = constants['gameWidth']/2.0 - (scoreText.width/2.0);
            scoreText.y = constants['gameHeight']*.1;

            stage.addChild(scoreText);

            document.removeEventListener('keypress', deathClick);
            document.removeEventListener('keypress', idleClick);

            clickableArea.on('pointerdown', playClick);
            document.addEventListener('keypress', playClick);
            state['inGameState']['onGround'] = false;

            player.setVelocity(-5);
            stage.addChild(player.hitbox);
            stage.addChild(player.graphic);

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
            player.setY(ground.y - player.graphic.getBounds().height/3.0);
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
        state['mode'] = 'idle';
        state['modeStarted'] = false;
    }
    const scoreCard = new ScoreCard();
    function deadUpdate(delta : number) {
        if (!state['modeStarted']){
            const clickableArea = stage.getChildAt(0);
            clickableArea.removeAllListeners();


            document.removeEventListener('keypress', playClick);
            const richText = new Text('Click to play again', titleTextStyle);
            richText.anchor.set(.5);
            richText.x = constants['gameWidth']/2.0;
            richText.y = constants['gameHeight']*.3;

            setTimeout(()=>{
                clickableArea.on('pointerdown', deathClick);
                document.addEventListener('keypress', deathClick);
            }, 80)

            state['history']['highScore'] = Math.max(state['history']['highScore'], state['inGameState']['currentScore']);
            localStorage.setItem('highScore', state['history']['highScore'].toString());
            scoreCard.score.text = state['inGameState']['currentScore'];
            scoreCard.highScore.text = state['history']['highScore'];
            
            stage.addChild(richText);
            stage.addChild(scoreCard);
            scoreCard.x = constants['gameWidth']/2.0 - scoreCard.width/2.0;
            scoreCard.y = constants['gameHeight']/2.0 - scoreCard.height/2.0;

            
        
            state['modeStarted'] = true;
        }

        if(!state['inGameState']['onGround']){
            player.updatePhysics(delta, .5, 25);

            if (floorCollides(player.hitbox, ground)){
                player.setVelocity(.1);
                state['inGameState']['onGround'] = true;
                player.setY(ground.y - player.graphic.getBounds().height/3.0);
                console.log('collideGround');
            }
        }

    }

    return [playUpdate, deadUpdate, idleUpdate];
}


function createGameUpdate(stage : Container, renderer: Renderer) {
    let [playUpdate, deadUpdate, idleUpdate] = getGameUpdateFuncs(stage, renderer);

    state['history']['highScore'] = Number(localStorage.getItem('highScore'));

    if (isNaN(state['history']['highScore'])){
        state['history']['highScore'] = 0;
    }

    function gameUpdate(delta : number) {
        if (state['mode'] == 'idle') {
            idleUpdate(delta);
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