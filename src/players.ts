import { Sprite } from 'pixi.js'

class Player {
    public hitbox: Sprite;
    public graphic: Sprite;

    private velocity: number;

    private time: number;

    constructor(graphic : Sprite, hitbox : Sprite){
        this.graphic = graphic;
        this.hitbox = hitbox;

        this.graphic.anchor.set(.5);
        this.hitbox.anchor.set(.5);

        this.graphic.x = this.hitbox.x;
        this.graphic.y = this.hitbox.y;
        this.graphic.rotation = this.hitbox.rotation;

        this.velocity = 0;

        this.time = 0;
    }

    public updatePhysics(delta : number, gravity : number, maxVelocity : number){
        this.velocity += gravity*delta;

        this.velocity = Math.min(Math.abs(this.velocity), maxVelocity) * Math.sign(this.velocity); 

        

        const rotation = (this.velocity/22 + 9*this.graphic.rotation)/10

        this.graphic.rotation = rotation;
        this.hitbox.rotation = rotation;

        this.incrementPosition(0, this.velocity * delta);
    }
    public setVelocity(velocity : number){
        this.velocity = velocity;
    }

    public setPosition(x: number, y: number){
        this.graphic.x = x;
        this.hitbox.x = x;

        this.graphic.y = y;
        this.hitbox.y = y;
    }
    public setY(y : number){
        this.graphic.y = y;
        this.hitbox.y = y;
    }

    public undulateUpdate(delta: number, yPosition : number){
        this.time += delta;
        this.graphic.y = 20*Math.sin(this.time/15) + yPosition;
    }

    public setRotation(angle: number){
        this.graphic.rotation = angle;
        this.hitbox.rotation = angle;
    }

    public incrementPosition(x: number, y: number){
        this.graphic.x += x;
        this.hitbox.x += x;

        this.graphic.y += y;
        this.hitbox.y += y;
    }
}

export { Player };