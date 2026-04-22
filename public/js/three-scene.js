// three-scene.js - Interactive 3D Background for Portfolio
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

// Scene setup
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera position
camera.position.z = 30;

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0x4299e1); // Blue
const color2 = new THREE.Color(0x667eea); // Purple
const color3 = new THREE.Color(0x764ba2); // Deep purple

for (let i = 0; i < particlesCount * 3; i += 3) {
  // Position
  posArray[i] = (Math.random() - 0.5) * 100;     // x
  posArray[i + 1] = (Math.random() - 0.5) * 100; // y
  posArray[i + 2] = (Math.random() - 0.5) * 100; // z

  // Colors - mix between colors
  const mixedColor = color1.clone();
  const randomValue = Math.random();
  if (randomValue < 0.33) {
    mixedColor.lerp(color2, Math.random());
  } else if (randomValue < 0.66) {
    mixedColor.lerp(color3, Math.random());
  } else {
    mixedColor.lerp(color1, Math.random());
  }

  colorsArray[i] = mixedColor.r;
  colorsArray[i + 1] = mixedColor.g;
  colorsArray[i + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Particle material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});

// Create particle system
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating geometric shapes
const shapesGroup = new THREE.Group();
const shapeGeometries = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TetrahedronGeometry(1, 0),
  new THREE.TorusGeometry(0.7, 0.3, 8, 16),
];

const shapeMaterials = [
  new THREE.MeshPhongMaterial({ 
    color: 0x4299e1, 
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0x667eea, 
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }),
  new THREE.MeshPhongMaterial({ 
    color: 0x764ba2, 
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  }),
];

for (let i = 0; i < 15; i++) {
  const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
  const material = shapeMaterials[Math.floor(Math.random() * shapeMaterials.length)];
  const shape = new THREE.Mesh(geometry, material);

  shape.position.x = (Math.random() - 0.5) * 60;
  shape.position.y = (Math.random() - 0.5) * 60;
  shape.position.z = (Math.random() - 0.5) * 30 - 10;

  shape.rotation.x = Math.random() * Math.PI;
  shape.rotation.y = Math.random() * Math.PI;

  const scale = Math.random() * 1.5 + 0.5;
  shape.scale.set(scale, scale, scale);

  // Store rotation speed
  shape.userData = {
    rotationSpeedX: (Math.random() - 0.5) * 0.02,
    rotationSpeedY: (Math.random() - 0.5) * 0.02,
  };

  shapesGroup.add(shape);
}

scene.add(shapesGroup);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4299e1, 1);
pointLight1.position.set(20, 20, 20);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x667eea, 1);
pointLight2.position.set(-20, -20, 20);
scene.add(pointLight2);

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
  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.rotation.x = elapsedTime * 0.02;

  // Add mouse influence to particle rotation
  particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
  particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

  // Animate shapes
  shapesGroup.children.forEach((shape) => {
    shape.rotation.x += shape.userData.rotationSpeedX;
    shape.rotation.y += shape.userData.rotationSpeedY;
    
    // Gentle floating motion
    shape.position.y += Math.sin(elapsedTime + shape.position.x) * 0.02;
  });

  // Rotate shapes group based on scroll
  shapesGroup.rotation.y = scrollY * 0.001;
  shapesGroup.rotation.x = scrollY * 0.0005;

  // Camera movement based on scroll
  camera.position.y = -scrollY * 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
