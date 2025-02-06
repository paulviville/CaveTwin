import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; 

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import Screen from './Screen.js';
import ScreenHelper from './ScreenHelper.js';
import Cave from './Cave.js';
import CaveHelper from './CaveHelper.js';
import StereoScreenCamera from './StereoScreenCamera.js';
import StereoScreenCameraHelper from './StereoScreenCameraHelper.js';

// const socket = new WebSocket("ws://localhost:8000");
// socket.addEventListener("message", (event) => {
//     console.log("Message from server ", event.data);
//   });

// console.log(socket)




const stats = new Stats()
document.body.appendChild( stats.dom );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 100);
pointLight0.position.set(5,4,5);
scene.add(pointLight0);

const worldUp = new THREE.Vector3(0, 0, 1);


const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
camera.up.copy(worldUp);
camera.position.set( -2, -4, 3 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 0, 2);
orbitControls.update()


window.addEventListener('resize', function() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


function animate() {
  orbitControls.update()
  renderer.render( scene, camera );
  stats.update()
}

renderer.setAnimationLoop( animate );


const PDS = Math.sqrt(2) * 1.8;

const screenCoords = [
  [new THREE.Vector3(-PDS, 0, 0), new THREE.Vector3(0, PDS, 0), new THREE.Vector3(-PDS, 0, 2.25)],
  [new THREE.Vector3(0, PDS, 0), new THREE.Vector3(PDS, 0, 0), new THREE.Vector3(0, PDS, 2.25)],
  [new THREE.Vector3(-PDS + 1.194, 1.194), new THREE.Vector3(0.62, -0.82, 0), new THREE.Vector3(-0.21, PDS - 0.21, 0)]
]


const t = new THREE.Vector3(1, 1, 0).normalize().multiplyScalar(2.25);

const screenCorners0 = [
  new THREE.Vector3(-PDS, 0, 0),
  new THREE.Vector3(0, PDS, 0),
  new THREE.Vector3(-PDS, 0, 2.25),
  new THREE.Vector3(0, PDS, 2.25),
];

const screenCorners1 = [
  new THREE.Vector3(0, PDS, 0),
  new THREE.Vector3(PDS, 0, 0),
  new THREE.Vector3( 0, PDS, 2.25),
  new THREE.Vector3( PDS, 0, 2.25),
];

const screenCorners2 = [
  new THREE.Vector3(-t.x, PDS - t.y, 0),
  new THREE.Vector3(PDS - t.x, -t.y, 0),
  new THREE.Vector3(0, PDS, 0),
  new THREE.Vector3(PDS, 0, 0),
];

const screen0 = new Screen(screenCorners0);
const screen1 = new Screen(screenCorners1);
const screen2 = new Screen(screenCorners2);

const cave = new Cave([screen0, screen1, screen2]);
const caveHelper = new CaveHelper(cave);
scene.add(caveHelper);



// const cameraMarker = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
// scene.add(cameraMarker)

const targetPoint = new THREE.Vector3(-1.5, PDS, 1.2)

const trackedCamera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 0.5 );
trackedCamera.up.copy(worldUp);
trackedCamera.position.set(0.5, -0.1, 1);
trackedCamera.lookAt(targetPoint)
trackedCamera.updateProjectionMatrix();

trackedCamera.updateWorldMatrix();

const stereoScreenCamera0 = new StereoScreenCamera(screen0);
const stereoScreenCamera1 = new StereoScreenCamera(screen1);
const stereoScreenCamera2 = new StereoScreenCamera(screen2);
const stereoScreenCameraHelper0 = new StereoScreenCameraHelper(stereoScreenCamera0);
const stereoScreenCameraHelper1 = new StereoScreenCameraHelper(stereoScreenCamera1);
const stereoScreenCameraHelper2 = new StereoScreenCameraHelper(stereoScreenCamera2);
scene.add(stereoScreenCameraHelper0);
scene.add(stereoScreenCameraHelper1);
scene.add(stereoScreenCameraHelper2);
stereoScreenCameraHelper0.update(trackedCamera.matrixWorld.clone());
stereoScreenCameraHelper1.update(trackedCamera.matrixWorld.clone());
stereoScreenCameraHelper2.update(trackedCamera.matrixWorld.clone());

// trackedCamera.position.set(0, 0, 1);
// trackedCamera.lookAt(new THREE.Vector3(0, PDS, 1.2))
// trackedCamera.updateProjectionMatrix();

// trackedCamera.updateWorldMatrix();
// stereoScreenCameraHelper0.update(trackedCamera.matrixWorld.clone());
// stereoScreenCameraHelper1.update(trackedCamera.matrixWorld.clone());
// stereoScreenCameraHelper2.update(trackedCamera.matrixWorld.clone());

const trackedCameraHelper = new THREE.CameraHelper(trackedCamera);
scene.add(trackedCameraHelper);

function updateRig() {
  trackedCamera.lookAt(targetPoint);
  trackedCamera.updateProjectionMatrix();
  trackedCamera.updateWorldMatrix();
  trackedCameraHelper.update();
  stereoScreenCameraHelper0.update(trackedCamera.matrixWorld.clone());
  stereoScreenCameraHelper1.update(trackedCamera.matrixWorld.clone());
  stereoScreenCameraHelper2.update(trackedCamera.matrixWorld.clone());
}

const guiParams  = {
  updateRig: updateRig,
}

const gui = new GUI();
gui.add(trackedCamera.position, 'x').name("x").min(-1.0).max(1.0).step(0.05).onChange(updateRig);
gui.add(trackedCamera.position, 'y').name("y").min(-PDS).max(PDS).step(0.05).onChange(updateRig);
gui.add(trackedCamera.position, 'z').name("z").min(0.05).max(2.0).step(0.05).onChange(updateRig);
gui.add(targetPoint, 'x').name('tx').min(-10.0).max(10.0).step(0.05).onChange(updateRig);
gui.add(targetPoint, 'y').name('ty').min(-10.0).max(10.0).step(0.05).onChange(updateRig);
gui.add(targetPoint, 'z').name('tz').min(-10.0).max(10.0).step(0.05).onChange(updateRig);

window.updateRig = updateRig;