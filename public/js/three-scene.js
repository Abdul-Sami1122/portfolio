// three-scene.js - Interactive 3D Background for Portfolio with Enhanced Animations
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

// Scene Setup
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera position
camera.position.z = 30;

// Create particles with enhanced effects
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);
const sizesArray = new Float32Array(particlesCount);
const velocitiesArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0x4299e1); // Blue
const color2 = new THREE.Color(0x667eea); // Purple
const color3 = new THREE.Color(0x764ba2); // Deep purple
const color4 = new THREE.Color(0xf6ad55); // Orange accent

for (let i = 0; i < particlesCount * 3; i += 3) {
  // Position
  posArray[i] = (Math.random() - 0.5) * 120;     // x
  posArray[i + 1] = (Math.random() - 0.5) * 120; // y
  posArray[i + 2] = (Math.random() - 0.5) * 100; // z

  // Velocities for subtle movement
  velocitiesArray[i] = (Math.random() - 0.5) * 0.02;
  velocitiesArray[i + 1] = (Math.random() - 0.5) * 0.02;
  velocitiesArray[i + 2] = (Math.random() - 0.5) * 0.02;

  // Sizes
  sizesArray[i / 3] = Math.random() * 0.5 + 0.2;

  // Colors - mix between colors
  const mixedColor = color1.clone();
  const randomValue = Math.random();
  if (randomValue < 0.25) {
    mixedColor.lerp(color2, Math.random());
  } else if (randomValue < 0.5) {
    mixedColor.lerp(color3, Math.random());
  } else if (randomValue < 0.75) {
    mixedColor.lerp(color4, Math.random());
  } else {
    mixedColor.lerp(color1, Math.random());
  }

  colorsArray[i] = mixedColor.r;
  colorsArray[i + 1] = mixedColor.g;
  colorsArray[i + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

// Particle material with custom shader-like effect
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Create particle system
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating geometric shapes with trails
const shapesGroup = new THREE.Group();
const shapeGeometries = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TetrahedronGeometry(1, 0),
  new THREE.TorusGeometry(0.7, 0.3, 8, 16),
  new THREE.DodecahedronGeometry(1, 0),
];

const shapeMaterials = [
  new THREE.MeshPhongMaterial({ 
    color: 0x4299e1, 
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    emissive: 0x4299e1,
    emissiveIntensity: 0.3,
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0x667eea, 
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    emissive: 0x667eea,
    emissiveIntensity: 0.3,
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0x764ba2, 
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    emissive: 0x764ba2,
    emissiveIntensity: 0.3,
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0xf6ad55, 
    wireframe: true,
    transparent: true,
    opacity: 0.7,
    emissive: 0xf6ad55,
    emissiveIntensity: 0.3,
  }),
];

for (let i = 0; i < 20; i++) {
  const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
  const material = shapeMaterials[Math.floor(Math.random() * shapeMaterials.length)];
  const shape = new THREE.Mesh(geometry, material);

  shape.position.x = (Math.random() - 0.5) * 80;
  shape.position.y = (Math.random() - 0.5) * 80;
  shape.position.z = (Math.random() - 0.5) * 40 - 10;

  shape.rotation.x = Math.random() * Math.PI;
  shape.rotation.y = Math.random() * Math.PI;

  const scale = Math.random() * 2 + 0.5;
  shape.scale.set(scale, scale, scale);

  // Store rotation speed and animation data
  shape.userData = {
    rotationSpeedX: (Math.random() - 0.5) * 0.03,
    rotationSpeedY: (Math.random() - 0.5) * 0.03,
    rotationSpeedZ: (Math.random() - 0.5) * 0.02,
    floatSpeed: Math.random() * 0.5 + 0.5,
    floatOffset: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 2 + 1,
    originalScale: scale,
  };

  shapesGroup.add(shape);
}

scene.add(shapesGroup);

// Create connecting lines between nearby shapes
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x4299e1,
  transparent: true,
  opacity: 0.15,
});

const linesGeometry = new THREE.BufferGeometry();
const linesPositions = new Float32Array(200 * 6); // Max 100 lines
linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
scene.add(linesMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4299e1, 2);
pointLight1.position.set(30, 30, 30);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x667eea, 2);
pointLight2.position.set(-30, -30, 30);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xf6ad55, 1.5);
pointLight3.position.set(0, 40, -20);
scene.add(pointLight3);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX) * 0.001;
  mouseY = (event.clientY - windowHalfY) * 0.001;
});

// Scroll interaction
let scrollY = 0;
document.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  targetX = mouseX * 0.5;
  targetY = mouseY * 0.5;

  // Rotate particles slowly
  particlesMesh.rotation.y = elapsedTime * 0.03;
  particlesMesh.rotation.x = elapsedTime * 0.015;

  // Add mouse influence to particle rotation
  particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
  particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

  // Animate particles with wave motion
  const positions = particlesGeometry.attributes.position.array;
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 1] += Math.sin(elapsedTime * 0.5 + positions[i * 3]) * 0.02;
    positions[i * 3] += Math.cos(elapsedTime * 0.3 + positions[i * 3 + 1]) * 0.01;
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Animate shapes
  shapesGroup.children.forEach((shape, index) => {
    shape.rotation.x += shape.userData.rotationSpeedX;
    shape.rotation.y += shape.userData.rotationSpeedY;
    shape.rotation.z += shape.userData.rotationSpeedZ;
    
    // Gentle floating motion
    shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.03;
    
    // Pulsing scale effect
    const pulse = Math.sin(elapsedTime * shape.userData.pulseSpeed) * 0.1 + 1;
    const targetScale = shape.userData.originalScale * pulse;
    shape.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  // Update connecting lines
  updateLines();

  // Rotate shapes group based on scroll
  shapesGroup.rotation.y = scrollY * 0.001;
  shapesGroup.rotation.x = scrollY * 0.0005;

  // Camera movement based on scroll
  camera.position.y = -scrollY * 0.01;

  // Subtle camera sway
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
  camera.position.z += (30 + mouseY * 5 - camera.position.z) * 0.01;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updateLines() {
  const shapes = shapesGroup.children;
  const positions = [];
  const maxDistance = 25;
  
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const dist = shapes[i].position.distanceTo(shapes[j].position);
      if (dist < maxDistance) {
        positions.push(
          shapes[i].position.x, shapes[i].position.y, shapes[i].position.z,
          shapes[j].position.x, shapes[j].position.y, shapes[j].position.z
        );
      }
    }
  }
  
  linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  linesGeometry.attributes.position.needsUpdate = true;
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
