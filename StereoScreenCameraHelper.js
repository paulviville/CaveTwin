import StereoCamera from "./StereoScreenCamera.js";
import { Object3D, Color } from "three";
import { CameraHelper } from "./three.module.js";

export default class StereoScreenCameraHelper extends Object3D{
	#stereoScreenCamera;
	#leftCameraHelper;
	#rightCameraHelper;

	constructor ( stereoCamera, color = new Color(0xffffff) ) {
		super();
		this.type = 'StereoScreenCameraHelper';

		this.#stereoScreenCamera = stereoCamera;
	
		this.#leftCameraHelper = new CameraHelper(this.#stereoScreenCamera.left);
		this.#rightCameraHelper = new CameraHelper(this.#stereoScreenCamera.right);
 
		this.#leftCameraHelper.setColors(color, color, color, color, color);
		this.#rightCameraHelper.setColors(color, color, color, color, color);

		this.add(this.#leftCameraHelper, this.#rightCameraHelper);
	}

	update ( ) {
		this.#leftCameraHelper.update();
		this.#rightCameraHelper.update();
	}
}