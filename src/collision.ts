import { Sprite } from 'pixi.js'

function boxCollides(spriteOne : Sprite, spriteTwo: Sprite){
    var ab = spriteOne.getBounds();
    var bb = spriteTwo.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

export { boxCollides };