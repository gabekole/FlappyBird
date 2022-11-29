import { Texture, Sprite } from 'pixi.js'
import constants from './constants'

const width = 80;
const gap = 200;

class Pipe {
    private topHalf: Sprite;
    private bottomHalf: Sprite;

    constructor(graphic : Texture, moveSpeed : number){

        this.topHalf = new Sprite(graphic);
        this.bottomHalf = new Sprite(graphic);

        this.bottomHalf.anchor.set(0);
        this.topHalf.rotation = Math.PI;
        this.topHalf.anchor.set(1,0);

        this.bottomHalf.height = 600;
        this.topHalf.height = 600;
        this.topHalf.width = width;
        this.bottomHalf.width = width;

        this.bottomHalf.x = constants['gameWidth'] + width;
        this.topHalf.x = constants['gameWidth'] + width;
    }

    public setGapLocation(y: number){
        this.topHalf.y = y;
        this.bottomHalf.y = y + gap;
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