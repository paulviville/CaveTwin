import * as THREE from 'three';
import { Object3D } from 'three';
import ScreenHelper from './ScreenHelper.js';

const screenColors = [0x3399DD, 0xDD3399, 0x99DD33];

export default class CaveHelper extends Object3D {
	#cave;

	constructor ( cave ) {
		super();

		this.type = 'CaveHelper';
		
		this.#cave = cave;

		const axesHelper = new THREE.AxesHelper( 10 );
		this.add( axesHelper );

		for(const screen of this.#cave.screens) {
			this.add(new ScreenHelper(screen, screenColors.shift()));
		}
	}
}