import * as THREE from 'three';

export default class Cave {
	#screens;

	constructor( screens ) {
		this.#screens = [...screens];

	}

	get screens () {
		return this.#screens;
	}
}