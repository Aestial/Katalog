import RenderManager from './renderman';
import SceneManager from './sceneman';
import EffectManager from './effectman';
import PointerManager from './pointman';
import LogoManager from './logoman';
import ControlManager from './controlman';
import StatsManager from './statsman';
import LabelManager from './labelman';
import SlidesManager from './slidesman';

let renderman, sceneman, effectman;
let controlman, logoman, pointerman, labelman;
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
    // Label Manager
    labelman = new LabelManager(container, renderman.camera, sceneman.scene);
    // LOGO Manager
    logoman = new LogoManager(pointerman, object => {
        sceneman.add(object);
        animate();
    }, labelman);
    // Effect Manager
    effectman = new EffectManager(renderman.camera, renderman.renderer, sceneman.scene);
    // Control Manager
    controlman = new ControlManager(renderman.camera, labelman.dom);
    // Slides
    window.slides = new SlidesManager(controlman);
    // Stats
    statsman = new StatsManager(container);
    // Start    
    render();
}

function animate() {
    requestAnimationFrame(animate);
    // setTimeout(() => {
        
    // }, 1000 / 30);
    render();
}
function render() {
    pointerman.update();
    labelman.update();
    renderman.clear();
    effectman.render();
    controlman.update();
    statsman.update();
}
