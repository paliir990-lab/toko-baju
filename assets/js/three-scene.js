;(function () {
    'use strict';

    if (typeof THREE === 'undefined') return;

    var container = document.getElementById('scene-container');
    if (!container) return;

    var scene, camera, renderer, mainObject, innerObject, clock;
    var rings = [];
    var targetRotY = 0, targetRotX = 0;
    var currentRotY = 0, currentRotX = 0;
    var mouseX = 0, mouseY = 0;

    function createShirtShape() {
        var shape = new THREE.Shape();
        var s = 0.65;

        shape.moveTo(0, -1.8 * s);
        shape.quadraticCurveTo(-0.7 * s, -1.8 * s, -0.85 * s, -1.35 * s);
        shape.lineTo(-0.85 * s, -0.35 * s);
        shape.quadraticCurveTo(-1.2 * s, 0, -0.75 * s, 0.1 * s);
        shape.quadraticCurveTo(-0.3 * s, 0.25 * s, -0.1 * s, 0.05 * s);
        shape.quadraticCurveTo(0, 0, 0.1 * s, 0.05 * s);
        shape.quadraticCurveTo(0.3 * s, 0.25 * s, 0.75 * s, 0.1 * s);
        shape.quadraticCurveTo(1.2 * s, 0, 0.85 * s, -0.35 * s);
        shape.lineTo(0.85 * s, -1.35 * s);
        shape.quadraticCurveTo(0.7 * s, -1.8 * s, 0, -1.8 * s);

        var extrudeSettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.08,
            bevelSize: 0.06,
            bevelSegments: 6
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0.5, 6);

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        var ambient = new THREE.AmbientLight(0x222244, 0.5);
        scene.add(ambient);

        var light1 = new THREE.DirectionalLight(0xc9a84c, 2.5);
        light1.position.set(3, 5, 4);
        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0x4488ff, 1);
        light2.position.set(-4, 2, 3);
        scene.add(light2);

        var light3 = new THREE.DirectionalLight(0xffffff, 0.4);
        light3.position.set(0, -3, -4);
        scene.add(light3);

        var shirtGeo = createShirtShape();
        var shirtMat = new THREE.MeshPhysicalMaterial({
            color: 0xc9a84c,
            metalness: 0.6,
            roughness: 0.25,
            emissive: 0x352a0c,
            emissiveIntensity: 0.05,
            clearcoat: 0.3,
            side: THREE.DoubleSide
        });
        mainObject = new THREE.Mesh(shirtGeo, shirtMat);
        mainObject.position.y = 0.2;
        scene.add(mainObject);

        var innerGeo = new THREE.TorusGeometry(0.2, 0.04, 12, 24);
        var innerMat = new THREE.MeshPhysicalMaterial({
            color: 0x00bbff,
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x0066aa,
            emissiveIntensity: 0.15,
            transparent: true,
            opacity: 0.7
        });
        innerObject = new THREE.Mesh(innerGeo, innerMat);
        innerObject.position.set(0, 1.2, 0.3);
        innerObject.rotation.x = Math.PI / 3;
        scene.add(innerObject);

        var ringGeo = new THREE.TorusGeometry(1.4, 0.025, 16, 48);
        var ringMat = new THREE.MeshPhysicalMaterial({
            color: 0xc9a84c,
            metalness: 0.3,
            roughness: 0.5,
            transparent: true,
            opacity: 0.15
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = 0.6;
        scene.add(ring);
        rings.push(ring);

        var ringGeo2 = new THREE.TorusGeometry(1.8, 0.015, 12, 48);
        var ringMat2 = new THREE.MeshPhysicalMaterial({
            color: 0x4488ff,
            metalness: 0.2,
            roughness: 0.6,
            transparent: true,
            opacity: 0.1
        });
        var ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.x = 1.2;
        ring2.rotation.y = 0.5;
        scene.add(ring2);
        rings.push(ring2);

        var particlesGeo = new THREE.BufferGeometry();
        var count = 50;
        var pos = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        var pMat = new THREE.PointsMaterial({
            color: 0xc9a84c,
            size: 0.03,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        var particles = new THREE.Points(particlesGeo, pMat);
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
        targetRotY = pct * Math.PI * 3;
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
        currentRotX += (mouseY * 0.3 - currentRotX) * 0.05;

        mainObject.rotation.y = currentRotY;
        mainObject.rotation.x = currentRotX * 0.3;
        mainObject.rotation.z = Math.sin(Date.now() * 0.0003) * 0.03;
        mainObject.position.y = Math.sin(Date.now() * 0.0005) * 0.1 + 0.2;

        if (innerObject) {
            innerObject.rotation.z += dt * 0.5;
            innerObject.position.x = Math.sin(Date.now() * 0.0008) * 0.1;
        }

        rings.forEach(function (ring, i) {
            ring.rotation.z += dt * (0.2 + i * 0.1);
            ring.rotation.x += dt * (0.1 + i * 0.05);
        });

        renderer.render(scene, camera);
    }

    init();
})();
