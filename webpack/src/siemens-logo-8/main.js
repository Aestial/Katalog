import RenderManager from './renderman';
import SceneManager from './sceneman';
import EffectManager from './effectman';
import PointerManager from './pointman';
import LogoManager from './logoman';
import ControlManager from './controlman';
import StatsManager from './statsman';

let renderman, sceneman, effectman;
let logoman, pointerman;
let statsman;

init();

function init() {
    const container = document.getElementById("three-container");
    // Render Manager
    renderman = new RenderManager(container);   
    // Pointer Manager
    pointerman = new PointerManager(renderman.camera);
    // Scene Manager
    sceneman = new SceneManager(renderman.renderer);   
    // LOGO Manager
    logoman = new LogoManager(pointerman, object => {
        sceneman.add(object);
        animate();
    });    
    // Effect Manager
    effectman = new EffectManager(renderman.camera, renderman.renderer, sceneman.scene);
    // Control Manager
    new ControlManager(renderman.camera, renderman.dom);
    // Stats
    statsman = new StatsManager(container);

    // Initialize actions
    window.logoman = logoman;
    render();
}

function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / 30);
    render();
}
function render() {
    pointerman.update();
    renderman.clear();
    effectman.render();
    statsman.update();
}
