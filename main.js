import * as THREE from 'three';
import { Vector3 } from './three.module.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; 

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import Screen from './Screen.js';
import Cave from './Cave.js';
import CaveHelper from './CaveHelper.js';

import initScene from './sceneDescriptor.js';

// const socket = new WebSocket("ws://localhost:8000");
// socket.addEventListener("message", (event) => {
//     console.log("Message from server ", event.data);
//   });

// console.log(socket)




const stats = new Stats()
document.body.appendChild( stats.dom );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const worldUp = new Vector3(0, 0, 1);


const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
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

// const screenCoords = [
//   [new Vector3(-PDS, 0, 0), new Vector3(0, PDS, 0), new Vector3(-PDS, 0, 2.25)],
//   [new Vector3(0, PDS, 0), new Vector3(PDS, 0, 0), new Vector3(0, PDS, 2.25)],
//   [new Vector3(-PDS + 1.194, 1.194), new Vector3(0.62, -0.82, 0), new Vector3(-0.21, PDS - 0.21, 0)]
// ]


const t = new Vector3(1, 1, 0).normalize().multiplyScalar(2.25);

const screenCorners0 = [
  new Vector3(-PDS, 0, 0),
  new Vector3(0, PDS, 0),
  new Vector3(-PDS, 0, 2.25),
  new Vector3(0, PDS, 2.25),
];

const screenCorners1 = [
  new Vector3(0, PDS, 0),
  new Vector3(PDS, 0, 0),
  new Vector3( 0, PDS, 2.25),
  new Vector3( PDS, 0, 2.25),
];

const screenCorners2 = [
  new Vector3(-t.x, PDS - t.y, 0),
  new Vector3(PDS - t.x, -t.y, 0),
  new Vector3(0, PDS, 0),
  new Vector3(PDS, 0, 0),
];

const screen0 = new Screen(screenCorners0);
const screen1 = new Screen(screenCorners1);
const screen2 = new Screen(screenCorners2);

const cave = new Cave([screen0, screen1, screen2]);
const caveHelper = new CaveHelper(cave);
scene.add(caveHelper);


const targetPoint = new Vector3(-1.5, 3*PDS, 1.2)

const trackedCamera = new THREE.PerspectiveCamera( 50, 1, 0.1, 0.5 );
trackedCamera.up.copy(worldUp);
trackedCamera.position.set(0.5, -0.5, 1.3);
trackedCamera.lookAt(targetPoint)
trackedCamera.updateProjectionMatrix();
trackedCamera.updateWorldMatrix();



const trackedCameraHelper = new THREE.CameraHelper(trackedCamera);
scene.add(trackedCameraHelper);

function updateRig() {
  trackedCamera.lookAt(targetPoint);
  trackedCamera.updateProjectionMatrix();
  trackedCamera.updateWorldMatrix();
  trackedCameraHelper.update();
  
  cave.updateStereoScreenCameras(trackedCamera.matrixWorld.clone());
  caveHelper.updateStereoScreenCameraHelpers();

}

updateRig()

function updateRigAndTransmit() {
  updateRig();
  sendCameras();
}

const sceneContent = initScene();
scene.add(sceneContent)


const guiParams = {
  hideCameraHelpers: caveHelper.hideStereoScreenCameraHelpers.bind(caveHelper),
  showCameraHelpers: caveHelper.showStereoScreenCameraHelpers.bind(caveHelper),
  showScene: () => {scene.add(sceneContent)},
  hideScene: () => {scene.remove(sceneContent)},
}

const gui = new GUI();
gui.add(trackedCamera.position, 'x').name("x").min(-1.0).max(1.0).step(0.05).onChange(updateRigAndTransmit);
gui.add(trackedCamera.position, 'y').name("y").min(-PDS).max(PDS).step(0.05).onChange(updateRigAndTransmit);
gui.add(trackedCamera.position, 'z').name("z").min(0.05).max(2.0).step(0.05).onChange(updateRigAndTransmit);
gui.add(targetPoint, 'x').name('tx').min(-10.0).max(10.0).step(0.05).onChange(updateRigAndTransmit);
gui.add(targetPoint, 'y').name('ty').min(-10.0).max(10.0).step(0.05).onChange(updateRigAndTransmit);
gui.add(targetPoint, 'z').name('tz').min(-10.0).max(10.0).step(0.05).onChange(updateRigAndTransmit);
gui.add(guiParams, "hideCameraHelpers");
gui.add(guiParams, "showCameraHelpers");
gui.add(guiParams, "hideScene");
gui.add(guiParams, "showScene");




