import * as THREE from 'three';

// -----------------------
// TEXTURES
// -----------------------

// Loading Manager
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

// Texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Minecraft texture
const colorTexture = textureLoader.load('/textures/minecraft.png')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.repeat.x = 2
colorTexture.repeat.y = 2
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.offset.x = .25
colorTexture.offset.y = .5
colorTexture.rotation = Math.PI / 3
colorTexture.center.x = .5
colorTexture.center.y = .5
colorTexture.generateMipmaps = false
colorTexture.magFilter = THREE.NearestFilter

// Door textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace
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

// Matcap and gradient textures
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter

// -----------------------
// MATERIALS
// -----------------------

// Default color for wireframe material
const defaultColor = '#ff00ff'

const material = new THREE.MeshBasicMaterial({ color: defaultColor, wireframe: true })

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
standardMaterial.metalnessMap = doorMetalnessTexture
standardMaterial.roughnessMap = doorRoughnessTexture

const glassMaterial = new THREE.MeshPhysicalMaterial()
glassMaterial.transmission = 0.9
glassMaterial.ior = 3
glassMaterial.thickness = 0.7
glassMaterial.metalness = 0
glassMaterial.roughness = 0
glassMaterial.side = THREE.DoubleSide

// Export all textures and materials
export {
    loadingManager,
    colorTexture,
    doorColorTexture,
    doorAlphaTexture,
    doorHeightTexture,
    doorNormalTexture,
    doorAmbientOcclusionTexture,
    doorMetalnessTexture,
    doorRoughnessTexture,
    matcapTexture,
    gradientTexture,
    material,
    solidMaterial,
    doorMaterial,
    normalMaterial,
    matcapMaterial,
    depthMaterial,
    lambertMaterial,
    phongMaterial,
    toonMaterial,
    standardMaterial,
    glassMaterial
}
