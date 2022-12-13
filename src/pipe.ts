import { Texture, Sprite, Container } from 'pixi.js'
import constants from './constants'


class Pipe extends Container {
    private topHalf: Sprite;
    private bottomHalf: Sprite;

    public readonly pipeWidth = 80;
    public readonly pipeGap = 200;

    constructor(graphic : Texture){
        super();

        this.topHalf = new Sprite(graphic);
        this.bottomHalf = new Sprite(graphic);

        this.bottomHalf.anchor.set(0);
        this.topHalf.rotation = Math.PI;
        this.topHalf.anchor.set(1,0);

        this.bottomHalf.height = 600;
        this.topHalf.height = 600;
        this.topHalf.width = this.pipeWidth;
        this.bottomHalf.width = this.pipeWidth;

        this.addChild(this.bottomHalf);
        this.addChild(this.topHalf);

        this.bottomHalf.x = constants['gameWidth'] + this.pipeWidth;
        this.topHalf.x = constants['gameWidth'] + this.pipeWidth;

        this.topHalf.y = 0;
        this.bottomHalf.y = this.pipeGap;
    }

    public updatePosition(delta : number){
        this.x -= constants['moveSpeed']*delta;
    }

    public getTopPipeBounds(){
        return this.topHalf.getBounds();
    }

    public getBottomPipeBounds(){
        return this.bottomHalf.getBounds();
    }

}

export { Pipe };