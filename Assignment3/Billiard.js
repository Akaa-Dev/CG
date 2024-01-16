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

const planeNormal = new THREE.Vector3(0,1,0);
const ballRadius = 0.5;
let ballArray = [];
let posArray =[];
//* Add balls
for (let index = 0; index < 8; index++) {
  const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 8,4),
                            new THREE.MeshBasicMaterial( {color: 0x0000ff,
                                                          wireframeLinewidth:2,
                                                          wireframe:true}));
                                               
ball.matrixAutoUpdate = false;
ballArray.push(ball);
}

ballArray.forEach(ball => {
  table.add(ball);
});

// speed and current position of translational motion
let speedArray =[];
for (let index = 1; index <= ballArray.length; index++) {
  const ballSpeed = new THREE.Vector3(index*Math.random(), 0, index*Math.random());
  speedArray.push(ballSpeed);
}
//TODO: recheck inital placement
for (let index = 0; index < ballArray.length; index++) {
  let definedPos =[];

  const x = Math.random()*23/2;
  const z = Math.random()*11/2;
  const randomSignX = Math.round(Math.random()*1);
  const randomSignZ = Math.round(Math.random()*1);
  const randomX = randomSignX==0? x:x*-1;
  const randomZ = randomSignZ==0?z:z*-1;
  const ballPos  = new THREE.Vector3(randomX, -1, randomZ);

  if(!definedPos.includes(ballPos)){
    definedPos.push(ballPos);
    posArray.push(ballPos);
  }
  
}


//* Render loop
const computerClock = new THREE.Clock();
const controls = new TrackballControls( camera , canvas );
function render() {
  requestAnimationFrame(render);

  // Reflection at the cushion
  for (let index = 0; index < posArray.length; index++) {
    if(posArray[index].x> 23.2/2) {
      speedArray[index].x = - Math.abs(speedArray[index].x*(0.8));   
    }
    if(posArray[index].z > 11/2) {
      speedArray[index].z = - Math.abs(speedArray[index].z*(0.8));
    }
    if(posArray[index].x<-23.2/2){
      speedArray[index].x = + Math.abs(speedArray[index].x*(0.8));
    }
    if(posArray[index].z<-11/2){
      speedArray[index].z = +Math.abs(speedArray[index].z*(0.8));
    }
    
  }

  // Motion of the ball in this time step
  const h = computerClock.getDelta();  // important: call before getElapsedTime!!!
  const t = computerClock.getElapsedTime();

  // update position of ball:
  for (let index = 0; index < posArray.length; index++) {
    posArray[index].add(speedArray[index].clone().multiplyScalar(h));
   
  }
  let omegaArray =[];
  let drArray =[];
  let axisArray =[];
  
  speedArray.forEach(ballSpeed=>{
    const om = ballSpeed.length() / ballRadius;
    const axis = planeNormal.clone().cross(ballSpeed).normalize();
    omegaArray.push(om);
    axisArray.push(axis);
  })
  for (let index = 0; index < omegaArray.length; index++) {
    const dR = new THREE.Matrix4().makeRotationAxis(axisArray[index], omegaArray[index]*h);
    drArray.push(dR);
  }

  for (let index = 0; index < ballArray.length; index++) {
    ballArray[index].matrix.premultiply(drArray[index]);
    ballArray[index].matrix.setPosition(posArray[index]);
  }
  
for (let i = 0; i< ballArray.length; i++) {
   
    for (let j=i+1; j < ballArray.length; j++) {
      if(isCollided(i,j)){
        collision(i,j);
      }  
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
render();

function collision(ball1,ball2){
let d = new THREE.Vector3();
let difference = new THREE.Vector3();
let eq = new THREE.Vector3();
d.copy(posArray[ball1]).sub(posArray[ball2]);
difference.copy(speedArray[ball1]).sub(speedArray[ball2]);
eq=d.multiplyScalar((difference.dot(d)/Math.abs(d.length() *d.length())));

console.log(eq);
speedArray[ball1].sub(eq);
speedArray[ball2].add(eq);
}

function isCollided(ball1, ball2){
  let gap = new THREE.Vector3();
  gap.copy(posArray[ball1]).sub(posArray[ball2]);
  if(gap.length()<ballRadius*2){
    return true;
  }
  return false;
}