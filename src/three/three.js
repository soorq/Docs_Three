import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const _CONTAINER_CANVAS = document.querySelector("#app");
let _canvas = document.createElement("canvas");
_CONTAINER_CANVAS.appendChild(_canvas);

let car;

let mouseKey = {
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  5
);

const TLoader = new THREE.TextureLoader();
const texture = TLoader.load("src/three/assets/TextureEarth.jpeg");
const roug = TLoader.load("src/three/assets/terrainroughness.jpg");

const loaderG = new GLTFLoader();
loaderG.load(
  "src/three/models/car/scene.gltf",
  (gltf) => {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    scene.add(car);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100, "% loaded");
  },
  (err) => {
    console.warn(err);
  }
);

const ground = new THREE.PlaneGeometry(40, 40, 1, 1);
const g_material = new THREE.MeshPhongMaterial({
  color: 0x232211,
  reflectivity: 0.2,
  fog: true,
  emissive: new THREE.Color(0x222222),
  emissiveIntensity: 1,
  refractionRatio: 1,
  lightMap: roug,
  lightMapIntensity: 0.5,
});

const g_me = new THREE.Mesh(ground, g_material);

g_me.rotation.x = -Math.PI * 0.5;
g_me.position.set(-0.05, -0.05, -0.05);

const _renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: _canvas,
});

_renderer.setPixelRatio(window.devicePixelRatio);
_renderer.shadowMap.enabled = true;
_renderer.shadowMap.type = THREE.PCFShadowMap;
_renderer.setSize(window.innerWidth, window.innerHeight);

const control = new OrbitControls(camera, _canvas);
control.enabled = true;
control.enablePan = false;
control.maxPolarAngle = Math.PI / 2;
control.enableDamping = true;
control.enableZoom = true;
control.dampingFactor = 0.2;
control.rotateSpeed = 3;
control.target.set(0, 0, 0);
control.minDistance = 1.5;
control.maxDistance = 3;
control.autoRotate = true;
control.rotateSpeed = 0.5;
control.autoRotateSpeed = 1;
control.minZoom = 2;
control.minPolarAngle = Math.PI / 4;

/*
 * @declare { Light}
 */
// const topLight = new THREE.DirectionalLight(0xf44336, 1);
// topLight.position.set(0, 1, 0);
// topLight.castShadow = true;

// const AmbitLeft = new THREE.AmbientLight(0x4c1130, 3);
// const AmbitRight = new THREE.AmbientLight(0x741b47, 3);

// AmbitLeft.position.x = Math.cos(Math.PI);
// AmbitRight.position.x = -Math.cos(Math.PI);

const SpotLeft = new THREE.SpotLight(0xba99aa, 5);
SpotLeft.position.set(5, 4, 0);
SpotLeft.angle = 3;
SpotLeft.penumbra = 0.5;
SpotLeft.castShadow = true;
SpotLeft.shadow.bias = -0.002;

const SpotRight = new THREE.SpotLight(0x99abaa, 7);
SpotRight.position.set(-5, 4, 0);
SpotRight.angle = 3;
SpotRight.penumbra = 0.5;
SpotRight.castShadow = true;
SpotRight.shadow.bias = -0.002;

const helper = new THREE.CameraHelper(SpotLeft.shadow.camera);
scene.add(helper);

camera.position.set(6, 2, 0);
camera.lookAt(scene.position);

/*
 * @declare scene()
 */

// scene.background = new THREE.Color(0x3f3a3a);
scene.add(g_me);
scene.background = new THREE.Color(0x232122);
scene.fog = new THREE.Fog(0xcccccc);
// scene.add(topLight);
scene.add(SpotLeft);
scene.add(SpotRight);

// scene.add(AmbitLeft);
// scene.add(AmbitRight);

const animate = () => {
  requestAnimationFrame(animate);

  _renderer.render(scene, camera);
  control.update();
};

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  _renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.render(scene, camera);
});

document.onmousemove = (e) => {
  mouseKey.mouseX = e.clientX;
  mouseKey.mouseY = e.clientY;
};

animate();
