import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/shaders/CopyShader.js';

const scene = new THREE.Scene();
const loader = new FBXLoader();
let earthMesh, mixer, lookAroundAction, idleAction;

// Load the LookAround animation first
loader.load('assets/img/LookAround.fbx', function (fbx) {
    const root = fbx;
    root.scale.set(2, 2, 2);
    root.position.set(0, -0.59, 0);
    root.traverse(obj => { obj.frustumCulled = false; });

    earthMesh = fbx;
    scene.add(earthMesh);

    mixer = new THREE.AnimationMixer(earthMesh);
    lookAroundAction = mixer.clipAction(fbx.animations[0]);
    lookAroundAction.setLoop(THREE.LoopOnce);
    lookAroundAction.clampWhenFinished = true;
    lookAroundAction.timeScale = 5;
    lookAroundAction.play();

    // After LookAround ends, switch to NeutralIdle
    mixer.addEventListener('finished', function () {
      idleAction.reset();
      idleAction.crossFadeFrom(lookAroundAction, 0.2, true);
      idleAction.play();
  });
  

    // Now load the idle animation separately
    loader.load('assets/img/NeutralIdle.fbx', function (idleFbx) {
        idleAction = mixer.clipAction(idleFbx.animations[0]);
        idleAction.setLoop(THREE.LoopRepeat);
        idleAction.clampWhenFinished = false;
    });
}, undefined, function (error) {
    console.error(error);
});

// lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 2, 3);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(5, 0, 1);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(-5, 0, 1);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(0, 0, -5);
scene.add(light4);

// camera, renderer, controls
const parentContainer = document.getElementById("home-perfil");
const sizes = {
    width: parentContainer.offsetWidth * 1.25,
    height: parentContainer.offsetHeight * 1.1
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 0.67;
camera.position.x = -0.1;

const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableDamping = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 2 - 0.4;
controls.maxPolarAngle = Math.PI / 2 - 0.4;

// EffectComposer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// animate loop
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(0.005); // Small delta time for smooth animation
    }

    controls.update();
    composer.render();
}
animate();
