import { Texture, Sprite } from 'pixi.js'
import constants from './constants'


class Pipe {
    public topHalf: Sprite;
    public bottomHalf: Sprite;
    public width = 80;
    public gap = 200;

    constructor(graphic : Texture){

        this.topHalf = new Sprite(graphic);
        this.bottomHalf = new Sprite(graphic);

        this.bottomHalf.anchor.set(0);
        this.topHalf.rotation = Math.PI;
        this.topHalf.anchor.set(1,0);

        this.bottomHalf.height = 600;
        this.topHalf.height = 600;
        this.topHalf.width = this.width;
        this.bottomHalf.width = this.width;

        this.bottomHalf.x = constants['gameWidth'] + this.width;
        this.topHalf.x = constants['gameWidth'] + this.width;
    }

    public setGapLocation(y: number){
        this.topHalf.y = y;
        this.bottomHalf.y = y + this.gap;
    }

    public updatePosition(delta : number){
        this.bottomHalf.x -= constants['moveSpeed']*delta;
        this.topHalf.x -= constants['moveSpeed']*delta;
    }

    public getTopPipeBounds(){
        return this.topHalf.getBounds();
    }

    public getBottomPipeBounds(){
        return this.bottomHalf.getBounds();
    }

}

export { Pipe };