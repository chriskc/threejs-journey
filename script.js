import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';

console.log("helloooo");

const defaultObject = {}

// -----------------------
// container
// -----------------------

const scene = new THREE.Scene();

// -----------------------
// material
// -----------------------

defaultObject.color = '#ff00ff'

const material = new THREE.MeshBasicMaterial({ color: defaultObject.color, wireframe: true })
const solidMaterial = new THREE.MeshBasicMaterial({ color: 0x0000cc, wireframe: false })

// -----------------------
// sphere
// -----------------------

defaultObject.radius = .75
defaultObject.subdivisions = 10

const sphereGeometry = new THREE.SphereGeometry(defaultObject.radius, defaultObject.subdivisions, defaultObject.subdivisions);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1;
scene.add(sphereMesh);

// -----------------------
// boxes
// -----------------------

const group = new THREE.Group();

const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1, 2, 2, 2), material);
const boxMesh2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);
const boxMesh3 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);

boxMesh2.position.x = 2;
boxMesh3.position.x = -2;

group.add(boxMesh, boxMesh2, boxMesh3)

group.position.set(.65, .25, -0.5)
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
// custom geometries
// -----------------------

const geometry = new THREE.BufferGeometry()
const positionArray = new Float32Array([
    0, 0, 0,
    1, 0, 1,
    1, 1, 0
])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

geometry.setAttribute('position', positionAttribute)
const triangle = new THREE.Mesh(geometry, solidMaterial)
scene.add(triangle)

const count = { value: 50 }

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
const wavyMesh = new THREE.Mesh(wavyPlane, material) 
scene.add(wavyMesh)

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
const orthoZoom = 3

// const camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 100); // aperature, aspectRatio, frontClip, backClip
const cameraSelection = { type: new THREE.OrthographicCamera(-aspectRatio*orthoZoom, aspectRatio*orthoZoom, orthoZoom, -orthoZoom, 0.1, 100)}

const cameras = { 
    "persp" : new THREE.PerspectiveCamera(75, aspectRatio, .1, 100), // aperature, aspectRatio, frontClip, backClip
    "ortho" : new THREE.OrthographicCamera(-aspectRatio*orthoZoom, aspectRatio*orthoZoom, orthoZoom, -orthoZoom, 0.1, 100)
    }

const camera = cameraSelection.type

cameraSelection.type.position.set(2, 1, 10);
cameraSelection.type.lookAt(axesHelper.position);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, cameraSelection.type);

// window.addEventListener('scroll', (event) => {
//     event
// })

// -----------------------
// logging
// -----------------------

console.log(`boxMesh position length: ${boxMesh.position.length()}`)
console.log(`boxMesh position normalized: ${boxMesh.position.normalize().x}, ${boxMesh.position.normalize().y}, ${boxMesh.position.normalize().z}`)
console.log(`boxMesh position distance to camera: ${boxMesh.position.distanceTo(cameraSelection.type.position)}`)

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
})

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

const updateCamera = (elapsedTime, cursor, camera) => {
    
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
// animations
// -----------------------

defaultObject.spin = () => {
    gsap.to(group.rotation, { duration: 1, x: group.rotation.x + Math.PI * 2 });
    gsap.to(wavyMesh.rotation, { duration: 1, y: wavyMesh.rotation.y + Math.PI * 2 });
}

// -----------------------
// controls
// -----------------------

const controls = new OrbitControls(cameraSelection.type, canvas);
controls.enableDamping = true;

// -----------------------
// debug gui
// -----------------------

const gui = new GUI({
    width: 300,
    closeFolders: false,
    title: 'best pizza',
})

// gui.hide()

// toggle debug ui with 'h' kb shortcut
window.addEventListener('keydown', (event) => {
    if (event.key == 'h')
        gui.show(gui._hidden)
})


// geometry
// -------------
const sphereTweaks = gui.addFolder('sphere')
sphereTweaks.add(defaultObject, 'subdivisions', 5, 20, 1).onFinishChange(() => {
    sphereMesh.geometry.dispose()
    sphereMesh.geometry = new THREE.SphereGeometry(defaultObject.radius, defaultObject.subdivisions, defaultObject.subdivisions)
    console.log('Geometries on GPU:', renderer.info.memory.geometries);
})

// positions
// -------------

const triangleTweaks = gui.addFolder('triangle')
triangleTweaks.add(triangle.position, 'y', -10, 10, .01).name('triangle elevation')
triangleTweaks.add(triangle, 'visible').name('triangle visibility')

// materials
// -------------

const materialTweaks = gui.addFolder('materials')
materialTweaks.add(material, 'wireframe')
materialTweaks
    .addColor(defaultObject, 'color')
    .onChange((value) => {
        material.color.set(defaultObject.color)
        console.log(defaultObject.color)
    })
materialTweaks.add(solidMaterial, 'wireframe')
materialTweaks.addColor(solidMaterial, 'color')

// cameras
// -------------
const cameraTweaks = gui.addFolder('cameras')
cameraTweaks.add(cameraSelection, 'type', cameras).onChange((newCamera) => {
    const oldTarget = controls.target.clone();
    const oldPosition = controls.object.position.clone();
    
    newCamera.position.copy(oldPosition);
    newCamera.lookAt(oldTarget);
    
    controls.object = newCamera;
    controls.target.copy(oldTarget);
    
    if (newCamera.isPerspectiveCamera) {
        newCamera.aspect = sizes.width / sizes.height;
        newCamera.updateProjectionMatrix();
    } else if (newCamera.isOrthographicCamera) {
        newCamera.updateProjectionMatrix();
    }
    
    controls.update();
});

// animations
// -------------
const animationTweaks = gui.addFolder('animations')
animationTweaks.add(defaultObject, 'spin')

// -----------------------
// render
// -----------------------

const render = () => {
    // console.log('tick')
    const elapsedTime = clock.getElapsedTime();
    window.requestAnimationFrame(render); // pass the same function
    
    groupAnimations(group, elapsedTime);
    sphereAnimations(sphereMesh, elapsedTime);
    // updateCamera(elapsedTime, cursor, cameraSelection.type);
    
    controls.update();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.render(scene, cameraSelection.type);
    
    cameraSelection.type.lookAt(sphereMesh.position)
    renderer.setSize(window.innerWidth, window.innerHeight);
}

render()


