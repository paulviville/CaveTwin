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
import StereoScreenCamera from './StereoScreenCamera.js';

// let stereoScreenCamera


const urlParams = new URLSearchParams(window.location.search);
const windowId = parseInt(urlParams.get("id"));
console.log(windowId, typeof(windowId))

// console.log(parseInt("init_1".split("_")[1]));


const cameraL = new THREE.PerspectiveCamera();
const cameraR = new THREE.PerspectiveCamera();


const worker = new SharedWorker("coordinator.js")
console.log(worker)

worker.port.onmessage = function ( event ) {
	console.log(event);

	const data = event.data;
	console.log(data);

	if(data.type === "camera") {
		const worldL = data.data.worldL.elements;
		const projectionL = data.data.projectionL.elements;
		cameraL.matrixWorld.fromArray(worldL);
		cameraL.projectionMatrix.fromArray(projectionL);
		cameraL.matrixAutoUpdate = false;

		const worldR = data.data.worldR.elements;
		const projectionR = data.data.projectionR.elements;
		cameraR.matrixWorld.fromArray(worldR);
		cameraR.projectionMatrix.fromArray(projectionR);
		cameraR.matrixAutoUpdate = false;
	}

	if(data.type === "screen") {
		console.log("initializing screen");
	}

	if(data.type === "head") {

	}
}

window.addEventListener("beforeunload", () => {
	worker.port.postMessage({type: 'terminate', data: windowId});
	worker.port.close();
});

worker.port.postMessage({type: `init`, data: windowId});




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


// const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
const camera = new THREE.PerspectiveCamera();
// camera.up.copy(worldUp);
// camera.position.set( -1, -1, 1.8 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
// renderer.setPixelRatio( window.devicePixelRatio );
renderer.setPixelRatio( 800/500 );
renderer.setSize( 800,500 );
// renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(1, 1, 1.8);
orbitControls.update()


scene.add(initScene())

// window.addEventListener('resize', function() {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });

let left = true;
function animate() {
	// orbitControls.update()
	renderer.render( scene, left ? cameraL : cameraR );
	stats.update();
	left = !left;
}
  
renderer.setAnimationLoop( animate );
  