import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from './utils/getStarfield';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FIELD_OF_VIEW = 75;
const ASPECT_RATIO = WIDTH / HEIGHT;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 1000;
const EARTH_AXIAL_TILT = -23.4 * (Math.PI / 180);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader = new THREE.TextureLoader();

const earthGroup = new THREE.Group();
earthGroup.rotation.z = EARTH_AXIAL_TILT;

const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({ map: loader.load('src/assets/textures/earth-map-5k.jpg') });
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 4);
const starField = getStarfield({ numStars: 3000 });

scene.add(earthGroup, hemiLight, starField);

function animate() {
  requestAnimationFrame(animate); 
  
  earthMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  controls.update();
}

animate();
