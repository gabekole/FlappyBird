import { Sprite , Text, Texture, Container } from 'pixi.js'

import { cardLabelTextStyle } from './styles/textStyles';

class ScoreCard extends Container {
    private backdrop : Sprite;
    private scoreLabel : Text;
    private highScoreLabel : Text;

    public score : Text;
    public highScore : Text;
    
    constructor(){
        super();
        
        this.backdrop = new Sprite(Texture.WHITE);
        this.backdrop.tint = 0x610539;
        this.backdrop.width = 200;
        this.backdrop.height = 200;

        this.scoreLabel = new Text("Score: ", cardLabelTextStyle);
        this.highScoreLabel = new Text("High Score:", cardLabelTextStyle);
        this.score = new Text("1", cardLabelTextStyle);
        this.highScore = new Text("15", cardLabelTextStyle);

        this.score.anchor.set(.5);
        this.scoreLabel.anchor.set(.5);
        this.highScoreLabel.anchor.set(.5);
        this.highScore.anchor.set(.5);

        this.scoreLabel.y = this.backdrop.height*.1;
        this.score.y = this.backdrop.height*.25;

        this.highScoreLabel.y = this.backdrop.height*.6;
        this.highScore.y = this.backdrop.height*.75;

        this.score.x = this.backdrop.width/2.0;
        this.scoreLabel.x = this.backdrop.width/2.0;
        this.highScore.x = this.backdrop.width/2.0;
        this.highScoreLabel.x = this.backdrop.width/2.0;


        this.addChild(this.backdrop);
        this.addChild(this.scoreLabel);
        this.addChild(this.score);
        this.addChild(this.highScoreLabel);
        this.addChild(this.highScore);
    }



}

export default ScoreCard;