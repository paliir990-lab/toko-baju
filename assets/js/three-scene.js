let scene3D = {
    scene: null,
    camera: null,
    renderer: null,
    object: null,
    particles: [],
    rings: [],
    targetRotY: 0,
    targetRotX: 0,
    currentRotY: 0,
    currentRotX: 0,
    mouseX: 0,
    mouseY: 0,
    scrollY: 0,
    clock: null
};

function init3D() {
    const container = document.getElementById('scene-container');
    if (!container) return;

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.5;

    scene3D.scene = new THREE.Scene();

    scene3D.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    scene3D.camera.position.z = 5;

    scene3D.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    scene3D.renderer.setSize(container.clientWidth, container.clientHeight);
    scene3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    scene3D.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    scene3D.renderer.toneMappingExposure = 1.5;
    container.appendChild(scene3D.renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x222233, 0.5);
    scene3D.scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xc9a84c, 2);
    mainLight.position.set(2, 3, 4);
    scene3D.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
    fillLight.position.set(-3, -1, 2);
    scene3D.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, -2, -3);
    scene3D.scene.add(rimLight);

    // Main object: TorusKnot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xc9a84c,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xc9a84c,
        emissiveIntensity: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2
    });
    scene3D.object = new THREE.Mesh(geometry, material);
    scene3D.scene.add(scene3D.object);

    // Inner ring
    const ringGeo = new THREE.TorusGeometry(0.8, 0.05, 32, 64);
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0x00d4ff,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = 0.3;
    scene3D.rings.push(ring);
    scene3D.scene.add(ring);

    // Outer ring
    const ringGeo2 = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
    const ringMat2 = new THREE.MeshPhysicalMaterial({
        color: 0xc9a84c,
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.3
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = 0.8;
    ring2.rotation.y = 0.5;
    scene3D.rings.push(ring2);
    scene3D.scene.add(ring2);

    // Particles
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xc9a84c,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene3D.particles.push(particleSystem);
    scene3D.scene.add(particleSystem);

    scene3D.clock = new THREE.Clock();

    // Events
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll3D);
    window.addEventListener('resize', onResize3D);

    animate3D();
}

function onMouseMove(e) {
    scene3D.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    scene3D.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onScroll3D() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scene3D.targetRotY = scrollPercent * Math.PI * 3;
    scene3D.scrollY = scrollPercent;
}

function onResize3D() {
    const container = document.getElementById('scene-container');
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    scene3D.camera.aspect = w / h;
    scene3D.camera.updateProjectionMatrix();
    scene3D.renderer.setSize(w, h);
}

function animate3D() {
    requestAnimationFrame(animate3D);

    const dt = scene3D.clock.getDelta();

    // Smooth rotation
    scene3D.currentRotY += (scene3D.targetRotY - scene3D.currentRotY) * 0.05;
    scene3D.currentRotX += (scene3D.mouseY * 0.3 - scene3D.currentRotX) * 0.05;

    // Main object
    if (scene3D.object) {
        scene3D.object.rotation.y = scene3D.currentRotY;
        scene3D.object.rotation.x = scene3D.currentRotX * 0.3;
        scene3D.object.rotation.z = Math.sin(Date.now() * 0.0003) * 0.05;

        // Gentle floating
        scene3D.object.position.y = Math.sin(Date.now() * 0.0005) * 0.1;
    }

    // Rings
    scene3D.rings.forEach((ring, i) => {
        ring.rotation.z += dt * (0.2 + i * 0.1);
        ring.rotation.x += dt * (0.1 + i * 0.05);
        ring.rotation.y += dt * (0.15 + i * 0.08);
    });

    // Particles
    scene3D.particles.forEach(p => {
        p.rotation.y += dt * 0.02;
        p.rotation.x += dt * 0.01;
    });

    scene3D.renderer.render(scene3D.scene, scene3D.camera);
}

function destroy3D() {
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll3D);
    window.removeEventListener('resize', onResize3D);
    const container = document.getElementById('scene-container');
    if (container && scene3D.renderer) {
        container.removeChild(scene3D.renderer.domElement);
    }
    if (scene3D.object) {
        scene3D.object.geometry.dispose();
        scene3D.object.material.dispose();
    }
    scene3D.renderer?.dispose();
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        init3D();
    }
});
