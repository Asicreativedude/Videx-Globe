import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
// gui.close();
gui.hide();
// Canvas
const canvas = document.querySelector('canvas.webgl-globe');

// Scene
const scene = new THREE.Scene();
//fog
const color = 0x191919; // white
const near = 0.1;
const far = 4;
// scene.fog = new THREE.Fog(color, near, far);
// scene.background = new THREE.Color(color);

/**
 * Textures
 */
// const wireframeMaterial = new THREE.MeshBasicMaterial({
// 	opacity: 0.1,
// 	wireframe: true,
// 	transparent: true,
// 	color: 0xf9f9f9,
// });

const globeTexture = new THREE.TextureLoader().load('/earth.jpg');
globeTexture.wrapS = THREE.RepeatWrapping;
globeTexture.wrapT = THREE.RepeatWrapping;
globeTexture.offset.x = 1.5708 / (2 * Math.PI);
let globeMaterial = new THREE.MeshStandardMaterial({
	map: globeTexture,
	color: 0x191919,
});
const markerTexture = new THREE.TextureLoader().load('/Marker.svg');

// const directLight = new THREE.DirectionalLight(0xffffff, 5);
const ambient = new THREE.AmbientLight('#ffffff', 5);
scene.add(ambient);
// directLight.position.set(2, 2, 0);
// const helper = new THREE.DirectionalLightHelper(directLight, 2);
// scene.add(helper);

/**Objects */
let globeSphere = new THREE.SphereGeometry(1, 128, 128);

let globe = new THREE.Mesh(globeSphere, globeMaterial);
scene.add(globe);

/**pins */

function latLonToCart(userLat, userLng) {
	const lat = userLat * (Math.PI / 180);
	const lng = userLng * (Math.PI / 180);

	const x = 1.02 * Math.cos(lat) * Math.sin(lng);
	const y = 1.02 * Math.sin(lat);
	const z = 1.02 * Math.cos(lat) * Math.cos(lng);

	return [x, y, z];
}

let countires = [
	{ name: 'Argentina', lat: -38.4192641, lng: -63.5989206 },
	{ name: 'Australia', lat: -26.4390917, lng: 133.281323 },
	{ name: 'Belgium', lat: 50.5010789, lng: 4.4764595 },
	{ name: 'Brazil', lat: -14.2400732, lng: -53.1805017 },
	{ name: 'Canada', lat: 61.06669, lng: -107.99171 },
	{ name: 'Chile', lat: -31.76134, lng: -71.31877 },
	{ name: 'Netherland', lat: 52.2129919, lng: 5.2793703 },
	{ name: 'Italy', lat: 42.63843, lng: 12.6743 },
	{ name: 'Israel', lat: 31.0461, lng: 34.8516 },
	{ name: 'USA', lat: 37.0902, lng: -95.7129 },
];
const fontLoader = new FontLoader();

let pins = new THREE.Group();
scene.add(pins);

countires.forEach((element) => {
	let pos = latLonToCart(element.lat, element.lng);
	// let pin = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(0.02, 0.03),
	// 	// new THREE.SphereGeometry(0.01, 10, 10),
	// 	new THREE.MeshBasicMaterial({
	// 		map: markerTexture,
	// 		// color: 0xe1832a,
	// 		side: THREE.DoubleSide,
	// 		transparent: true,
	// 	})
	// );
	fontLoader.load(
		'/helvetiker_bold.typeface.json',
		// '/fonts/gentilis_regular.typeface.json',
		// '/fonts/optimer_regular.typeface.json',
		(font) => {
			function getRandomSize(min, max) {
				return Math.random() * (max - min) + min;
			}
			let rSize = getRandomSize(0.015, 0.02);
			const textGeometry = new TextGeometry(element.name, {
				font,
				size: rSize,
				height: 0,
				// curveSegments: 3,
				// bevelEnabled: true,
				// bevelThickness: 0.01,
				// bevelSize: 0.04,
				// bevelOffset: 0,
				// bevelSegments: 8,
			});
			textGeometry.center();
			const name = new THREE.Mesh(
				textGeometry,
				new THREE.MeshBasicMaterial({
					// map: markerTexture,
					color: 0xe1832a,
					side: THREE.DoubleSide,
					// transparent: true,
				})
			);
			name.position.set(pos[0], pos[1], pos[2]);
			name.scale.x *= -1;
			pins.add(name);
		}
	);

	// pin.position.set(pos[0], pos[1], pos[2]);
	// pins.add(pin);
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);

camera.position.set(0, 0, 1.8);
scene.add(camera);
if (sizes.width < sizes.height) {
	camera.position.set(0, 0, 2.8);
}
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enableZoom = false;
controls.enablePan = false;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();
	for (let i = 0; i < pins.children.length; i++) {
		// pins.children[i].quaternion.copy(camera.quaternion);
		pins.children[i].lookAt(0, 0, 0);
	}

	// });

	//update camera
	// camera.position.x = Math.cos(elapsedTime * 0.5) * 10;
	// camera.position.z = Math.sin(elapsedTime * 0.5) * 10;
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	renderer.setAnimationLoop(tick);
};

tick();
