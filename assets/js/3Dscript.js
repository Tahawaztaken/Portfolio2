import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/shaders/CopyShader.js';
const scene = new THREE.Scene()

// Instantiate a loader
const loader = new FBXLoader();

let earthMesh; // Store the reference to the loaded object
//'assets/img/NeutralIdle.fbx'
//'assets/img/LookAround.fbx'
loader.load( 'assets/img/NeutralIdle.fbx', function ( fbx ) {
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

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 2, 3)
scene.add(light)

const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(5, 0, 1)
scene.add(light2)

const light3 = new THREE.DirectionalLight(0xffffff, 1)
light3.position.set(-5, 0, 1)
scene.add(light3)

const light4 = new THREE.DirectionalLight(0xffffff, 1)
light4.position.set(0, 0, -5)
scene.add(light4)



const parentContainer = document.getElementById("home-perfil");

const sizes = {
    width: parentContainer.offsetWidth * 1.25,
    height: parentContainer.offsetHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
camera.position.z = 0.7
scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Make the canvas background transparent
})

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableDamping = false;
controls.enableZoom = false;

controls.minPolarAngle = Math.PI / 2 - 0.4; // radians
controls.maxPolarAngle = Math.PI / 2 - 0.4 ; // radians


//MEDIA SCREEN 340PX
function handleScreenChangeSmall(mediaQuery) {
    if (mediaQuery.matches) {
      // The screen width is below 340px, so you can execute your code here
      const newWidth = 230;
      const newHeight = sizes.height;

      console.log("Screen width is below 340px");
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    }
  }
const mediaQuerySmall = window.matchMedia("(max-width: 340px)");
mediaQuerySmall.addEventListener('change', handleScreenChangeSmall);;

//MEDIA SCREEN 341 - 576PX
function handleScreenChangeMedium(mediaQuery) {
    if (mediaQuery.matches) {
      // The screen width is below 340px, so you can execute your code here
      const newWidth = 280;
      const newHeight = sizes.height;

      console.log("Screen width is below 340px");
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    }
  }
const mediaQueryMedium = window.matchMedia("(min-width: 341px) and (max-width: 1149px)");
mediaQueryMedium.addEventListener('change', handleScreenChangeMedium);;

//MEDIA SCREEN 341 - 576PX
function handleScreenChangeLarge(mediaQuery) {
    if (mediaQuery.matches) {
      // The screen width is below 340px, so you can execute your code here
      const newWidth = 430;
      const newHeight = sizes.height * 1.5;

      console.log("Screen width is below 340px");
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    }
  }
const mediaQueryLarge = window.matchMedia("(min-width: 1150px)");
mediaQueryLarge.addEventListener('change', handleScreenChangeLarge);;

renderer.setSize(sizes.width, sizes.height);

// Create an EffectComposer
const composer = new EffectComposer(renderer);

// Add a RenderPass to render the scene
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);



function animate() {
    requestAnimationFrame(animate);

    if (earthMesh && earthMesh.mixer) {
        earthMesh.mixer.update(0.005); // You can pass the time delta for smoother animation
    }

    controls.update();

    composer.render();
}
animate()