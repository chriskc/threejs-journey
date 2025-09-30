import * as THREE from 'three';

console.log("helloooo");

// container
const scene = new THREE.Scene();

// material
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// objects
const sphereGeometry = new THREE.SphereGeometry(.75, 24, 24);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1;
scene.add(sphereMesh);

const boxGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
const boxMesh = new THREE.Mesh(boxGeometry, material);
boxMesh.position.x = 1;
scene.add(boxMesh);

// renderer
const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
console.log(sizes)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3;
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
