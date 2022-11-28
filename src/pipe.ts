import { Texture, Sprite } from 'pixi.js'

const pipeWidth = 50;
const pipeGap = 100;

class Pipe {
    public topHalf: Sprite;
    public bottomHalf: Sprite;

    private moveSpeed: number;

    constructor(graphic : Texture, moveSpeed : number){
        this.moveSpeed = moveSpeed;

        this.topHalf = new Sprite(graphic);
        this.bottomHalf = new Sprite(graphic);

        this.bottomHalf.anchor.set(0);
        this.topHalf.rotation = Math.PI;
        this.topHalf.anchor.set(1,1);

        this.bottomHalf.height = 600;
        this.topHalf.height = 600;
    }
}

export { Pipe };