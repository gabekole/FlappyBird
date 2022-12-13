import { Sprite, Container, AnimatedSprite, Texture, Spritesheet, BaseTexture } from 'pixi.js'

import constants from './constants'

import playerSheet from '../public/assets/player/spritesheet'
import frame1 from '../public/assets/player/frame1.png'

class Player extends Container{
    private hitbox: Sprite;
    private graphic: AnimatedSprite;

    private velocity: number;
    private time: number;

    constructor(){
        super();


        this.graphic = new AnimatedSprite([Texture.WHITE])

        const spritesheet = new Spritesheet(
            BaseTexture.from(playerSheet.meta.image),
            playerSheet,
        );

        spritesheet.parse().then(() => {
            this.graphic = new AnimatedSprite(spritesheet.animations.frame);
            this.updateSprites();
            this.graphic.animationSpeed = .13;
            this.graphic.play();
        });


        this.velocity = 0;
        this.time = 0;

        this.updateSprites();
    }

    private updateSprites() {
        this.removeChildren();

        this.graphic.width = constants['player']['width'];
        this.graphic.height = constants['player']['height'];
        this.hitbox = new Sprite();
        this.hitbox.width = constants['player']['hitboxWidth'];
        this.hitbox.height = constants['player']['hitboxHeight'];

        this.graphic.y = 0;
        this.graphic.x = 0;
        this.hitbox.y = 0;
        this.hitbox.x = 0;

        this.graphic.anchor.set(.5);
        this.hitbox.anchor.set(.5);

        this.graphic.rotation = this.hitbox.rotation;

        this.addChild(this.graphic);
        this.addChild(this.hitbox);
    }

    public setAnimationSpeed(speed : number) {
        this.graphic.animationSpeed = speed;
    }

    public flapWings(){
        if (this.velocity > -4){
            this.graphic.gotoAndPlay(4);
        }
    }

    public updatePhysics(delta : number, gravity : number, maxVelocity : number){
        this.velocity += gravity*delta;

        this.velocity = Math.min(Math.abs(this.velocity), maxVelocity) * Math.sign(this.velocity); 

        const rotation = (this.velocity/22 + 9*this.rotation)/10

        this.rotation = rotation;

        this.y += this.velocity * delta;
        
        if(this.velocity > 10){
            this.graphic.gotoAndPlay(1);
            this.setAnimationSpeed(0);
        }
        else{
            this.setAnimationSpeed(.13);
        }
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