const worker = new SharedWorker("coordinator.js")
console.log(worker)


worker.port.onmessage = function ( event ) {
  console.log(event);

  const data = event.data;
  if(data.type === "screen") {
    switch(data.data) {
      case 1:
        worker.port.postMessage({
          type: "camera",
          data: {
            projectionL: cave.stereoScreenCameras[0].left.projectionMatrix.clone(),
            worldL: cave.stereoScreenCameras[0].left.matrixWorld.clone(), 
            projectionR: cave.stereoScreenCameras[0].right.projectionMatrix.clone(),
            worldR: cave.stereoScreenCameras[0].right.matrixWorld.clone(), 
            target: 1
          },});
        break;
        case 2:
          worker.port.postMessage({
            type: "camera",
            data: {
              projectionL: cave.stereoScreenCameras[1].left.projectionMatrix.clone(),
              worldL: cave.stereoScreenCameras[1].left.matrixWorld.clone(), 
              projectionR: cave.stereoScreenCameras[1].right.projectionMatrix.clone(),
              worldR: cave.stereoScreenCameras[1].right.matrixWorld.clone(), 
              target: 2
            },});
        case 3:
          worker.port.postMessage({
            type: "camera",
            data: {
              projectionL: cave.stereoScreenCameras[2].left.projectionMatrix.clone(),
              worldL: cave.stereoScreenCameras[2].left.matrixWorld.clone(), 
              projectionR: cave.stereoScreenCameras[2].right.projectionMatrix.clone(),
              worldR: cave.stereoScreenCameras[2].right.matrixWorld.clone(), 
              target: 3
            },});
        break;
      default:
        break;
    }

  }
}

function sendCameras() {
  worker.port.postMessage({
    type: "camera",
    data: {
      projectionL: cave.stereoScreenCameras[0].left.projectionMatrix.clone(),
      worldL: cave.stereoScreenCameras[0].left.matrixWorld.clone(), 
      projectionR: cave.stereoScreenCameras[0].right.projectionMatrix.clone(),
      worldR: cave.stereoScreenCameras[0].right.matrixWorld.clone(), 
      target: 1
    },});
  worker.port.postMessage({
    type: "camera",
    data: {
      projectionL: cave.stereoScreenCameras[1].left.projectionMatrix.clone(),
      worldL: cave.stereoScreenCameras[1].left.matrixWorld.clone(), 
      projectionR: cave.stereoScreenCameras[1].right.projectionMatrix.clone(),
      worldR: cave.stereoScreenCameras[1].right.matrixWorld.clone(), 
      target: 2
    },});
  worker.port.postMessage({
    type: "camera",
    data: {
      projectionL: cave.stereoScreenCameras[2].left.projectionMatrix.clone(),
      worldL: cave.stereoScreenCameras[2].left.matrixWorld.clone(), 
      projectionR: cave.stereoScreenCameras[2].right.projectionMatrix.clone(),
      worldR: cave.stereoScreenCameras[2].right.matrixWorld.clone(), 
      target: 3
    },});
}

const features1 = 'width=800,height=501 ,left=0,top=0';
const features2 = 'width=800,height=501 ,left=800,top=0';
const features3 = 'width=800,height=501 ,left=800,top=501';
const secondaryWindow1 = window.open("secondary.html?id=1", '', features1);
const secondaryWindow2 = window.open("secondary.html?id=2", '', features2);
const secondaryWindow3 = window.open("secondary.html?id=3", '', features3);


window.addEventListener("beforeunload", () => {
  worker.port.postMessage({type: 'terminate', data: 0});
  worker.port.close();
  secondaryWindow1.close();
  secondaryWindow2.close();
  secondaryWindow3.close();
});

worker.port.postMessage({type: 'init', data: 0});
// worker.port.postMessage()

