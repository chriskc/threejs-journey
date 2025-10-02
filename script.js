import * as THREE from 'three';

console.log("helloooo");

// -----------------------
// container
// -----------------------

const scene = new THREE.Scene();

// -----------------------
// material
// -----------------------

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// -----------------------
// objects
// -----------------------

const sphereGeometry = new THREE.SphereGeometry(.75, 24, 24);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1;
scene.add(sphereMesh);

const group = new THREE.Group();

const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);
const boxMesh2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);
const boxMesh3 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);
boxMesh2.position.x = 2;
boxMesh3.position.x = 4;
group.add(boxMesh);
group.add(boxMesh2);
group.add(boxMesh3);


group.position.x = 1;
// group.position.set(.65, .25, -0.5)
group.scale.set(.75, 1, 1.25);

group.rotation.order = 'YXZ';
group.rotation.x = Math.PI * 1/4;
group.rotation.y = Math.PI * 1/3;
group.rotation.z = Math.PI * 1/5;
console.log(`group quaternion: x=${group.quaternion.x}, y=${group.quaternion.y}, z=${group.quaternion.z}, w=${group.quaternion.w}`);

group.rotation.reorder('ZXY'); // changes order but keeps the same rotation
group.rotation.set(.3, .4, .5); // set rotation again to see changes to reorder
console.log(`group quaternion: x=${group.quaternion.x}, y=${group.quaternion.y}, z=${group.quaternion.z}, w=${group.quaternion.w}`);

scene.add(group);

// -----------------------
// helpers
// -----------------------

const axesHelper = new THREE.AxesHelper(1);
axesHelper.position.set(0, 1, 0);
axesHelper.rotation.set(0, Math.PI / 1.2, 0);
scene.add(axesHelper);

// -----------------------
// renderer
// -----------------------

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
// camera.lookAt(axesHelper.position);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// -----------------------
// testing
// -----------------------

console.log(`boxMesh position length: ${boxMesh.position.length()}`)
console.log(`boxMesh position normalized: ${boxMesh.position.normalize().x}, ${boxMesh.position.normalize().y}, ${boxMesh.position.normalize().z}`)
console.log(`boxMesh position distance to camera: ${boxMesh.position.distanceTo(camera.position)}`)

