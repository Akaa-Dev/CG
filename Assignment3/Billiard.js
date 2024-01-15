"use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";


// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas,
                                          antialias: true});
renderer.setClearColor('#ffffff');    // set background color
renderer.setSize(window.innerWidth, window.innerHeight);
// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());
const camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height,
                                            0.1, 1000 );

window.addEventListener("resize", function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});

camera.position.set(10, 5, 8);
camera.lookAt(scene.position);

// remove this in the final version1
scene.add(new THREE.AxesHelper());

// * Add your billiard simulation here

//* Add floor
const floorX = 50;
const floorZ = 50;
const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(floorX, floorZ, 20, 20),
                                 new THREE.MeshBasicMaterial({wireframe:true,
                                                              color:0x000000,
                                                              side:THREE.DoubleSide}));
floorMesh.rotation.x = Math.PI/2;
//scene.add(floorMesh);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorX, floorZ, 20, 20),
                             new THREE.MeshBasicMaterial({wireframe:false,
                                                          color:0x505050,
                                                          side:THREE.DoubleSide}));
floor.material.transparent = true;
floor.material.opacity = 0.5;
floor.rotation.x = Math.PI/2;
scene.add(floor);
const tableGeo = new THREE.BoxGeometry(25.4,0.5,12.7);
const tableMat = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const table = new THREE.Mesh( tableGeo, tableMat ); 
table.rotateX(Math.PI/2);
table.translateY(-5);

for (let index = 0; index < 4; index++) {
  const x =[12.2,-12.2,12.2,-12.2];
  const z = [6,6,-6,-6];
  const legGeo = new THREE.BoxGeometry(0.6,5,0.5);
  const legMat = new THREE.MeshBasicMaterial( {color: 0xC17817} ); 
  const leg = new THREE.Mesh( legGeo, legMat ); 
  leg.translateY(2.5);
  leg.translateX(x[index]);
  leg.translateZ(z[index]);
  //leg.rotateX(Math.PI/2);

  table.add(leg);  
}


floor.add(table);

// * Render loop
const controls = new TrackballControls( camera, renderer.domElement );

function render() {
  requestAnimationFrame(render);


  controls.update();
  renderer.render(scene, camera);
}
render();
