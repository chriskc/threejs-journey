import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';
import {
    glassMaterial,
    matcapMaterial,
    material,
    solidMaterial,
    standardMaterial
} from './materials.js';
import {
    axesHelper,
    boxMesh,
    boxMesh4,
    group,
    scene,
    sphereMesh,
    sphereMesh2,
    sphereParams,
    triangle,
    wavyMesh
} from './scene.js';
import './style.css';

console.log("helloooo");

const defaultObject = {}

// Set default color for material (GUI will update this)
defaultObject.color = '#ff00ff'

// Copy sphere parameters to defaultObject for GUI access
defaultObject.radius = sphereParams.radius
defaultObject.subdivisions = sphereParams.subdivisions

// -----------------------
// FONT
// -----------------------

const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    console.log(font)
    const textGeometry = new TextGeometry(
        'chris k chan',
        {
            font: font,
            size: 0.5,
            depth: 0.2,
            curveSegments:6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
        }
    )
    
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
    // )
    
    textGeometry.center()

    textGeometry.computeBoundingBox()
    console.log(textGeometry.boundingBox)
    
    const text = new THREE.Mesh(textGeometry, matcapMaterial)
    scene.add(text)

})

// -----------------------
// RENDERER
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

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// -----------------------
// CAMERAS
// -----------------------

const aspectRatio = sizes.width / sizes.height
const orthoZoom = 8

// const camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 100); // aperature, aspectRatio, frontClip, backClip

const cameras = {
    "persp" : new THREE.PerspectiveCamera(75, aspectRatio, .1, 100), // aperature, aspectRatio, frontClip, backClip
    "ortho" : new THREE.OrthographicCamera(-aspectRatio*orthoZoom, aspectRatio*orthoZoom, orthoZoom, -orthoZoom, 0.1, 100)
    }

const cameraSelection = { type: cameras.persp }

const camera = cameraSelection.type

cameraSelection.type.position.set(-6, 1, 5);
cameraSelection.type.lookAt(boxMesh4.position);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, cameraSelection.type);

console.log(`boxMesh position length: ${boxMesh.position.length()}`)
console.log(`boxMesh position normalized: ${boxMesh.position.normalize().x}, ${boxMesh.position.normalize().y}, ${boxMesh.position.normalize().z}`)
console.log(`boxMesh position distance to camera: ${boxMesh.position.distanceTo(cameraSelection.type.position)}`)

// -----------------------
// INTERACTIONS
// -----------------------

const cursor = { x: 0, y: 0}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    // console.log(cursor)
    camera.fov = 35 + cursor.y * 100
    
    // console.log(event)
})

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight
    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(sizes.width, sizes.height)
})

// -----------------------
// ANIMATIONS
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

defaultObject.spin = () => {
    gsap.to(group.rotation, { duration: 1, x: group.rotation.x + Math.PI * 2 });
    gsap.to(wavyMesh.rotation, { duration: 1, y: wavyMesh.rotation.y + Math.PI * 2 });
}

// -----------------------
// CONTROLS
// -----------------------

const controls = new OrbitControls(cameraSelection.type, canvas);
controls.enableDamping = true;

// -----------------------
// DEBUG
// -----------------------

const gui = new GUI({
    width: 300,
    closeFolders: false,
    title: 'best pizza',
})

gui.hide()

// toggle debug ui with 'h' kb shortcut
window.addEventListener('keydown', (event) => {
    if (event.key == 'h')
        gui.show(gui._hidden)
})


// geometry
// -------------
const sphereTweaks = gui.addFolder('sphere')
sphereTweaks.add(defaultObject, 'subdivisions', 2, 30, 1).onFinishChange(() => {
    sphereMesh.geometry.dispose()
    sphereMesh.geometry = new THREE.SphereGeometry(defaultObject.radius, defaultObject.subdivisions, defaultObject.subdivisions)
    sphereMesh2.geometry.dispose()
    sphereMesh2.geometry = new THREE.SphereGeometry(defaultObject.radius, defaultObject.subdivisions, defaultObject.subdivisions)
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

materialTweaks.add(standardMaterial, 'metalness', 0, 1, 0.001)
materialTweaks.add(standardMaterial, 'roughness', 0, 1, 0.001)

materialTweaks.add(glassMaterial, 'transmission').min(0).max(1).step(0.0001)
materialTweaks.add(glassMaterial, 'ior').min(1).max(10).step(0.0001)
materialTweaks.add(glassMaterial, 'thickness').min(0).max(1).step(0.0001)

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
// RENDER
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


