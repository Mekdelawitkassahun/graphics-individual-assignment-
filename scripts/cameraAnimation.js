import * as THREE from 'three';

// Our camera's mood settings - should it dance or stay still?
let isAutoRotating = true;
let userInteracting = false;

export function animateCamera(camera, controls, clock) {
    // Let the camera dance around our chair (unless someone's controlling it)
    if (isAutoRotating && !userInteracting) {
        // Track how long we've been spinning
        const elapsedTime = clock.getElapsedTime();
        // Create a gentle circular motion, like a slow waltz
        camera.position.x = Math.sin(elapsedTime * 0.1) * 5; // Slow, graceful movement
        camera.position.z = Math.cos(elapsedTime * 0.1) * 5; // Keep our distance of 5 units
        camera.lookAt(0, 0, 0); // Always keep our eyes on the prize (the chair)
    }
    controls.update(); // Keep our controls smooth and responsive
}

export function setupCameraAnimation(controls) {
    // When someone grabs the controls, let them take the lead
    controls.addEventListener('start', () => {
        userInteracting = true;
    });
    
    // When they're done, we can resume our gentle dance
    controls.addEventListener('end', () => {
        userInteracting = false;
    });
}