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
    const pipeLayer = new Container();

    // Creating the player components
    const graphic = Sprite.from(playerImg);
    graphic.width = constants['player']['width'];
    graphic.height = constants['player']['height'];
    const hitbox = new Sprite();
    hitbox.width = constants['player']['hitboxWidth'];
    hitbox.height = constants['player']['hitboxHeight'];
    const player = new Player(graphic, hitbox);

    // Create ground sprite
    const gndTex = Texture.from(groundImg);
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
            pipeLayer.removeChildren();
            const clickableArea = new Sprite();
            clickableArea.width = renderer.screen.width;
            clickableArea.height = renderer.screen.height;
            clickableArea.interactive = true;
            stage.addChild(clickableArea)

            background.resetBackgroundPosition();
            ground.tilePosition.x = 0;
            stage.addChild(background);

            stage.addChild(pipeLayer);

            document.removeEventListener('keypress', deathClick);
            document.removeEventListener('keypress', playClick);

            clickableArea.on('pointerdown', idleClick);
            document.addEventListener('keypress', idleClick);

            player.setVelocity(-5);
            player.rotation = 0;
            stage.addChild(player);

            player.x = 140
            player.y = .35*constants['gameHeight'];

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
            stage.addChild(player);

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
            p.y = p.width + Math.random()*(constants['gameHeight'] - p.pipeGap - 2*p.pipeWidth);
            pipeLayer.addChild(p);
            pipes.push(p);

            state['inGameState']['distanceSinceSpawn'] -= constants['pipes']['distancePerSpawn'];
        }


        let collided = false

        if (floorCollides(player, ground)){
            state['mode'] = 'dead';
            state['modeStarted'] = false;
            state['inGameState']['onGround'] = true;
            pipes = []
            collided = true
            player.y = ground.y - player.getGraphicBounds().height/3.0;
            console.log('collideGround');
        }

        console.log(pipes)
        // Check for pipe collision and update positions
        pipes = pipes.filter((pipe) => {
            if ( pipeCollides(player, pipe)){
                console.log('collidePipe')
                state['mode'] = 'dead';
                state['modeStarted'] = false;
                player.setVelocity(.1);
                pipes = [];
                collided = true
            }
            pipe.updatePosition(delta);

            if( pipe.getBounds().right < 0){
                stage.removeChild(pipe);
                pipe.destroy();
                return false;
            }
            return true;
        });

        if(collided){
            pipes = []
        }

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
            }, 250)

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

            if (floorCollides(player, ground)){
                player.setVelocity(.1);
                state['inGameState']['onGround'] = true;
                player.y = ground.y - player.getGraphicBounds().height/3.0;
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