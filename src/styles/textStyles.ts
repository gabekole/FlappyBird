import { TextStyle } from 'pixi.js'

const titleTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 40,
    fill: ['#ffffff'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

const scoreTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 80,
    fill: ['#ffffff'], 
    stroke: '#4a1850',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

const cardLabelTextStyle = new TextStyle({
    fontFamily: 'VT323',
    fontSize: 40,
    fontWeight: 'bold',
    fill: ['#FFFFFF'],
    stroke: '#4a1850',
    strokeThickness: 0,
    dropShadow: false,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

export { titleTextStyle, scoreTextStyle, cardLabelTextStyle };