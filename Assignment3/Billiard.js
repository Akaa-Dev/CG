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
for (let index = 0; index < 2; index++) {
  const x = [12.4,-12.4]
  const cushGeo = new THREE.BoxGeometry(0.6,1,12.2);
  const cushMat = new THREE.MeshBasicMaterial( {color: 0xC17817} );
  const cushion = new THREE.Mesh(cushGeo,cushMat);
  cushion.translateX(x[index]);
  cushion.translateY(-0.25);
  table.add(cushion);
}
for (let index = 0; index < 2; index++) {
  const z = [6.2,-6.2]
  const cushGeo = new THREE.BoxGeometry(25.4,1,0.5);
  const cushMat = new THREE.MeshBasicMaterial( {color: 0xC17817} );
  const cushion = new THREE.Mesh(cushGeo,cushMat);
  cushion.translateZ(z[index]);
  cushion.translateY(-0.25);
  table.add(cushion);
}
floor.add(table);

//* Add balls
const ballRadius = 0.25;
const ballRadiusSq = ballRadius * ballRadius;
const ballGeo = new THREE.SphereGeometry(ballRadius, 18, 18);

// Create ball 1 with texture
const ball1 = new THREE.Mesh(ballGeo,  new THREE.MeshBasicMaterial( {color: 0x0000ff,
                                                                     wireframe:true}));
ball1.translateY(-0.5);

// Create ball 2 with texture
const ball2 =  new THREE.Mesh(ballGeo,  new THREE.MeshBasicMaterial( {color: 0xff0000,
                                                                      wireframe:true}));

ball2.translateY(-0.5);
ball2.translateX(2);
table.add(ball1,ball2);



// speed and current position of translational motion
const slowDown = 2;
//let u1 = //new THREE.Vector3(3+2*Math.random(), 0, 3+2*Math.random()).divideScalar(slowDown);
//ball1.position.copy(new THREE.Vector3(-floorX/5, ballRadius, -floorZ/5));
//let u2 = //new THREE.Vector3(3+2*Math.random(), 0, -3+2*Math.random()).divideScalar(slowDown);
//ball2.position.copy(new THREE.Vector3(-floorX/5, ballRadius, floorZ/5));


// * Render loop
const controls = new TrackballControls( camera, renderer.domElement );
const computerClock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);

  const dt = computerClock.getDelta();

  // update position of ball:
 // ball2.position.add(u2.clone().multiplyScalar(dt));
  //ball1.position.add(u1.clone().multiplyScalar(dt));


  // Implement reflection: the axis of rotation has to be updated since the direction of the speed changes!
  /*if(ball1.position.x> 12.2) {
    u1.x = - Math.abs(u1.x);
  }
  if(ball1.position.x< -12.2) {
    u1.x = - Math.abs(u1.x);
  }
  if(ball1.position.z > 6.2) {
    u1.z = - Math.abs(u1.z);
  }
  if(ball1.position.z <-6.2) {
    u1.z = - Math.abs(u1.z);
  }
  if(ball2.position.x> floorX/5) {
    u2.x = - Math.abs(u2.x);
  }
  if(ball2.position.z > 6.2) {
    u2.z = - Math.abs(u2.z);
  }*/

  controls.update();
  renderer.render(scene, camera);
}
render();
