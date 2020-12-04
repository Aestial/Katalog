import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

export default class EffectManager {
    constructor(camera, renderer, scene) {
        this.data = data.effectman;
        this.layers = data.layers;
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        // GUI
        this.gui = new GUI({name: 'Effects control', closed: true});
        this.gui.width = 200;
        const bloomfolder = this.gui.addFolder('Bloom');
        bloomfolder.add(this.data.bloom, 'enabled');
        bloomfolder.open();
        const ssaofolder = this.gui.addFolder('SSAO');
        ssaofolder.add(this.data.ssao, 'enabled');
        ssaofolder.open();        
        this.gui.add(this.data, 'scale').min(0.5).max(2.5);
        // Materials
        this.materials = {};
        this.darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
        // Bloom layer
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.layers.BLOOM_SCENE);
        // Render Pass
        this.renderPass = new RenderPass( this.scene, this.camera );
        // Bloom Pass (Unreal)
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.outerHeight ), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = this.data.bloom.threshold;
        this.bloomPass.strength = this.data.bloom.strength;
        this.bloomPass.radius = this.data.bloom.radius;
        // Bloom Composer
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(this.renderPass);
        this.bloomComposer.addPass(this.bloomPass);
        // SSAO Pass
        this.ssaoPass = new SSAOPass(this.scene, this.camera, this.renderer.width, this.renderer.height);
        this.ssaoPass.kernelRadius = this.data.ssao.kernelRadius;
        this.ssaoPass.kernelSize = this.data.ssao.kernelSize;
        this.ssaoPass.minDistance = this.data.ssao.minDistance;
        this.ssaoPass.maxDistance = this.data.ssao.maxDistance;
        // Final Pass
        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
                fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {
                    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
                }`,
                defines: {},
            } ), "baseTexture"
        );
        this.finalPass.needsSwap = true;
        // Final Composer
        this.finalComposer = new EffectComposer(this.renderer);
        this.finalComposer.addPass(this.renderPass);
        this.finalComposer.addPass(this.ssaoPass);
        this.finalComposer.addPass(this.finalPass);
         // Events
         window.addEventListener('resize', this.onWindowResize.bind(this), false);
         this.onWindowResize();
    }
    render() {
        // Enable/Disable passes
        this.bloomPass.enabled = this.data.bloom.enabled;
        this.ssaoPass.enabled = this.data.ssao.enabled;
        // Render selective Bloom
        this.scene.traverse(this.darkenNonBloomed.bind(this));
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial.bind(this));
        this.finalComposer.render();
    }
    setSize(width, height) {
        this.bloomComposer.setSize(width*this.data.scale, height*this.data.scale);
        this.finalComposer.setSize(width*this.data.scale, height*this.data.scale);
    }
    darkenNonBloomed(obj) {
        if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false ) {
            this.materials[ obj.uuid ] = obj.material;
            obj.material = this.darkMaterial;
        }
    }
    restoreMaterial(obj) {
        if ( this.materials[ obj.uuid ] ) {
            obj.material = this.materials[ obj.uuid ];
            delete this.materials[ obj.uuid ];
        }
    }
    onWindowResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        // Composers
        this.setSize(w*this.data.scale, h*this.data.scale);
        // render();
    }
}