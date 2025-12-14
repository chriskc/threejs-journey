import GUI from 'lil-gui'
import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// minimal performance cost
// ------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, .25)
// scene.add(ambientLight)

// create hemisphere light
const hemisphereLight  = new THREE.HemisphereLight(0x5500ff, 0x338800, 3)
// scene.add(hemisphereLight)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, .1)


// moderate performance cost
// ------------------------------------
const pointLight = new THREE.PointLight(0xffffff, 40)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
// scene.add(pointLight)

// create point light
const pointLight2 = new THREE.PointLight(0xff3300, 5, 2, 1)
pointLight2.position.set(-.75, 0, 1)
pointLight2.castShadow -= true
// scene.add(pointLight2)
const pointLightHelper = new THREE.PointLightHelper(pointLight2, .1)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight2.shadow.camera)

// create directional light
const directionalLight = new THREE.DirectionalLight(0x5500ff, 5)
directionalLight.position.set(1,1,1)
// scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, .25)


// high performance cost
// ------------------------------------

// create rectarealight
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 10, 5, 2)
// scene.add(rectAreaLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

// create spotlight
const spotlight = new THREE.SpotLight(0x3300ff, 100, 10, Math.PI * 0.1, 1, .5)
spotlight.position.set(3, 4, -5)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far  = 10
spotlight.shadow.camera.fov = 15
spotlight.shadow.radius = 5

const spotlight2 = new THREE.SpotLight(0x3300ff, 200, 10, Math.PI * 0.1, 1, .5)
spotlight2.position.set(0, 10, -5)
spotlight2.castShadow = true
spotlight2.shadow.mapSize.width = 512
spotlight2.shadow.mapSize.height = 512
spotlight2.shadow.camera.near = 1
spotlight2.shadow.camera.far  = 10
spotlight2.shadow.camera.fov = 15
spotlight2.shadow.radius = 5

console.log(spotlight.shadow)
// scene.add(spotlight)
spotlight.target.position.x = 1
// scene.add(spotlight.target)

// scene.add(spotlight2)
spotlight2.target.position.x = 1
// scene.add(spotlight2.target)

const spotlightHelper = new THREE.SpotLightHelper(spotlight, 0xffffff)
const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera)
const spotlight2Helper = new THREE.SpotLightHelper(spotlight2, 0xffffff)
const spotlight2CameraHelper = new THREE.CameraHelper(spotlight2.shadow.camera)
// scene.add(spotlightCameraHelper)


// lights, helpers & controls
// ------------------------------------
const lights = [
    // ambientLight,
    // hemisphereLight,
    pointLight,
    pointLight2,
    directionalLight,
    // rectAreaLight,
    spotlight,
    spotlight2,
    spotlight.target,
    spotlight2.target
]

for (const light of lights) {
    scene.add(light)
}

const lightHelpers = [
    directionalLightHelper,
    hemisphereLightHelper,
    pointLightHelper,
    rectAreaLightHelper,
    // spotlightHelper,
    // spotlightCameraHelper,
    // spotlight2Helper,
    // spotlight2CameraHelper,
    pointLightCameraHelper,
]

window.addEventListener('keydown', (e) => {
    if (e.key == 'h')
        for (const helper of lightHelpers) {
            scene.add(helper)
        }
})

window.addEventListener('keyup', (e) => {
    if (e.key == 'h')
        for (const helper of lightHelpers) {
            scene.remove(helper)
        }
})

// window.addEventListener('keydown', (e) => {
//     if (e.key == 'l')
//         for (const light of lights) {
//             scene.add(light)
//         }
// })

// window.addEventListener('keyup', (e) => {
//     if (e.key == 'l')
//         for (const light of lights) {
//             scene.remove(light)
//         }
// })

/**
 * Shadows
 */

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/public/textures/shadows/bakedShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace

const simpleShadow = textureLoader.load('/public/textures/shadows/simpleShadow.jpg')

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
        side: THREE.DoubleSide
    })
)
sphereShadow.rotation.x = Math.PI * .5
sphereShadow.position.set(-1.5, -.64, 0)
scene.add(sphereShadow)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
// material.side = THREE.DoubleSide

const groundMaterial = new THREE.MeshStandardMaterial()
groundMaterial.roughness = .75
groundMaterial.color = new THREE.Color(0x113300)
groundMaterial.side = THREE.DoubleSide

const shadowMaterial = new THREE.MeshStandardMaterial()
shadowMaterial.map = bakedShadow
shadowMaterial.roughness = .75
shadowMaterial.side = THREE.DoubleSide

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    groundMaterial
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/** 
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime * 1.5
    torus.rotation.y = 0.5 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.5 * elapsedTime

    sphere.position.y = Math.abs(0.5 * Math.sin(elapsedTime))
    sphereShadow.material.opacity = Math.abs(Math.cos(elapsedTime))

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()