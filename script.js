import gsap from 'gsap';
import * as THREE from 'three';
console.log(gsap)

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
boxMesh3.position.x = -2;
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
console.log(`group quaternion: x=${group.quaternion. x}, y=${group.quaternion.y}, z=${group.quaternion.z}, w=${group.quaternion.w}`);

scene.add(group);

// -----------------------
// helpers
// -----------------------

const axesHelper = new THREE.AxesHelper(1);
// axesHelper.position.set(0, 1, 0);
// axesHelper.rotation.set(0, Math.PI / 1.2, 0);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// -----------------------
// renderer
// -----------------------

const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
    // width: 800,
    // height: 600
}
console.log(sizes)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

// -----------------------
// cameras
// -----------------------
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
// const orthoZoom = 3
// const camera = new THREE.OrthographicCamera(-aspectRatio*orthoZoom, aspectRatio*orthoZoom, orthoZoom, -orthoZoom, 0.1, 100);
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(axesHelper.position);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// -----------------------
// logging
// -----------------------

console.log(`boxMesh position length: ${boxMesh.position.length()}`)
console.log(`boxMesh position normalized: ${boxMesh.position.normalize().x}, ${boxMesh.position.normalize().y}, ${boxMesh.position.normalize().z}`)
console.log(`boxMesh position distance to camera: ${boxMesh.position.distanceTo(camera.position)}`)

// -----------------------
// animations
// -----------------------

// requestAnimationFrame is to call the function provided on the next frame

const clock = new THREE.Clock();

const render = () => {
    // console.log('tick')
    const elapsedTime = clock.getElapsedTime();
    window.requestAnimationFrame(render); // pass the same function
    group.rotation.x -= 0.001
    group.rotation.y += 0.01
    group.position.x = Math.cos(elapsedTime) * 2
    group.position.y = Math.cos(elapsedTime) * .25
    sphereMesh.rotation.x = elapsedTime * Math.PI / 8
    sphereMesh.rotation.y = elapsedTime * Math.PI / 4
    sphereMesh.position.y = Math.sin(elapsedTime * 2) * .5
    sphereMesh.position.z = Math.cos(elapsedTime * 2) * .5
    renderer.render(scene, camera);
    // camera.lookAt(sphereMesh.position)
}

// alternate animation using gsap
// -------------------------------
// gsap.to(group.position, { duration: 1, delay: 1, x: 1});
// gsap.to(group.position, { duration: 1, delay: 2, x: 0});

// const render = () => {
//     renderer.render(scene, camera);
// }

render()