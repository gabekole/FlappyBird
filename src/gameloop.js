import { Sprite, Text } from 'pixi.js'
import { titleTextStyle } from './styles/textStyles.js'

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
}



function menuUpdate(app) {
    if (!state['modeStarted']){
        app.stage.removeChildren();
        const clickableArea = new Sprite();
        clickableArea.width = app.screen.wdith;
        clickableArea.height = app.screen.height;
        function temp(){
            console.log('hello')
        }

        clickableArea.on('pointerdown', temp);
        app.stage.addChild(clickableArea)

        const richText = new Text('Flappy Bird Clone', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);

        state['modeStarted'] = 1;
    }
}

function playUpdate(app){
    if (!state['modeStarted']){
        app.stage.removeChildren();
        const clickableArea = new Sprite();
        clickableArea.width = app.width;
        clickableArea.height = app.height;
        clickableArea.on('click', ()=>{state['mode'] = 'menu', state['modeStarted'] = 0;});
        app.stage.addChild(clickableArea)

        const richText = new Text('Flappy Bird game', titleTextStyle);
        richText.x = 50;
        richText.y = 220;
        
        app.stage.addChild(richText);

        state['modeStarted'] = 1;
    } 
}

function gameUpdate(app) {
    console.log(state['mode'])
    if (state['mode'] == 'menu') {
        menuUpdate(app)
    }
    if (state['mode'] == 'play'){
        playUpdate(app);
    }
}

export { gameUpdate };