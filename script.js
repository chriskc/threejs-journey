import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';
// import gsap from 'gsap';

console.log("helloooo");

// -----------------------
// debug
// -----------------------

const gui = new GUI()   

// -----------------------
// container
// -----------------------

const scene = new THREE.Scene();

// -----------------------
// material
// -----------------------

const material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
const solidMaterial = new THREE.MeshBasicMaterial({ color: 0x0000cc, wireframe: false })

// -----------------------
// objects
// -----------------------

const sphereGeometry = new THREE.SphereGeometry(.75, 10, 10);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1;
scene.add(sphereMesh);

const group = new THREE.Group();

const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1, 2, 2, 2), material);
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
// group.scale.y = 0.2 + Math.abs( 3 * Math.sin(frame))
console.log(`group quaternion: x=${group.quaternion.x}, y=${group.quaternion.y}, z=${group.quaternion.z}, w=${group.quaternion.w}`);

group.rotation.reorder('ZXY'); // changes order but keeps the same rotation
group.rotation.set(.3, .4, .5); // set rotation again to see changes to reorder
console.log(`group quaternion: x=${group.quaternion. x}, y=${group.quaternion.y}, z=${group.quaternion.z}, w=${group.quaternion.w}`);
// group.position.set(2, 2, 2)
gui.add(group.position, 'x', -10, 10, .01)
scene.add(group);

const geometry = new THREE.BufferGeometry()
const positionArray = new Float32Array([
    0, 0, 0,
    1, 0, 1,
    1, 1, 0
])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

geometry.setAttribute('position', positionAttribute)
scene.add(new THREE.Mesh(geometry, solidMaterial))

const count = {value: 50}

const wavyPlane = new THREE.BufferGeometry()
const wavyArray = new Float32Array(count.value * 3 * 3) // 3 values per vertex and 3 points per triangle

for(let i = 0; i < count.value * 3; i += 3){
    wavyArray[i] = Math.cos(i)
    wavyArray[i+1] = i / 20
    wavyArray[i+2] = Math.sin(i)
}
// console.log(wavyArray)
const wavyPositionAttribute = new THREE.BufferAttribute(wavyArray, 3)

wavyPlane.setAttribute('position', wavyPositionAttribute)
scene.add(new THREE.Mesh(wavyPlane, material))

gui.add(count, 'value', 0, 100, 1)
gui.add(material, 'wireframe')
gui
    .addColor(material, 'color')
    .onChange((value) => {
        console.log(value.getHexString())
    })

// gui.add(solidMaterial, 'wireframe')
// gui.addColor(solidMaterial, 'color')

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
// -----------------------l

const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
console.log(sizes)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

// -----------------------
// cameras
// -----------------------
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 100); // aperature, aspectRatio, frontClip, backClip
// const orthoZoom = 3
// const camera = new THREE.OrthographicCamera(-aspectRatio*orthoZoom, aspectRatio*orthoZoom, orthoZoom, -orthoZoom, 0.1, 100);
camera.position.set(2, 1, 10);

camera.lookAt(axesHelper.position);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// window.addEventListener('scroll', (event) => {
//     event
// })

// -----------------------
// logging
// -----------------------

console.log(`boxMesh position length: ${boxMesh.position.length()}`)
console.log(`boxMesh position normalized: ${boxMesh.position.normalize().x}, ${boxMesh.position.normalize().y}, ${boxMesh.position.normalize().z}`)
console.log(`boxMesh position distance to camera: ${boxMesh.position.distanceTo(camera.position)}`)

// -----------------------
// mouse interactions
// -----------------------

const cursor = { x: 0, y: 0}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    // console.log(cursor)
    camera.fov = 35 + cursor.y * 100
    
    // console.log(event)
})

// -----------------------
// window interactions
// -----------------------

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight
    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
}

)

// -----------------------
// animations
// -----------------------

// requestAnimationFrame is to call the function provided on the next frame

const clock = new THREE.Clock();

const groupAnimations = (group, elapsedTime) => {
    group.rotation.x -= 0.001
    group.rotation.y += 0.01
    group.position.x = Math.cos(elapsedTime) * 2 + 5
    group.position.y = Math.cos(elapsedTime) * 0.25 + 2
}
const sphereAnimations = (sphereMesh, elapsedTime) => {
    sphereMesh.rotation.x = elapsedTime * Math.PI / 8
    sphereMesh.rotation.y = elapsedTime * Math.PI / 4
    sphereMesh.position.y = Math.sin(elapsedTime * 2) * .5
    sphereMesh.position.z = Math.cos(elapsedTime * 2) * .5
}

const updateCamera = (elapsedTime, cursor) => {
    
    // camera.position.x = cursor.x * Math.PI * -10
    // camera.position.y = cursor.y * Math.PI * -10
    
    // spinning around axes helper
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 10
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * -10
    camera.position.y = cursor.y * -10
    camera.setFocalLength(35 + cursor.y * 100)
    camera.lookAt(axesHelper.position)
}

// -----------------------
// controls
// -----------------------

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// -----------------------
// render
// -----------------------

const render = () => {
    // console.log('tick')
    const elapsedTime = clock.getElapsedTime();
    window.requestAnimationFrame(render); // pass the same function
    
    groupAnimations(group, elapsedTime);
    sphereAnimations(sphereMesh, elapsedTime);
    // updateCamera(elapsedTime, cursor);
    
    controls.update();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.render(scene, camera);
    
    camera.lookAt(sphereMesh.position)
    renderer.setSize(window.innerWidth, window.innerHeight);
}

render()


// alternate animation using gsap
// -------------------------------
// gsap.to(group.position, { duration: 1, delay: 1, x: 1});
// gsap.to(group.position, { duration: 1, delay: 2, x: 0});

// const render = () => {
//     renderer.render(scene, camera);
// }
