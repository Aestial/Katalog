import RenderManager from './renderman';
import SceneManager from './sceneman';
import EffectManager from './effectman';
import ObjectPointer from './ObjectPointer';
import Logo from './Logo';
import ImprovedOrbitControl from './ImprovedOrbitControl';
import StatsManager from './statsman';
import LabelManager from './labelman';
import SlidesManager from './slidesman';

let renderman, sceneman, effectman;
let control, logo, pointer, labelman;
let statsman;

init();

function init() {
    const container = document.getElementById("three-container");
    // Render Manager
    renderman = new RenderManager(container);   
    // Pointer Manager
    pointer = new ObjectPointer(renderman.camera);
    // Scene Manager
    sceneman = new SceneManager(renderman.renderer);    
    // Label Manager
    labelman = new LabelManager(container, renderman.camera, sceneman.scene);
    // LOGO Manager
    logo = new Logo(pointer, object => {
        sceneman.add(object);
        animate();
    });
    // Effect Manager
    effectman = new EffectManager(renderman.camera, renderman.renderer, sceneman.scene);
    // Control Manager
    control = new ImprovedOrbitControl(renderman.camera, labelman.dom);
    // Slides
    window.slides = new SlidesManager(control);
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
    pointer.update();
    labelman.update();
    renderman.clear();
    effectman.render();
    control.update();
    statsman.update();
}
