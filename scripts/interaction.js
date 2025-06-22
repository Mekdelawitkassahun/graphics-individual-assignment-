import * as THREE from 'three';

// Keep track of what we're pointing at and remember its original color and scale
let intersectedObject = null;
const originalColors = new Map();
const originalScales = new Map();

export function setupInteraction(camera, scene, renderer) {
    // Our magic wand - the raycaster that detects what we're pointing at
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const infoPanel = document.getElementById('info-panel');

    // Watch for when the mouse moves or clicks
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('click', onClick, false);

    function onMouseMove(event) {
        // Convert mouse position to 3D space coordinates
        // Think of it as drawing a line from your eye through the mouse into the scene
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Cast our magic ray into the scene
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // If we were pointing at something before, let's return its original color and scale
        if (intersectedObject) {
            intersectedObject.material.color.set(originalColors.get(intersectedObject));
            if (originalScales.has(intersectedObject)) {
                intersectedObject.scale.copy(originalScales.get(intersectedObject));
            }
            intersectedObject = null;
        }

        // Did we find something new to point at?
        if (intersects.length > 0) {
            const firstIntersect = intersects[0].object;
            if (firstIntersect.isMesh) {
                intersectedObject = firstIntersect;
                // Remember its original color if we haven't already
                if (!originalColors.has(intersectedObject)) {
                    originalColors.set(intersectedObject, intersectedObject.material.color.clone());
                }
                // Remember its original scale if we haven't already
                if (!originalScales.has(intersectedObject)) {
                    originalScales.set(intersectedObject, intersectedObject.scale.clone());
                }
                // Give it a friendly red glow to show it's selected
                intersectedObject.material.color.set(0xff0000);
                // Scale up for highlight
                intersectedObject.scale.set(1.1, 1.1, 1.1);
            }
        }
    }

    function onClick(event) {
        // When we click something, show its name in a friendly pop-up
        if (intersectedObject) {
            infoPanel.innerText = `Part: ${intersectedObject.name}`;
            infoPanel.style.display = 'block';

            // Let the info fade away after a moment
            setTimeout(() => {
                infoPanel.style.display = 'none';
            }, 2000);
        }
    }
}