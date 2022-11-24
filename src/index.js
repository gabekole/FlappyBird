import { Application, Container, Texture, Sprite, TextureSystem } from 'pixi.js'
import './styles/style.css'


const app = new Application({
     background: '#1099bb',
     antialias: true,
     autoDensity: true,
     width: 400,
     height: 400,
    });

const gameArea = document.getElementById('game-area')
gameArea.appendChild(app.view);

const container = new Container();

app.stage.addChild(container);


// Create a new texture
const texture = Texture.from('./assets/wing.png');

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.width = 50;
    bunny.height = 50
    bunny.anchor.set(0.5);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
}

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

container.interactive = true;
container.children[0].interactive = true;
container.on('click', (event) => {console.log('container clicked');});
container.children[0].on('click', (event) => {console.log('first bird clicked')})

// Listen for animate update
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    container.children[0].rotation -= 0.01 * delta;
    container.children[3].rotation += .1 * delta;
    container.rotation -= 0.01 * delta;
});
