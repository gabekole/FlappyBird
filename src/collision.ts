import { Sprite } from 'pixi.js'
import { Pipe } from './pipe'

function floorCollides(spriteOne : Sprite, spriteFloor: Sprite){
    let ab = spriteOne.getBounds();
    let bb = spriteFloor.getBounds();

    return ab.y > bb.y || ab.y + ab.width > bb.y;
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

export { pipeCollides, floorCollides };