import * as THREE from 'three';

import StereoScreenCamera from "./StereoScreenCamera";


export default class StereoScreenHandler {
	#screen;
	#stereoScreenCamera;

	constructor ( ) {

	}

	#initialize ( ) {

	}

	setScreen ( screen ) {
		this.#screen = screen;
		this.#stereoScreenCamera = new StereoScreenCamera(screen);
	}

	update ( headMatrix ) {

	}

	start ( ) {

	}

	#render ( ) {

	}

	stop ( ) {
		
	}
}