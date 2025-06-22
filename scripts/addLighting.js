import * as THREE from 'three';

export function addLighting(scene) {
    // Create a warm, cozy atmosphere with ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffd1b3, 0.4);
    scene.add(ambientLight);

    // Add a primary directional light for dramatic shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 10, 7.5);
    
    // Add some accent lighting
    const spotLight = new THREE.SpotLight(0xff7f50, 0.5);
    spotLight.position.set(-5, 8, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 1.5;
    spotLight.distance = 20;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Add a subtle blue rim light for depth
    const rimLight = new THREE.DirectionalLight(0x4169e1, 0.3);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);
    
    // Let's make those shadows look fantastic
    directionalLight.castShadow = true;          // Yes, we want shadows!
    directionalLight.shadow.mapSize.width = 1024;  // High-quality shadows
    directionalLight.shadow.mapSize.height = 1024; // The higher the number, the crisper the shadows
    directionalLight.shadow.camera.near = 0.5;     // Start shadows close to objects
    directionalLight.shadow.camera.far = 50;      // And let them stretch far into the distance
    
    scene.add(directionalLight);

    // Add a spotlight above the lamp with pulsing intensity
    const lampSpot = new THREE.SpotLight(0xffffcc, 1.2, 10, Math.PI/7, 0.4, 1.5);
    lampSpot.position.set(0, 2.2, -2.5);
    lampSpot.castShadow = true;
    scene.add(lampSpot);
    // Animate lampSpot intensity in main.js animation loop (see main.js for details)
}