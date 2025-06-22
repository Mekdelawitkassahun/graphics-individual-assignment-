console.log('Main script loading...');

// Let's gather all the tools we need for our 3D adventure
import * as THREE from 'three';
import { initScene } from './scripts/initScene.js';
import { createProduct } from './scripts/createProduct.js';
import { addLighting } from './scripts/addLighting.js';
import { animateCamera, setupCameraAnimation } from './scripts/cameraAnimation.js';
import { setupInteraction } from './scripts/interaction.js';

console.log('All modules imported successfully');

try {
    // First, let's create our stage - the scene, camera, and everything we need to see
    const { scene, camera, renderer, controls } = initScene();
    if (!scene || !camera || !renderer || !controls) {
        throw new Error('Scene initialization failed');
    }
    console.log('Scene initialized');

    // Time to bring our star to the stage - a beautiful chair!
    const product = createProduct();
    scene.add(product);
    console.log('Product created and added to scene');

    // Let's set the mood with perfect lighting
    addLighting(scene);
    console.log('Lighting added');

    // Add some life to our scene with a dancing camera
    setupCameraAnimation(controls);
    console.log('Camera animation setup complete');

    // Make everything interactive - let people explore!
    setupInteraction(camera, scene, renderer);
    console.log('Interaction setup complete');

    // Our trusty timekeeper for animations
    const clock = new THREE.Clock();

    // Add a Reset View button to the UI
    document.body.insertAdjacentHTML('beforeend', `<button id="reset-view" style="position:fixed;top:20px;right:20px;z-index:10;padding:10px 18px;font-size:1rem;border-radius:6px;border:none;background:#4169e1;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer;">Reset View</button>`);

    const resetBtn = document.getElementById('reset-view');
    resetBtn.addEventListener('click', () => {
        camera.position.set(0, 2, 5);
        controls.target.set(0, 0.5, 0);
        controls.update();
    });

    // --- Animation for lamp floating and TV screen color cycling ---
    const lampBulb = product.userData.lampBulb;
    const lampBaseY = product.userData.lampBaseY;
    const tvScreen = product.userData.tvScreen;
    const tvColors = [0x1e90ff, 0x00ff99, 0xff69b4, 0xffff00, 0xffffff];
    let tvColorIdx = 0;
    let lastTvChange = 0;

    // Reference the lampSpot from addLighting.js
    let lampSpot;
    if (typeof addLighting === 'function') {
        // Patch addLighting to expose lampSpot
        const origAddLighting = addLighting;
        addLighting = function(scene) {
            const result = origAddLighting(scene);
            lampSpot = scene.children.find(obj => obj.isSpotLight && obj.position.x === 0 && obj.position.z === -2.5);
            return result;
        };
    }

    // The heart of our animation - keeping everything alive and moving
    function animate() {
        requestAnimationFrame(animate);     // Schedule our next performance
        animateCamera(camera, controls, clock); // Let the camera dance
        // Animate lamp floating
        if (lampBulb) {
            lampBulb.position.y = lampBaseY + Math.sin(performance.now() * 0.002) * 0.08;
        }
        // Animate TV screen color cycling
        if (tvScreen) {
            const now = performance.now();
            if (now - lastTvChange > 1000) {
                tvColorIdx = (tvColorIdx + 1) % tvColors.length;
                tvScreen.material.color.set(tvColors[tvColorIdx]);
                tvScreen.material.emissive.set(tvColors[tvColorIdx]);
                lastTvChange = now;
            }
        }
        // Animate lampSpot pulsing
        if (lampSpot) {
            lampSpot.intensity = 1.2 + Math.sin(performance.now() * 0.003) * 0.5;
        }
        renderer.render(scene, camera);     // Paint the scene for all to see
    }

    console.log('Starting animation loop');
    animate();

} catch (error) {
    // If anything goes wrong, let's handle it gracefully
    console.error('Error in main.js:', error);
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}