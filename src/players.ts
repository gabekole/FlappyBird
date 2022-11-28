import { Sprite } from 'pixi.js'

class Player {
    public hitbox: Sprite;
    public graphic: Sprite;

    private velocity: number;

    constructor(graphic : Sprite, hitbox : Sprite){
        this.graphic = graphic;
        this.hitbox = hitbox;

        this.graphic.anchor.set(.5);
        this.hitbox.anchor.set(.5);

        this.graphic.x = this.hitbox.x;
        this.graphic.y = this.hitbox.y;
        this.graphic.rotation = this.hitbox.rotation;

        this.velocity = 0;
    }

    public updatePhysics(delta : number, gravity : number, maxVelocity : number){
        this.velocity += gravity*delta;

        this.velocity = Math.min(Math.abs(this.velocity), maxVelocity) * Math.sign(this.velocity); 

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

    public incrementPosition(x: number, y: number){
        this.graphic.x += x;
        this.hitbox.x += x;

        this.graphic.y += y;
        this.hitbox.y += y;
    }
    
    public setRotation(angle: number){
        this.graphic.rotation = angle;
        this.hitbox.rotation = angle;
    }

    public incrementRotation(angle: number){
        this.graphic.rotation += angle;
        this.hitbox.rotation += angle;
    }
}

export { Player };