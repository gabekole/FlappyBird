import { Sprite, Container } from 'pixi.js'

class Player extends Container{
    private hitbox: Sprite;
    private graphic: Sprite;

    private velocity: number;
    private time: number;

    constructor(graphic : Sprite, hitbox : Sprite){
        super();
        this.graphic = graphic;
        this.hitbox = hitbox;

        this.graphic.anchor.set(.5);
        this.hitbox.anchor.set(.5);

        this.graphic.rotation = this.hitbox.rotation;

        this.velocity = 0;
        this.time = 0;

        this.addChild(graphic);
        this.addChild(hitbox);

        this.graphic.y = 0;
        this.graphic.x = 0;
        this.hitbox.y = 0;
        this.hitbox.x = 0;
    }

    public updatePhysics(delta : number, gravity : number, maxVelocity : number){
        this.velocity += gravity*delta;

        this.velocity = Math.min(Math.abs(this.velocity), maxVelocity) * Math.sign(this.velocity); 

        const rotation = (this.velocity/22 + 9*this.rotation)/10

        this.rotation = rotation;

        this.y += this.velocity * delta;
    }

    public setVelocity(velocity : number){
        this.velocity = velocity;
    }

    public undulateUpdate(delta: number, yPosition : number){
        this.time += delta;
        this.y = 20*Math.sin(this.time/15) + yPosition;
    }

    public getHitBox(){
        return this.hitbox.getBounds();
    }
    
    public getGraphicBounds(){
        return this.graphic.getBounds();
    }
}

export { Player };