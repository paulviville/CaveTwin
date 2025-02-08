import * as THREE from 'three';

export default function initScene ( ) {

	const sceneGroup = new THREE.Group();

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	sceneGroup.add(ambientLight);
	const pointLight = new THREE.PointLight(0xffffff, 100);
	pointLight.position.set(0,0,5);
	sceneGroup.add(pointLight);


	const geometry = new THREE.SphereGeometry( 0.5, 32, 16 ); 
	const redMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
	const greenMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); 
	const blueMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff } ); 
	
	const redSphere = new THREE.Mesh( geometry, redMaterial ); 
	const greenSphere = new THREE.Mesh( geometry, greenMaterial ); 
	const blueSphere = new THREE.Mesh( geometry, blueMaterial ); 

	redSphere.position.set(2.5, 2.5, 1);
	blueSphere.position.set(-2.5, 2.5, 1);
	greenSphere.position.set(0, 0, -2.5);

	sceneGroup.add( redSphere, greenSphere, blueSphere );



	const gridHelper = new THREE.GridHelper(100, 20);
	gridHelper.lookAt(new THREE.Vector3(0, 1, 0));
	sceneGroup.add(gridHelper);

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxEdgeGeometry = new THREE.EdgesGeometry(boxGeometry);
	const whiteMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } ); 
	const blackLineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } ); 
	const boxEdges = new THREE.LineSegments(boxEdgeGeometry, blackLineMaterial);
	const box = new THREE.Mesh(boxGeometry, whiteMaterial);
	box.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
	box.position.set(0, 1.5, 0.5);
	sceneGroup.add(box);


	return sceneGroup;
}