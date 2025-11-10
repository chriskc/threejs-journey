import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';
import './style.css';

console.log("helloooo");

const defaultObject = {}

const scene = new THREE.Scene();

// -----------------------
// TEXTURES
// -----------------------

// native js way to load textures
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.addEventListener('load', () => {
//     texture.needsUpdate = true
// })
// image.src = 'textures/door/color.jpg'

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log("loading started")    
}
loadingManager.onLoad = () => {
    console.log("loading finished")
}
loadingManager.onProgress = () => {
    console.log("loading in progress")
}
loadingManager.onError = () => {
    console.log("loading error")
}

// easiser way with three's texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('textures/minecraft.png')
colorTexture.colorSpace = THREE.SRGBColorSpace // for correct color space
colorTexture.repeat.x = 2
colorTexture.repeat.y = 2
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.offset.x = .25
colorTexture.offset.y = .5
colorTexture.rotation = Math.PI / 3
colorTexture.center.x = .5
colorTexture.center.y = .5

// mip mapping affects how textures get rendered
colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter 
colorTexture.magFilter = THREE.NearestFilter


const doorColorTexture = textureLoader.load('textures/door/color.jpg')
doorColorTexture.colorSpace =THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

console.log(doorColorTexture)
console.log(doorAlphaTexture)
console.log(doorHeightTexture)
console.log(doorNormalTexture)
console.log(doorAmbientOcclusionTexture)
console.log(doorMetalnessTexture)
console.log(doorRoughnessTexture)

const matcapTexture = textureLoader.load('textures/matcaps/4.png')
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter

// -----------------------
// MATERIALS
// -----------------------

defaultObject.color = '#ff00ff'

const material = new THREE.MeshBasicMaterial({ color: defaultObject.color, wireframe: true })

const solidMaterial = new THREE.MeshBasicMaterial({ color: 0x0000cc, wireframe: false})
solidMaterial.side = THREE.DoubleSide

const doorMaterial = new THREE.MeshBasicMaterial({ color: '#dd889d', map: doorColorTexture })
doorMaterial.side = THREE.DoubleSide
doorMaterial.transparent = true
doorMaterial.opacity = 0.8
doorMaterial.alphaMap = doorAlphaTexture

const normalMaterial = new THREE.MeshNormalMaterial({ wireframe: true, flatShading: true})
const matcapMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
matcapMaterial.wireframe = false

const depthMaterial = new THREE.MeshDepthMaterial()
const lambertMaterial = new THREE.MeshLambertMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()
phongMaterial.shininess = 100
phongMaterial.specular = new THREE.Color(0x0000ff)

const toonMaterial = new THREE.MeshToonMaterial({ color: '#ffffff'})
toonMaterial.gradientMap = gradientTexture

// const standardMaterial = new THREE.MeshStandardMaterial()
const standardMaterial = new THREE.MeshPhysicalMaterial()
standardMaterial.metalness = 1
standardMaterial.roughness = 1
standardMaterial.side = THREE.DoubleSide
standardMaterial.transparent = true
standardMaterial.opacity = 1
standardMaterial.alphaMap = doorAlphaTexture
standardMaterial.normalMap = doorNormalTexture
standardMaterial.normalScale.set(0.5, 0.5)
standardMaterial.map = doorColorTexture
standardMaterial.aoMap = doorAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.displacementMap = doorHeightTexture
standardMaterial.displacementScale = .1
standardMaterial.metalnessMap - doorMetalnessTexture
standardMaterial.roughnessMap - doorRoughnessTexture

// for MeshPhysicalMaterial only
// standardMaterial.clearcoat = 1
// standardMaterial.clearcoatRoughness = 0

// standardMaterial.sheen = 1
// standardMaterial.sheenRoughness = 0.25
// standardMaterial.sheenColor.set(1, 1, 1)

// standardMaterial.iridescence = 1
// standardMaterial.iridescenceIOR = 1
// standardMaterial.iridescenceThicknessRange = [ 100, 800 ]

const glassMaterial = new THREE.MeshPhysicalMaterial()
glassMaterial.transmission = 0.9
glassMaterial.ior = 3
glassMaterial.thickness = 0.7
glassMaterial.metalness = 0
glassMaterial.roughness = 0
glassMaterial.side = THREE.DoubleSide

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
// FONT
// -----------------------

const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
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

// sphere
// -----------------------

defaultObject.radius = .75
defaultObject.subdivisions = 10

const sphereGeometry = new THREE.SphereGeometry(defaultObject.radius, defaultObject.subdivisions, defaultObject.subdivisions);

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
// axesHelper.position.set(0, 1, 0);
// axesHelper.rotation.set(0, Math.PI / 1.2, 0);
// scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

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


