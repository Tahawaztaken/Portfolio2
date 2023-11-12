import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene()

// Instantiate a loader
const loader = new FBXLoader();

let earthMesh; // Store the reference to the loaded object

loader.load( 'assets/img/LookAround.fbx', function ( fbx ) {
    const root = fbx;
    root.scale.set(2, 2, 2);
    root.position.set(0, -0.6, 0);
    root.traverse(function(obj) { obj.frustumCulled = false; });
    earthMesh = fbx;

    // Assuming there's at least one animation
    if (fbx.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(fbx);
        const action = mixer.clipAction(fbx.animations[0]); // Assuming the first animation
        action.play();

        // You may want to store the mixer if you need to update it in the animate loop
        fbx.mixer = mixer;
    }

    scene.add(fbx);
    console.log(fbx);
}, undefined, function (error) {
    console.error(error);
});


const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(0, 2, 10)
scene.add(light)

const sizes = {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
camera.position.z = 1



scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Make the canvas background transparent
})

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = false;
controls.enableZoom = true;

controls.minPolarAngle = Math.PI / 2 - 0.4; // radians
controls.maxPolarAngle = Math.PI / 2 - 0.4 ; // radians

renderer.setSize(sizes.width, sizes.height) // Update canvas size on window resize




function animate() {
    requestAnimationFrame(animate)

    if (earthMesh && earthMesh.mixer) {
        earthMesh.mixer.update(0.016); // You can pass the time delta for smoother animation
    }

    controls.update();

    renderer.render(scene, camera)
}

animate()