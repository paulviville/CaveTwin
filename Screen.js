import * as THREE from 'three';
import { Vector3, Matrix4 } from 'three';

///		2 ------ 3
///     | Screen |
///     0 ------ 1

export default class Screen {
	#corners;
	#ssAxes = {x: new Vector3(), y: new Vector3(), z: new Vector3()};

	constructor ( corners ) {
		this.#corners = [new Vector3(-1, -1, 0), new Vector3(1, -1, 0), new Vector3(-1, 1, 0), new Vector3(1, 1, 0)];
		
		if( corners !== undefined ) {
			this.#corners[0].copy(corners[0]);
			this.#corners[1].copy(corners[1]);
			this.#corners[2].copy(corners[2]);
			this.#corners[3].copy(corners[3]);
		}

	}

	get corners () {
		return [
			this.#corners[0].clone(),
			this.#corners[1].clone(),
			this.#corners[2].clone(),
			this.#corners[3].clone(),
		]
	}
}