import { Sprite } from 'pixi.js'
import { Pipe } from './pipe'

function boxCollides(spriteOne : Sprite, spriteTwo: Sprite){
    let ab = spriteOne.getBounds();
    let bb = spriteTwo.getBounds();

    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function pipeCollides(spriteOne : Sprite, pipe : Pipe)
{
    let spriteBounds = spriteOne.getBounds();
    let topPipeBounds = pipe.getTopPipeBounds();
    let bottomPipeBounds = pipe.getBottomPipeBounds();

    let collidesBottom = spriteBounds.x + spriteBounds.width > bottomPipeBounds.x &&
                        spriteBounds.x < bottomPipeBounds.x + bottomPipeBounds.width && 
                        spriteBounds.y + spriteBounds.height > bottomPipeBounds.y;

    let collidesTop = spriteBounds.x + spriteBounds.width > topPipeBounds.x &&
                        spriteBounds.x < topPipeBounds.x + topPipeBounds.width && 
                        spriteBounds.y < topPipeBounds.y + topPipeBounds.height;

    return collidesBottom || collidesTop;
}

export { boxCollides, pipeCollides };