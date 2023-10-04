import * as THREE from "three";
import { isResize } from "./helpers/isResize";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { animateBox } from "./helpers/animate";

const fov = 55,
  aspect = 2,
  near = 1,
  far = 5,
  width = window.innerWidth,
  height = window.innerHeight,
  w = 1,
  h = 1,
  d = 1,
  color = 0x44aa38,
  intesivity = 2,
  pixelDevice = window.devicePixelRatio;

const canvas = document.querySelector(".canvas-rend");

function init() {
  const clock = new THREE.Clock();

  const axesHelper = new THREE.AxesHelper(3);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  const loader = new THREE.TextureLoader();

  const texture = loader.load("src/three/assets/TextureEarth.jpeg");
  texture.colorSpace = THREE.SRGBColorSpace;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // const light = new THREE.DirectionalLight(color, intesivity);

  const geometry = new THREE.IcosahedronGeometry(1, 15);
  const material = new THREE.MeshLambertMaterial({
    //map: texture,
    //envMap: scene.background,
    //combine: THREE.MixOperation,
    fog: true,
    reflectivity: 0.5,
    map: texture,
    // wireframe: true,
  });

  const fgeo = new THREE.PlaneGeometry(40, 40);
  const fmat = new THREE.ShadowMaterial({
    opacity: 1,
    color: 0x212121,
    fog: true,
    // side: THREE.LightShadow,
  });
  const fmes = new THREE.Mesh(fgeo, fmat);
  fmes.position.y = -1.2;

  fmes.rotateX(-Math.PI / 2);
  fmes.receiveShadow = true;

  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const scene = new THREE.Scene();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  scene.add(fmes);
  // orbitControls.target.set(-1, 0, -1);
  orbitControls.position0.set(4, 3, 2);
  orbitControls.maxDistance = 4;
  orbitControls.enablePan = false;
  orbitControls.maxZoom = 0;
  orbitControls.minZoom = 0;
  // orbitControls.maxAzimuthAngle = 0;
  orbitControls.maxPolarAngle = 4;
  console.log(orbitControls);

  // orbitControls.target.set(0, 0, 5);
  // orbitControls.rotateSpeed = 2;

  // scene.background = new THREE.Color(0x312222);

  isResize({ renderer, canvas, width, height });
  camera.lookAt(mesh);
  scene.add(mesh);
  scene.add(axesHelper);

  // mesh.position.set(1, 1, 1);
  camera.position.set(0, 0, 5);

  // Туман

  // {
  //   const color = 0xffffff; // white
  //   const near = 10;
  //   const far = 100;
  //   scene.fog = new THREE.Fog(color, near, far);
  // }

  {
    const near = 1;
    const far = 5.5;
    const color = "lightblue";
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }

  const createLights = () => {
    const a_light = new THREE.AmbientLight(0xffffff, 0.5);
    const p_light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 8, 1, 0.01);
    p_light.position.set(-2, 3, 5);
    p_light.castShadow = true;
    p_light.shadow.mapSize.width = p_light.shadow.mapSize.height = 2048;
    p_light.shadow.camera.near = 0.5;
    p_light.shadow.camera.far = 500;

    const spotLightHelper = new THREE.SpotLightHelper(p_light);

    return p_light;
  };

  const resizeD = () => {
    const isResizing = canvas.width !== width || canvas.height !== height;
    console.log("innerResize", canvas.width);

    if (isResizing) {
      renderer.setSize(width, height, updateStyle);
    }

    // return isResizing;
  };

  if (resizeD()) {
    camera.aspect = window.clientWidth / window.clientHeight;
    camera.updateProjectionMatrix();
  }

  scene.add(createLights());

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  let renderRequested = false;

  const AnimateBox = () => {
    renderRequested = undefined;

    // width = window.innerWidth;
    // height = window.innerHeight

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    const alepsedTime = clock.getElapsedTime();

    // console.log(camera.position);
    mesh.rotation.x = Math.cos(alepsedTime);
    mesh.rotation.y = Math.sin(alepsedTime);
    camera.position.y = Math.cos(alepsedTime);
    camera.position.x = Math.sin(alepsedTime);

    // camera.lookAt(mesh);
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(AnimateBox);
  };

  AnimateBox();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(AnimateBox);
      console.log("2");
    }
  }
  // orbitControls.addEventListener("change", requestRenderIfNotRequested);
  window.addEventListener("resize", requestRenderIfNotRequested);
}
init();
// const _CANVAS = document.querySelector(".canvas-animate")!;
// _CANVAS?.appendChild(renderer.domElement);
