import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene() {
    // Welcome to our 3D world! Let's create an elegant environment
    const scene = new THREE.Scene();
    
    // Create a subtle gradient background
    const bgTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/gradient.jpg');
    scene.background = bgTexture;
    
    // Add a beautiful ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Our virtual eye into the scene - a camera that works just like a real one!
    // We'll use perspective (like human vision) with a natural 75° field of view
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Let's find our canvas - our window into the 3D world
    const canvas = document.querySelector('#c');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Time to set up our renderer - the artist that paints our 3D scene
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true,  // Makes edges smooth and pretty
        alpha: true       // Allows for transparent backgrounds if we want
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Keeps things crisp but efficient
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Nice, soft shadows for realism

    // Add some magic with OrbitControls - lets us spin around our scene
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;      // Smooth camera movements
    controls.dampingFactor = 0.05;      // Not too fast, not too slow
    controls.screenSpacePanning = false; // Keeps the camera movement natural
    controls.minDistance = 2;           // Don't get too close!
    controls.maxDistance = 10;          // Or too far away

    // Make sure everything looks good even when the window size changes
    window.addEventListener('resize', () => {
        // Update the camera's view
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // And tell our renderer about the new size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    return { scene, camera, renderer, controls };
}