import * as THREE from 'three';

export function createProduct() {
    // Living room group
    const room = new THREE.Group();

    // --- Materials ---
    let woodTexture;
    try {
        woodTexture = new THREE.TextureLoader().load(
            'https://threejs.org/examples/textures/hardwood2_diffuse.jpg',
            undefined,
            undefined,
            (err) => {
                const errorDiv = document.getElementById('error-message');
                if (errorDiv) {
                    errorDiv.textContent = 'A texture failed to load. Please check your internet connection or asset URL.';
                    errorDiv.style.display = 'block';
                }
                console.error('Texture failed to load:', err);
            }
        );
    } catch (e) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = 'Unexpected error loading texture.';
            errorDiv.style.display = 'block';
        }
        console.error('Unexpected error:', e);
    }
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 2);
    const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.8, metalness: 0.2 });
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7, metalness: 0.1 });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x5C2E00, roughness: 0.8, metalness: 0.1 });

    // --- Place Sofa (facing TV, centered) ---
    const sofa = new THREE.Group();
    // Sofa seat
    const sofaSeat = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.25, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x6b4f2c, roughness: 0.7 })
    );
    sofaSeat.name = "Sofa Seat";
    sofaSeat.position.set(0, 0.5, 0);
    sofaSeat.castShadow = sofaSeat.receiveShadow = true;
    sofa.add(sofaSeat);
    // Sofa back
    const sofaBack = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.7, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x7c5c36, roughness: 0.7 })
    );
    sofaBack.name = "Sofa Back";
    sofaBack.position.set(0, 0.97, -0.46);
    sofaBack.castShadow = sofaBack.receiveShadow = true;
    sofa.add(sofaBack);
    // Sofa left arm
    const sofaArmL = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.45, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x7c5c36, roughness: 0.7 })
    );
    sofaArmL.name = "Sofa Left Arm";
    sofaArmL.position.set(-1.21, 0.72, 0);
    sofaArmL.castShadow = sofaArmL.receiveShadow = true;
    sofa.add(sofaArmL);
    // Sofa right arm
    const sofaArmR = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.45, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x7c5c36, roughness: 0.7 })
    );
    sofaArmR.name = "Sofa Right Arm";
    sofaArmR.position.set(1.21, 0.72, 0);
    sofaArmR.castShadow = sofaArmR.receiveShadow = true;
    sofa.add(sofaArmR);
    // Sofa cushions
    for (let i = -1; i <= 1; i++) {
        const cushion = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.18, 0.95),
            new THREE.MeshStandardMaterial({ color: 0x8d6e4a, roughness: 0.6 })
        );
        cushion.name = `Sofa Cushion ${i+2}`;
        cushion.position.set(i * 0.8, 0.67, 0);
        cushion.castShadow = cushion.receiveShadow = true;
        sofa.add(cushion);
    }
    // --- Add Pillows to Sofa ---
    const pillow1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.13, 0.32),
        new THREE.MeshStandardMaterial({ color: 0xfaf0e6, roughness: 0.7 })
    );
    pillow1.name = "Pillow 1";
    pillow1.position.set(-1.05, 0.75, 0.25);
    pillow1.rotation.z = 0.12;
    pillow1.castShadow = pillow1.receiveShadow = true;
    sofa.add(pillow1);
    const pillow2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.13, 0.32),
        new THREE.MeshStandardMaterial({ color: 0xadd8e6, roughness: 0.7 })
    );
    pillow2.name = "Pillow 2";
    pillow2.position.set(1.05, 0.75, -0.18);
    pillow2.rotation.z = -0.1;
    pillow2.castShadow = pillow2.receiveShadow = true;
    sofa.add(pillow2);
    sofa.position.set(0, -0.5, 2.2);
    sofa.rotation.y = Math.PI;
    room.add(sofa);

    // --- Coffee Table (center, in front of sofa) ---
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.2), woodMaterial);
    tableTop.name = "Table Top";
    tableTop.position.set(0, 0.5, 0.5);
    tableTop.castShadow = tableTop.receiveShadow = true;
    room.add(tableTop);
    // Table legs
    const tableLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const tableLegPositions = [
        [-0.9, 0, 1.0], [0.9, 0, 1.0], [-0.9, 0, 0.0], [0.9, 0, 0.0]
    ];
    tableLegPositions.forEach((pos, i) => {
        const leg = new THREE.Mesh(tableLegGeometry, woodMaterial);
        leg.name = `Table Leg ${i+1}`;
        leg.position.set(...pos);
        leg.castShadow = leg.receiveShadow = true;
        room.add(leg);
    });

    // --- TV & Wall (at -Z) ---
    // Wall
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(10, 4, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.8, metalness: 0.05 })
    );
    wall.name = "Wall";
    wall.position.set(0, 1.5, -5);
    wall.receiveShadow = true;
    room.add(wall);
    // TV body (bigger)
    const tvBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 1.3, 0.13),
        new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 })
    );
    tvBody.name = "TV Body";
    tvBody.position.set(0, 1.45, -4.7);
    tvBody.castShadow = tvBody.receiveShadow = true;
    room.add(tvBody);
    // TV screen (bigger)
    const tvScreen = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.05, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x1e90ff, emissive: 0x1e90ff, emissiveIntensity: 0.7 })
    );
    tvScreen.name = "TV Screen";
    tvScreen.position.set(0, 1.45, -4.63);
    tvScreen.castShadow = tvScreen.receiveShadow = false;
    room.add(tvScreen);
    // TV stand
    const tvStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    tvStand.name = "TV Stand";
    tvStand.position.set(0, 0.85, -4.7);
    tvStand.castShadow = tvStand.receiveShadow = true;
    room.add(tvStand);

    // --- Lamp (corner) ---
    const lampStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 })
    );
    lampStand.name = "Lamp Stand";
    lampStand.position.set(-2.5, 0.6, 2.5);
    lampStand.castShadow = lampStand.receiveShadow = true;
    room.add(lampStand);
    const lampBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffff99, emissiveIntensity: 1.2 })
    );
    lampBulb.name = "Lamp Bulb";
    lampBulb.position.set(-2.5, 1.25, 2.5);
    lampBulb.castShadow = lampBulb.receiveShadow = false;
    room.add(lampBulb);
    const lampShade = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0xffe4b5, metalness: 0.2, roughness: 0.7, transparent: true, opacity: 0.7 })
    );
    lampShade.name = "Lamp Shade";
    lampShade.position.set(-2.5, 1.45, 2.5);
    lampShade.castShadow = lampShade.receiveShadow = false;
    room.add(lampShade);

    // --- Decorate Flower on Table (center) ---
    // Vase
    const vase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.12, 0.18, 18),
        new THREE.MeshStandardMaterial({ color: 0xadd8e6, roughness: 0.5, metalness: 0.3 })
    );
    vase.name = "Flower Vase";
    vase.position.set(0, 0.67, 0.5);
    vase.castShadow = vase.receiveShadow = true;
    room.add(vase);
    // Stem
    const flowerStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12),
        new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.5 })
    );
    flowerStem.name = "Flower Stem";
    flowerStem.position.set(0, 0.77, 0.5);
    flowerStem.castShadow = flowerStem.receiveShadow = true;
    room.add(flowerStem);
    // Blossom (center)
    const flowerBlossom = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.4 })
    );
    flowerBlossom.name = "Flower Blossom";
    flowerBlossom.position.set(0, 0.97, 0.5);
    flowerBlossom.castShadow = flowerBlossom.receiveShadow = true;
    room.add(flowerBlossom);
    // Petals
    const petalColor = 0xffb6c1;
    const petalGeom = new THREE.SphereGeometry(0.07, 12, 12);
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.13;
        const z = Math.sin(angle) * 0.13;
        const petal = new THREE.Mesh(
            petalGeom,
            new THREE.MeshStandardMaterial({ color: petalColor, roughness: 0.5 })
        );
        petal.name = `Petal ${i+1}`;
        petal.position.set(x, 0.97, 0.5 + z);
        petal.scale.set(1, 0.5, 1.2);
        petal.castShadow = petal.receiveShadow = true;
        room.add(petal);
    }
    // Flower center (yellow)
    const flowerCenter = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffe066, roughness: 0.3 })
    );
    flowerCenter.name = "Flower Center";
    flowerCenter.position.set(0, 0.99, 0.5);
    flowerCenter.castShadow = flowerCenter.receiveShadow = true;
    room.add(flowerCenter);

    // --- Animation properties ---
    room.userData.lampBulb = lampBulb;
    room.userData.lampBaseY = lampBulb.position.y;
    room.userData.tvScreen = tvScreen;

    return room;
}