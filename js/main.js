import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Set background color (light blue)
scene.background = new THREE.Color(0x87CEEB);

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);

// Global variable to hold our 3D object
let object;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file from GitHub
loader.load(
  "https://github.com/Maryyyy17/Atividade202/raw/refs/heads/main/modelo3dd/bee_minecraft%20(1).gltf",
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;
    
    // Scale and position the model
    object.scale.set(0.5, 0.5, 0.5);
    object.position.set(0, -1, 0);
    
    scene.add(object);
    
    console.log("Model loaded successfully!");
  },
  function (xhr) {
    // While it is loading, log the progress
    const percent = (xhr.loaded / xhr.total * 100);
    console.log(percent.toFixed(2) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error('Error loading model:', error);
  }
);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ alpha: false }); // alpha: false for colored background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadows

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene

// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Main directional light (like sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.receiveShadow = true;
scene.add(directionalLight);

// Fill light from the front
const fillLight = new THREE.DirectionalLight(0xffcc88, 0.5);
fillLight.position.set(-2, 3, 4);
scene.add(fillLight);

// Back light for rim lighting
const backLight = new THREE.DirectionalLight(0x88aaff, 0.3);
backLight.position.set(0, 2, -5);
scene.add(backLight);

// Add a subtle grid floor for reference
const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x444444);
gridHelper.position.y = -1;
scene.add(gridHelper);

// Add simple axes helper (optional)
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;
controls.enableZoom = true;
controls.target.set(0, -0.5, 0); // Look at center of model

// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls (for damping and auto-rotation)
  controls.update();
  
  renderer.render(scene, camera);
}

// Start animation
animate();

// Optional: Add some floating animation
let time = 0;
function floatingAnimation() {
  if (object) {
    time += 0.01;
    object.position.y = -1 + Math.sin(time) * 0.1; // Gentle floating
  }
  requestAnimationFrame(floatingAnimation);
}
floatingAnimation();