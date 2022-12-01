import { TilingSprite, Texture, Resource } from 'pixi.js'


class HorizontalTilingSprite extends TilingSprite {

    // Sets width such that texture is tiled in that direction
    public setWidth(width : number){
        this.width = width;
    }

    // Sets height such that texture is scaled to reach the provided height
    // Ensures a 1:1 aspect ratio when scaling so there is no stretching
    public setHeight(height : number){
        const updateHeight = ()=>{
            const imageHeight = this.texture.height;
            this.height = height;
            let scale = height/imageHeight;
    
            this.tileScale = {x: scale, y: scale};
        }

        if (this.texture.valid){
            updateHeight();
            return;
        }

        this.texture.baseTexture.once('loaded', ()=>{
            updateHeight();
        });
    }
}

export default HorizontalTilingSprite;