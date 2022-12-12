import { TextStyle } from 'pixi.js'

const titleTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 40,
    fill: ['#ffffff'], 
    stroke: '#000000',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

const scoreTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 80,
    fill: ['#ffffff'], 
    stroke: '#000000',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

const cardLabelTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 40,
    fontWeight: 'bold',
    fill: ['#ffffff'], 
    stroke: '#000000',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

export { titleTextStyle, scoreTextStyle, cardLabelTextStyle };