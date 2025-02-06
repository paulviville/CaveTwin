import StereoCamera from "./StereoScreenCamera.js";
import { Object3D } from "three";
import { CameraHelper } from "./three.module.js";

export default class StereoScreenCameraHelper extends Object3D{
	#stereoScreenCamera;
	#leftCameraHelper;
	#rightCameraHelper;

	constructor ( stereoCamera ) {
		super();
		this.#stereoScreenCamera = stereoCamera;
	
		this.#leftCameraHelper = new CameraHelper(this.#stereoScreenCamera.left);
		this.#rightCameraHelper = new CameraHelper(this.#stereoScreenCamera.right);
	
		this.add(this.#leftCameraHelper, this.#rightCameraHelper);
	}

	update ( headMatrix ) {
		this.#stereoScreenCamera.update(headMatrix);
		this.#leftCameraHelper.update();
		this.#rightCameraHelper.update();
	}
}