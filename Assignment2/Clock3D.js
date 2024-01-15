// "use strict";

import * as THREE from "three";
import {
  TrackballControls
} from "three/addons/controls/TrackballControls.js";

// Initialize WebGL renderer
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setClearColor('white'); // background color

const geometry = new THREE.CylinderGeometry(6, 6, 0.6, 32);
const material = new THREE.MeshBasicMaterial({
  color: 0xE4E7F5,
  side: THREE.DoubleSide
});
const cylinder = new THREE.Mesh(geometry, material);

const tgeometry = new THREE.PlaneGeometry(0.25, 1.3);
const tmaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide
});
const t12Mat = new THREE.MeshBasicMaterial({
  color: 0x80CED7,
  side: THREE.DoubleSide
});
const smallTickGeo = new THREE.PlaneGeometry(0.0625, 0.6);
const smallTickMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide
});

const clockHandGeo = new THREE.SphereGeometry(15, 32, 16);
const clockHandmaterial = new THREE.MeshBasicMaterial({
  color: 0x000000
});

const minHand = new THREE.Mesh(clockHandGeo, clockHandmaterial);
const hourHand = new THREE.Mesh(clockHandGeo, clockHandmaterial);
const secondHand = new THREE.Mesh(clockHandGeo, clockHandmaterial);

const sGroup = new THREE.Group();
const mGroup = new THREE.Group();
const hGroup = new THREE.Group();
sGroup.add(secondHand);
mGroup.add(minHand);
hGroup.add(hourHand);

const blobgeometry = new THREE.ConeGeometry(5, 5, 32);
const blobmaterial = new THREE.MeshStandardMaterial({
  color: "#CE7731",
  metalness: 0.7,
  roughness: 0.9,
});
const blob = new THREE.Mesh(blobgeometry, blobmaterial)

const HamburgTime = new Date().toLocaleString("en-US", {
  timeZone: "Europe/Berlin"
}).split(' ')[1];
const BeijingTime = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Shanghai"
}).split(' ')[1];
const [hamHour, hamMin, hamSec] = HamburgTime.split(':');
const [chinaHour, chinaMin, chinaSec] = BeijingTime.split(':');
const SIXTY =60;

hourHand.scale.set(0.13, 0.009, 0);
minHand.scale.set(0.160, 0.012, 0);
secondHand.scale.set(0.160, 0.003, 0);
blob.scale.set(0.10, 0.07, 0.06)

minHand.translateX(2.3);
hourHand.translateX(2);
secondHand.translateX(2.3);

minHand.translateY(1);
hourHand.translateY(1);
secondHand.translateY(1);
blob.translateY(1);

minHand.rotateX(Math.PI / 2);
hourHand.rotateX(Math.PI / 2);
secondHand.rotateX(Math.PI / 2);

cylinder.add(sGroup, mGroup, hGroup, blob);
const bottomFace = cylinder.clone();
cylinder.rotateX(Math.PI / 2);

bottomFace.translateZ(-0.6);
bottomFace.rotateX(Math.PI / 2);
bottomFace.children.forEach(m => {
  m.translateY(-1.5);
  if (m == bottomFace.children[3]) {
    m.rotateX(Math.PI);
  }
});
const mat = new THREE.MeshStandardMaterial({
  color: '#FFBD87',
  metalness: 0.5,
  roughness: 0.1,
  flatShading: true,
  side: THREE.DoubleSide
});
const outerRadius = 7.2;
const innerRadius = 5.9;
const height = 1.5;
const outerCircle = new THREE.Shape();
outerCircle.moveTo(outerRadius, 0);
const innerCircle = new THREE.Shape(); // serves as hole in outerCircle
innerCircle.moveTo(innerRadius, 0);
const N = 100;
const deltaPhi = 2 * Math.PI / N;
for (let k = 1; k <= N; ++k) {
  outerCircle.lineTo(outerRadius * Math.cos(k * deltaPhi),
    outerRadius * Math.sin(k * deltaPhi));
  innerCircle.lineTo(innerRadius * Math.cos(k * deltaPhi),
    innerRadius * Math.sin(k * deltaPhi));
}
outerCircle.holes.push(innerCircle);

