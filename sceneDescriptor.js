import * as THREE from 'three';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';

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
	box.position.set(0, 2.5, 0.25);
	sceneGroup.add(box);


	const loader = new PDBLoader();
	loader.load( "./caffeine.pdb", function ( pdb ) {
		const root = new THREE.Group();
		const geometryAtoms = pdb.geometryAtoms;
		const geometryBonds = pdb.geometryBonds;
		const json = pdb.json;
	
		const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		const sphereGeometry = new THREE.IcosahedronGeometry( 1, 3 );
	
		geometryAtoms.computeBoundingBox();
		// geometryAtoms.boundingBox.getCenter( offset ).negate();
	
		// geometryAtoms.translate( offset.x, offset.y, offset.z );
		// geometryBonds.translate( offset.x, offset.y, offset.z );
	
		let positions = geometryAtoms.getAttribute( 'position' );
		const colors = geometryAtoms.getAttribute( 'color' );
	
		const position = new THREE.Vector3();
		const color = new THREE.Color();
	
		for ( let i = 0; i < positions.count; i ++ ) {
	
			position.x = positions.getX( i );
			position.y = positions.getY( i );
			position.z = positions.getZ( i );
	
			color.r = colors.getX( i );
			color.g = colors.getY( i );
			color.b = colors.getZ( i );
	
			const material = new THREE.MeshPhongMaterial( { color: color } );
	
			const object = new THREE.Mesh( sphereGeometry, material );
			object.position.copy( position );
			object.position.multiplyScalar( 75 );
			object.scale.multiplyScalar( 25 );
			root.add( object );
	
			const atom = json.atoms[ i ];
	
	
		}
	
		positions = geometryBonds.getAttribute( 'position' );
	
		const start = new THREE.Vector3();
		const end = new THREE.Vector3();
	
		for ( let i = 0; i < positions.count; i += 2 ) {
	
			start.x = positions.getX( i );
			start.y = positions.getY( i );
			start.z = positions.getZ( i );
	
			end.x = positions.getX( i + 1 );
			end.y = positions.getY( i + 1 );
			end.z = positions.getZ( i + 1 );
	
			start.multiplyScalar( 75 );
			end.multiplyScalar( 75 );
	
			const object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( 5, 5, start.distanceTo( end ) );
			object.lookAt( end );
			root.add( object );
			
		}
		root.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

		root.scale.multiplyScalar(0.003);
		root.position.set(0.0, 2.25, 1.5);
		sceneGroup.add(root)
	} );

	return sceneGroup;
}