;(function () {
    'use strict';

    if (typeof THREE === 'undefined') {
        console.warn('[3D] Three.js not loaded');
        return;
    }

    var container = document.getElementById('scene-container');
    if (!container) {
        console.warn('[3D] Container not found');
        return;
    }

    var scene, camera, renderer, mainObject, clock;
    var rings = [];
    var targetRotY = 0, targetRotX = 0;
    var currentRotY = 0, currentRotX = 0;
    var mouseX = 0, mouseY = 0;

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 5.5);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        var ambient = new THREE.AmbientLight(0x222244, 0.6);
        scene.add(ambient);

        var light1 = new THREE.DirectionalLight(0xc9a84c, 2);
        light1.position.set(3, 4, 5);
        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0x4488ff, 0.8);
        light2.position.set(-4, 2, 3);
        scene.add(light2);

        var light3 = new THREE.DirectionalLight(0xffffff, 0.3);
        light3.position.set(0, -3, -4);
        scene.add(light3);

        var geo = new THREE.TorusKnotGeometry(1.1, 0.35, 100, 12);
        var mat = new THREE.MeshStandardMaterial({
            color: 0xc9a84c,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x352a0c,
            emissiveIntensity: 0.1
        });
        mainObject = new THREE.Mesh(geo, mat);
        scene.add(mainObject);

        var ringGeo = new THREE.TorusGeometry(0.7, 0.04, 24, 48);
        var ringMat = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            metalness: 0.4,
            roughness: 0.4,
            transparent: true,
            opacity: 0.5
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        rings.push(ring);

        var ringGeo2 = new THREE.TorusGeometry(1.7, 0.02, 16, 64);
        var ringMat2 = new THREE.MeshStandardMaterial({
            color: 0xc9a84c,
            metalness: 0.2,
            roughness: 0.6,
            transparent: true,
            opacity: 0.2
        });
        var ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.x = 0.8;
        scene.add(ring2);
        rings.push(ring2);

        var particleCount = 60;
        var positions = new Float32Array(particleCount * 3);
        var sizes = new Float32Array(particleCount);
        for (var i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
            sizes[i] = 0.02 + Math.random() * 0.03;
        }
        var pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        var pMat = new THREE.PointsMaterial({
            color: 0xc9a84c,
            size: 0.035,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        var particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        clock = new THREE.Clock();

        document.addEventListener('mousemove', onMouse);
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);

        animate();
    }

    function onMouse(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onScroll() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? window.scrollY / max : 0;
        targetRotY = pct * Math.PI * 4;
    }

    function onResize() {
        var w = container.clientWidth;
        var h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    function animate() {
        requestAnimationFrame(animate);

        if (!mainObject || !clock) return;

        var dt = clock.getDelta();

        currentRotY += (targetRotY - currentRotY) * 0.05;
        currentRotX += (mouseY * 0.4 - currentRotX) * 0.05;

        mainObject.rotation.y = currentRotY;
        mainObject.rotation.x = currentRotX * 0.4;
        mainObject.rotation.z = Math.sin(Date.now() * 0.0004) * 0.08;
        mainObject.position.y = Math.sin(Date.now() * 0.0006) * 0.12;

        rings.forEach(function (ring, i) {
            ring.rotation.z += dt * (0.3 + i * 0.15);
            ring.rotation.x += dt * (0.15 + i * 0.08);
            ring.rotation.y += dt * (0.2 + i * 0.1);
        });

        renderer.render(scene, camera);
    }

    init();
})();
