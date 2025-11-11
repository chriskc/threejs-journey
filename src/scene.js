import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import {
    glassMaterial,
    matcapMaterial,
    material,
    normalMaterial,
    toonMaterial,
    standardMaterial
} from './materials.js';

// -----------------------
// SCENE SETUP
// -----------------------

const scene = new THREE.Scene();

// -----------------------
// ENVIRONMENT MAP
// -----------------------

const hdrLoader = new HDRLoader()
// hdrLoader.load('textures/environmentMap/2k.hdr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap

//     console.log('Environment map loaded successfully')
// })

// -----------------------
// LIGHTS
// -----------------------

const ambientLight = new THREE.AmbientLight('#ffffff', 1)
const pointLight = new THREE.PointLight('#ffffff', 30)
pointLight.position.set(-8, 3, 4)
const pointLightHelper = new THREE.PointLightHelper(pointLight, .1)

scene.add(ambientLight, pointLight, pointLightHelper)

// -----------------------
// GEOMETRY
// -----------------------

// Sphere parameters (exported for GUI access)
const sphereParams = {
    radius: .75,
    subdivisions: 10
}

// sphere
// -----------------------

const sphereGeometry = new THREE.SphereGeometry(sphereParams.radius, sphereParams.subdivisions, sphereParams.subdivisions);

const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial);
sphereMesh.position.x = -1;
scene.add(sphereMesh);

const sphereMesh2 = new THREE.Mesh(sphereGeometry, matcapMaterial);
sphereMesh2.position.x = -5.75;
scene.add(sphereMesh2);

// torus
// -----------------------

const torusGeometry = new THREE.TorusGeometry(.75)
const torusMesh = new THREE.Mesh(torusGeometry, toonMaterial)
torusMesh.position.x = -8;
scene.add(torusMesh)

const torusGeometry2 = new THREE.TorusGeometry(.75)
const torusMesh2 = new THREE.Mesh(torusGeometry2, glassMaterial)
torusMesh2.position.x = -11;
scene.add(torusMesh2)

console.time('donut loading')
const torusGeometry3 = new THREE.TorusGeometry(0.55)
for (let i = 0; i < 400; i++) {
    const donut = new THREE.Mesh(torusGeometry3, matcapMaterial)
    const spread = 20
    donut.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
    )
    const randomSize = Math.random() * 0.5
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    donut.scale.set(randomSize, randomSize, randomSize)
    scene.add(donut)
}

console.timeEnd('donut loading')

// boxes
// -----------------------

const group = new THREE.Group();

const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1, 2, 2, 2), material);
const boxMesh2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);
const boxMesh3 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), material);

const boxMesh4 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1, 100, 100), standardMaterial);
// scene.add(boxMesh4)

boxMesh2.position.x = 2;
boxMesh3.position.x = -2;
boxMesh4.position.x = -4;

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

// triangle
// -----------------------

const geometry = new THREE.BufferGeometry()
const positionArray = new Float32Array([
    -5, -5, 0,
    4, -1, 3,
    2, -.25, -3
])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

geometry.setAttribute('position', positionAttribute)
geometry.computeVertexNormals()
const triangle = new THREE.Mesh(geometry, glassMaterial)

// Alternative triangle creation using Shape and ExtrudeGeometry
// const shape = new THREE.Shape()
// shape.moveTo(0, -5)
// shape.lineTo(4, -1)
// shape.lineTo(2, -.25)
// shape.lineTo(0, -5)

// const extrudeSettings = {
//     depth: 0.5,
//     bevelEnabled: true
// }

// const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
// const triangle = new THREE.Mesh(geometry, glassMaterial)
// triangle.rotation.x = -Math.PI / 2

scene.add(triangle)

const count = { value: 50 }

// wavy
// -----------------------

const wavyGeometry = new THREE.BufferGeometry()
const wavyArray = new Float32Array(count.value * 3 * 3) // 3 values per vertex and 3 points per triangle

for(let i = 0; i < count.value * 3; i += 3){
    wavyArray[i] = Math.cos(i)
    wavyArray[i+1] = i / 20
    wavyArray[i+2] = Math.sin(i)
}
const wavyAttribute = new THREE.BufferAttribute(wavyArray, 3)
wavyGeometry.setAttribute('position', wavyAttribute)

const wavyMesh = new THREE.Mesh(wavyGeometry, material)
scene.add(wavyMesh)

// -----------------------
// HELPERS
// -----------------------

const axesHelper = new THREE.AxesHelper(1);
// Example: position and rotate the axes helper
// axesHelper.position.set(0, 1, 0);
// axesHelper.rotation.set(0, Math.PI / 1.2, 0);
// scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// Export scene and all scene objects
export {
    scene,
    hdrLoader,
    ambientLight,
    pointLight,
    pointLightHelper,
    sphereParams,
    sphereGeometry,
    sphereMesh,
    sphereMesh2,
    torusGeometry,
    torusMesh,
    torusGeometry2,
    torusMesh2,
    torusGeometry3,
    group,
    boxMesh,
    boxMesh2,
    boxMesh3,
    boxMesh4,
    geometry,
    triangle,
    count,
    wavyGeometry,
    wavyMesh,
    axesHelper,
    gridHelper
}
