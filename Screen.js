import * as THREE from 'three';
import { Vector3, Matrix4 } from 'three';

///		2 ------ 3
///     | Screen |
///     0 ------ 1

export default class Screen {
	#corners;
	#ssAxes = {x: new THREE.Vector3(), y: new THREE.Vector3(), z: new THREE.Vector3()};

	constructor ( corners ) {
		this.#corners = [new Vector3(-1, -1, 0), new Vector3(1, -1, 0), new Vector3(-1, 1, 0), new Vector3(1, 1, 0)];
		
		if( corners !== undefined ) {
			this.#corners[0].copy(corners[0]);
			this.#corners[1].copy(corners[1]);
			this.#corners[2].copy(corners[2]);
			this.#corners[3].copy(corners[3]);
		}

		this.#computeScreenSpace();
	}

	get corners () {
		return [
			this.#corners[0].clone(),
			this.#corners[1].clone(),
			this.#corners[2].clone(),
			this.#corners[3].clone(),
		]
	}

	#computeScreenSpace ( ) {
		this.#ssAxes.x.copy(this.#corners[1]).sub(this.#corners[0]).normalize(); 
		this.#ssAxes.y.copy(this.#corners[2]).sub(this.#corners[0]).normalize(); 
		this.#ssAxes.z.crossVectors(this.#ssAxes.x, this.#ssAxes.y).normalize(); 
		console.log(this.#ssAxes)
	}

	#eyeMatrices ( eye ) {
		const projection = new Matrix4();
		const view = new Matrix4();

		const eye0 = this.#corners[0].clone().sub(eye);
		const eye1 = this.#corners[1].clone().sub(eye);
		const eye2 = this.#corners[2].clone().sub(eye);

		const dist = - eye0.dot(this.#ssAxes.z);

		const nearCP = 0.01;
		/// for debug, replace with frustrum far
		const farCP = dist;
		const ND = nearCP / dist;

		const l = this.#ssAxes.x.dot(eye0) * ND;
		const r = this.#ssAxes.x.dot(eye1) * ND;
		const b = this.#ssAxes.y.dot(eye0) * ND;
		const t = this.#ssAxes.y.dot(eye2) * ND;

		projection.set(
			(2.0 * nearCP) / (r - l), 0.0, (r + l) / (r - l), 0.0,
			0.0, (2.0 * nearCP) / (t - b), (t + b) / (t - b), 0.0, 
			0.0, 0.0, -(farCP + nearCP) / (farCP - nearCP), -(2.0 * farCP * nearCP) / (farCP - nearCP),
			0.0, 0.0, -1.0, 0.0
		);

		/// move out, constant on screen
		const R = new Matrix4(
			this.#ssAxes.x.x, this.#ssAxes.x.y, this.#ssAxes.x.z, 0.0,
			this.#ssAxes.y.x, this.#ssAxes.y.y, this.#ssAxes.y.z, 0.0,
			this.#ssAxes.z.x, this.#ssAxes.z.y, this.#ssAxes.z.z, 0.0,
			0.0, 0.0, 0.0, 1.0
		);

		const E = new Matrix4().makeTranslation(-eye.x, -eye.y, -eye.z);

		view.multiplyMatrices(R, E);

		return {projection, view};
	}

	stereoMatrices ( headMatrix ) {
		const eyes = {
			left: new THREE.Vector3(-0.032, 0.0, -0.015),
			right: new THREE.Vector3(0.032, 0.0, -0.015)
		};

		eyes.left.applyMatrix4(headMatrix);
		eyes.right.applyMatrix4(headMatrix);
		
		const leftMatrices = this.#eyeMatrices(eyes.left);
		eyes.leftView = leftMatrices.view;
		eyes.leftProjection = leftMatrices.projection;

		const rightMatrices = this.#eyeMatrices(eyes.right);
		eyes.rightView = rightMatrices.view;
		eyes.rightProjection = rightMatrices.projection;

		return eyes;
	}
}