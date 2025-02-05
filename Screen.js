import * as THREE from 'three';
import { Vector3 } from 'three';

///		2 ------ 3
///     | Screen |
///     0 ------ 1

export default class Screen {
	#corners;
	constructor( corners ) {
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


// const std::vector<std::array<GLVec3, 3>> CaveViewer::screen_coords_ = {
// 	{GLVec3{-PDS, 0, 0}, GLVec3{0, PDS, 0}, GLVec3{-PDS, 0, 2.25f}},
// 	{GLVec3{0, PDS, 0}, GLVec3{PDS, 0, 0}, GLVec3{0, PDS, 2.25f}},
// 	{GLVec3{-PDS+1.194f, 1.194f, 0},GLVec3{0.62f,-0.82f, 0},GLVec3{-0.21f,PDS-0.21f, 0}}};


// static void VRPN_CALLBACK handler_head_tracker(void* userdata, const vrpn_TRACKERCB t)
// {
// 	qogl_matrix_type r;
// 	q_to_ogl_matrix(r, t.quat);
// 	Eigen::Matrix4d m4d;
// 	m4d << r[0], r[4], r[8], t.pos[0], r[1], r[5], r[9], t.pos[1], r[2], r[6], r[10], t.pos[2], 0.0f, 0.0f, 0.0f, 1;
// 	CaveViewer::head_matrix_s_ = m4d.cast<float>();
// }


// void CaveViewer::caveProjView(int id_cam, int id_eye, GLMat4& proj, GLMat4& view)
// {
// 	const GLVec3& A = screen_coords_[id_cam][0];
// 	const GLVec3& B = screen_coords_[id_cam][1];
// 	const GLVec3& C = screen_coords_[id_cam][2];

// 	GLVec3 E = Transfo::apply(
// 		head_matrix_s_, GLVec3(-0.015f, (id_eye == 1) ? -half_eyes_dist_ : half_eyes_dist_, 0.0f));

// 	GLVec3 Ox = (B - A).normalized();
// 	GLVec3 Oy = (C - A).normalized();
// 	GLVec3 Oz = Ox.cross(Oy).normalized();
// 	GLVec3 EA = A - E;
// 	float dist = -(EA.dot(Oz));
	 
// 	float ND = nearCP / dist;
// 	float l = Ox.dot(EA) * ND;
// 	float r = Ox.dot(B - E) * ND;
// 	float b = Oy.dot(EA) * ND;
// 	float t = Oy.dot(C - E) * ND;

// 	proj << (2.0f * nearCP) / (r - l), 0.0f, (r + l) / (r - l), 0.0f, 0.0f, (2.0f * nearCP) / (t - b),
// 		(t + b) / (t - b), 0.0f, 0.0f, 0.0f, -(farCP + nearCP) / (farCP - nearCP),
// 		-(2.0f * farCP * nearCP) / (farCP - nearCP), 0.0f, 0.0f, -1.0f, 0.0f;

// 	GLMat4 R;
// 	R << Ox[0], Ox[1], Ox[2], 0, Oy[0], Oy[1], Oy[2], 0, Oz[0], Oz[1], Oz[2], 0, 0, 0, 0, 1;
// 	view = R * Transfo::translate(-E);
// }