const extrudeSettings = {
  bevelEnabled: false,
  depth: height,
};
const extrudeGeo = new THREE.ExtrudeGeometry(outerCircle, extrudeSettings);
const extrudeRing = new THREE.Mesh(extrudeGeo, mat);
extrudeRing.translateZ(-1);

const light = new THREE.PointLight();
const ambLight = new THREE.AmbientLight('#909090');
light.position.set(-5, 5, 5);
light.intensity = 150;
ambLight.intensity = 10;

// Create a new Three.js scene
const scene = new THREE.Scene();
for (let index = 0; index < SIXTY; index++) {
  let tick;
  let tb;
  if (index == 15) {
    tick = new THREE.Mesh(tgeometry, t12Mat);
    tb = new THREE.Mesh(tgeometry, t12Mat);
  } else if (index % 5 == 0) {
    tick = new THREE.Mesh(tgeometry, tmaterial);
    tb = new THREE.Mesh(tgeometry, tmaterial);
  } else {
    tick = new THREE.Mesh(smallTickGeo, smallTickMat);
    tb = new THREE.Mesh(smallTickGeo, smallTickMat);
  }
  tick.translateZ(0.7);
  tb.translateZ(-1.3);

  tick.position.x = 6 * Math.cos(2 * Math.PI * index / SIXTY);
  tb.position.x = 6 * Math.cos(2 * Math.PI * index / SIXTY);

  tick.position.y = 6 * Math.sin(2 * Math.PI * index / SIXTY);
  tb.position.y = 6 * Math.sin(2 * Math.PI * index / SIXTY);

  tick.lookAt(new THREE.Vector3(0, 0, 0));
  tb.lookAt(new THREE.Vector3(0, 0, 0));

  tick.rotateX(Math.PI / 2);
  tb.rotateX(Math.PI / 2);


  if (index != 15 && index != 45) {
    tick.rotateY(Math.PI / 2);
    tb.rotateY(Math.PI / 2);
  }
  tick.translateY(1);
  tb.translateY(1);
  scene.add(tick, tb);
}
sGroup.children[0].position.set(2, 0, 0);
sGroup.translateY(1);

scene.add(cylinder, bottomFace,extrudeRing,light,ambLight);

//Calculating the Initial Placement of hands
cylinder.children[2].rotateY(((3 - hamHour) * 30 * Math.PI / 180) - ((0.52 / SIXTY * hamMin))); 
cylinder.children[1].rotateY((15 - hamMin) * 6 * Math.PI / 180);
cylinder.children[0].rotateY((15 - hamSec) * 6 * Math.PI / 180);

bottomFace.children[2].rotateY(-((9 - chinaHour) * 30 * Math.PI / 180) + (0.52 / SIXTY * hamMin));
bottomFace.children[1].rotateY(-(45 - chinaMin) * 6 * Math.PI / 180);
bottomFace.children[0].rotateY(-(45 - chinaSec) * 6 * Math.PI / 180);

// Add a camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 500);
camera.position.set(-3, 1, 11);


const controls = new TrackballControls(camera, renderer.domElement);

// Render the scene
function render() {
  requestAnimationFrame(render);
  
  const secSpeed = hamSec < 30 ? 2 * Math.PI / SIXTY : -2 * Math.PI / SIXTY; // radians per frame
  const minSpeed = 2 * Math.PI / Math.pow(SIXTY, 2);; // radians per frame
  const hourSpeed = 2 * Math.PI / Math.pow(SIXTY, 3); // radians per frame


  sGroup.rotation.y += -secSpeed / SIXTY;
  mGroup.rotation.y += -minSpeed / SIXTY;
  hGroup.rotation.y += -hourSpeed / SIXTY;

  bottomFace.children[0].rotation.y += -secSpeed / SIXTY;
  bottomFace.children[1].rotation.y += -minSpeed / SIXTY;
  bottomFace.children[2].rotation.y += -hourSpeed / SIXTY;

  controls.update();
  renderer.render(scene, camera);
}
render();