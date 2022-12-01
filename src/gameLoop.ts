import { Sprite, Text, Texture, Container, Application, BaseTexture, Rectangle, TilingSprite, IPointData } from 'pixi.js'
import { titleTextStyle } from './styles/textStyles.js'
import { boxCollides, pipeCollides } from './collision'
import { Player } from './players'
import constants from './constants'
import { Pipe } from './pipe'
import state from './gameState'

import playerImg from '../public/assets/wing.png'
import groundImg from '../public/assets/grass.png'
import pipeImg from '../public/assets/pipe.png'
import backgroundImg from '../public/assets/background/layers/parallax-mountain-bg.png'
import mountainsImg from '../public/assets/background/layers/parallax-mountain-mountains.png'
import treesImg from '../public/assets/background/layers/parallax-mountain-trees.png'
import foregroundTreesImg from '../public/assets/background/layers/parallax-mountain-foreground-trees.png'

function getGameUpdateFuncs(app : Application) {
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

    // Create background
    const backgroundTexture = Texture.from(backgroundImg);
    const background = new TilingSprite(backgroundTexture, constants['gameWidth'], constants['gameHeight']);

    background.once('added', ()=>{
        const scale = Math.max(constants['gameWidth']/backgroundTexture.width, 
                                constants['gameHeight']/backgroundTexture.height)

        background.tileScale = {x: scale, y: scale};
    });

    const mountainsTexture = Texture.from(mountainsImg);
    const mountains = new TilingSprite(mountainsTexture);
    mountains.anchor.set(0,1);
    mountains.x = 0;
    mountains.y = constants['gameHeight'];
    mountains.width = constants['gameWidth'];
    mountains.height = constants['gameHeight']/2;
    mountains.tileScale = {x: 2, y:4};

    const treesTexture = Texture.from(treesImg);
    const trees = new TilingSprite(treesTexture);
    trees.anchor.set(0,1)
    trees.y = constants['gameHeight'];
    trees.width = constants['gameWidth'];

    trees.once('added', ()=>{
        const treeScaleFactor = 4;
        const treeHeight = treesTexture.height;

        trees.height = treeHeight*treeScaleFactor;
        trees.tileScale = {x: treeScaleFactor, y: treeScaleFactor};
    });

    const foregroundTreesTexture = Texture.from(foregroundTreesImg);
    const foregroundTrees = new TilingSprite(foregroundTreesTexture);
    foregroundTrees.anchor.set(0,1)
    foregroundTrees.y = constants['gameHeight'];
    foregroundTrees.width = constants['gameWidth'];

    foregroundTrees.once('added', ()=>{
        const foregroundTreescaleFactor = 4;
        const treeHeight = foregroundTreesTexture.height;

        foregroundTrees.height = treeHeight*foregroundTreescaleFactor;
        foregroundTrees.tileScale = {x: foregroundTreescaleFactor, y: foregroundTreescaleFactor};
    });


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
            app.stage.removeChildren();
            backLayer.removeChildren();
            const clickableArea = new Sprite();
            clickableArea.width = app.screen.width;
            clickableArea.height = app.screen.height;
            clickableArea.interactive = true;
            app.stage.addChild(clickableArea)

            app.stage.addChild(background);
            app.stage.addChild(mountains);
            app.stage.addChild(trees);
            app.stage.addChild(foregroundTrees);

            app.stage.addChild(backLayer);
            app.stage.addChild(scoreText);
            document.removeEventListener('keypress', deathClick);
            document.removeEventListener('keypress', menuClick);
            clickableArea.on('pointerdown', playClick);
            document.addEventListener('keypress', playClick);
            state['inGameState']['onGround'] = false;

            player.setVelocity(-5);
            app.stage.addChild(player.hitbox);
            app.stage.addChild(player.graphic);

            player.setPosition(140, 50);

            app.stage.addChild(ground);

            state['modeStarted'] = true;
        }
        state['inGameState']['currentScore'] = Math.floor(Math.max(0, (state['inGameState']['totalDistance']-constants['gameWidth']-constants['player']['hitboxWidth'])/constants['pipes']['distancePerSpawn']))
        scoreText.text = state['inGameState']['currentScore'];
        player.updatePhysics(delta, .5, 25);
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

        if (boxCollides(player.hitbox, ground)){
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
                app.stage.removeChild(pipe.bottomHalf);
                app.stage.removeChild(pipe.topHalf);
                pipe.bottomHalf.destroy();
                pipe.topHalf.destroy();
                return false;
            }
            return true;
        })

        background.tilePosition.x -= delta*.08;
        mountains.tilePosition.x -= delta*.2;
        trees.tilePosition.x -= delta*.6;
        foregroundTrees.tilePosition.x -= delta*1.2;
        ground.tilePosition.x -= delta*constants['moveSpeed'];
    }

    let deathClick = (event : any) => {
        console.log('deathClick');
        state['mode'] = 'play';
        state['modeStarted'] = false;
    }
    function deadUpdate(delta : number) {
        if (!state['modeStarted']){
            const clickableArea = app.stage.getChildAt(0);
            clickableArea.removeAllListeners();

            clickableArea.on('pointerdown', deathClick);

            document.removeEventListener('keypress', playClick);
            document.addEventListener('keypress', deathClick);
            const richText = new Text('Click to play again', titleTextStyle);
            richText.x = 50;
            richText.y = 220;
            
            app.stage.addChild(richText);
        
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


function createGameUpdate(app : Application) {
    let [menuUpdate, playUpdate, deadUpdate] = getGameUpdateFuncs(app);
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