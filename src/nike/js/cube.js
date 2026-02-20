// 3D Cube animation with Three.js
document.addEventListener('DOMContentLoaded', () => {
    const cubeContainer = document.getElementById('cube-scene');
    if (!cubeContainer || window.innerWidth < 768) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(200, 200);
    cubeContainer.appendChild(renderer.domElement);
    
    // Create cube
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    
    // Create materials for each face with Minecraft-like textures
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x8844ee }), // Purple
        new THREE.MeshBasicMaterial({ color: 0x22ddee }), // Cyan
        new THREE.MeshBasicMaterial({ color: 0x44aaff }), // Blue
        new THREE.MeshBasicMaterial({ color: 0x22cc88 }), // Green
        new THREE.MeshBasicMaterial({ color: 0xffaa22 }), // Orange
        new THREE.MeshBasicMaterial({ color: 0xff4488 })  // Pink
    ];
    
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    
    // Add wireframe
    const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    cube.add(wireframe);
    
    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
        const size = cubeContainer.clientWidth;
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
});