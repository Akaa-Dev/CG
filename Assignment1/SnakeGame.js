// "use strict";

import * as THREE from "three";
import {
  TrackballControls
} from "three/addons/controls/TrackballControls.js";

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor('rgb(2,3,4)'); // set background color

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, canvas.width / canvas.height, 0.1, 100);
const plane = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x6E6E6E
});
const field = new THREE.Mesh(plane, planeMaterial);
const cubeGeo = new THREE.BoxGeometry(0.95, 0.95, 0.85);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x257F40
})
const snakeBodyMat = new THREE.MeshBasicMaterial({
  color: 0x3491EE
});
const snakeHead = new THREE.Mesh(cubeGeo, cubeMaterial);
const sphere = new THREE.SphereGeometry(0.5, 32, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xE60D2A
});

const ball = new THREE.Mesh(sphere, sphereMaterial);
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
const startposition = 5;
const snake = new Deque();
const group = new THREE.Group();
let initialDir = 'idle';
let oldIintervalId = 0;
let previousCase;
let currentCase;

gridHelper.rotateX(Math.PI / 2);
snakeHead.translateZ(0.5);
snakeHead.translateX(0.5);
snakeHead.translateY(0.5);
ball.translateZ(0.5);
moveBall();

camera.position.set(1, 5, 9);
camera.lookAt(scene.position);
field.add(gridHelper);
field.add(snakeHead);
field.add(ball)
scene.rotateZ(Math.PI);
scene.add(camera);
scene.add(new THREE.AxesHelper(1.5));
scene.add(field);

let xstep = 0; // right +, left -
let ystep = 0; // up -, down +
let firstEat = false;
let prev = 'idle';
const moveOneUnit = (direction) => {
  let initX = 0.5;
  let initY = 0.5;
  let ischangeDir = prev == direction ? false : true;
 
  let v = new THREE.Vector3();
  let v1 = new THREE.Vector3();
  switch (direction) {
    case "down":
      if (startposition + ystep < 9) {
        snakeHead.translateY(initY + 0.5);
        initY += 0.5;
      } 
      ystep++;
      break;
    case "up":
      if (startposition + ystep > 0) {
        snakeHead.translateY(initY - 1.5);
        initY -= 1.5;
      }
      ystep--;
      break;
    case "left":
      if (startposition + xstep > 1) {
        snakeHead.translateX(initX + 0.5);
        initX += 0.5;
      }
      xstep--;
      break;
    case 'right':
      if (startposition + xstep < 10) {
        snakeHead.translateX(initX - 1.5);
        initX -= 1.5;
      }
      xstep++;
      break;
  }
  prev = direction;
  snakeHead.getWorldPosition(v);
  ball.getWorldPosition(v1);
  if (v.getComponent(0) == v1.getComponent(0) && v.getComponent(1) == v1.getComponent(1)) {
    if (firstEat == false) {
      firstEat = true;
      initialDir = currentCase;
    }
    moveBall();
    grow(initialDir);
  }

  if (ischangeDir) {
    updatePosition(v);
    ischangeDir = false;
  }
  if (startposition + xstep > 10 || startposition + xstep < 1 || startposition + ystep > 10 || startposition + ystep < 0) {
    alert(`Game Over!, length of snake: ${snake.size()+1}` );
  }

}

const grow = (dir) => {
  if (snake.isEmpty()) {
    snake.insertFront(new THREE.Mesh(cubeGeo, snakeBodyMat));
  } else {
    snake.insertBack(new THREE.Mesh(cubeGeo, snakeBodyMat));
  }
  let v = new THREE.Vector3();
  for (let index = 0; index < snake.size(); index++) {
    let body;
    switch (dir) {
      case "ArrowDown":
        body = snake.getValues()[index].translateY(-1);
        break;
      case "ArrowUp":
        body = snake.getValues()[index].translateY(1);
        break;
      case "ArrowLeft":
        body = snake.getValues()[index].translateX(-1);
        break;
      case "ArrowRight":
        body = snake.getValues()[index].translateX(1);
        break;
    }
    group.add(body);
  }
  snakeHead.add(group);
}

const moveSnake = (direction) => {
  return setInterval(moveOneUnit, 250, direction);
}

const updatePosition = (position) => {

  let v1 = position;
  for (let index = 0; index < group.children.length; index++) {
    const v = new THREE.Vector3();
    let v2 = new THREE.Vector3();
    let v3 = new THREE.Vector3();
    group.children[index].getWorldPosition(v);

    group.children[index].position.setX(position.x-v1.x);
    group.children[index].position.setY(position.y-v1.y);
    v1 = v;
  }
}

document.body.addEventListener("keydown", (e) => {
  let newIintervalId;
  previousCase = currentCase;
  if (currentCase != e.key) {
    clearInterval(oldIintervalId);
    switch (e.key) {
      case "ArrowDown":
        if (previousCase != "ArrowUp") {
          newIintervalId = moveSnake('down');
          currentCase = e.key;
        } else {
          newIintervalId = moveSnake('up');
          currentCase = e.key;
        }
        break;
      case "ArrowUp":
        if (previousCase != "ArrowDown") {
          newIintervalId = moveSnake('up');
          currentCase = e.key;
        } else {
          newIintervalId = moveSnake('down');
          currentCase = e.key;
        }
        break;
      case "ArrowLeft":
        if (previousCase != "ArrowRight") {
          newIintervalId = moveSnake('left');
          currentCase = e.key;
        } else {
          newIintervalId = moveSnake('right');
          currentCase = e.key;
        }
        break;
      case "ArrowRight":
        if (previousCase != "ArrowLeft") {
          newIintervalId = moveSnake('right');
          currentCase = e.key;
        } else {
          newIintervalId = moveSnake('left');
          currentCase = e.key;
        }
        break;
    }
  }
  oldIintervalId = newIintervalId;
})

// * Render loop
const controls = new TrackballControls(camera, renderer.domElement);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  controls.update();
}
render();


function moveBall() {
  ball.position.setX(0);
  ball.position.setY(0);
  const randX = (Math.round(Math.random() * 4)) + 0.5;
  const randY = (Math.round(Math.random() * 4)) + 0.5;
  const rand = (Math.round(Math.random() * 1));
  const sign = rand == 1 ? 1 : -1;
  ball.translateX(randX * sign);
  ball.translateY(randY * sign);
}


// * Deque:
// https://learnersbucket.com/tutorials/data-structures/implement-deque-data-structure-in-javascript/

function Deque() {
  //To track the elements from back
  let count = 0;

  //To track the elements from the front
  let lowestCount = 0;

  //To store the data
  let items = {};
  this.getValues = () => {
    return Object.values(items);
  };

  //Add an item on the front
  this.insertFront = (elm) => {

    if (this.isEmpty()) {
      //If empty then add on the back
      this.insertBack(elm);

    } else if (lowestCount > 0) {
      //Else if there is item on the back
      //then add to its front
      items[--lowestCount] = elm;

    } else {
      //Else shift the existing items
      //and add the new to the front
      for (let i = count; i > 0; i--) {
        items[i] = items[i - 1];
      }

      count++;
      items[0] = elm;
    }
  };

  //Add an item on the back of the list
  this.insertBack = (elm) => {
    items[count++] = elm;
  };

  //Remove the item from the front
  this.removeFront = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the first item and return it
    const result = items[lowestCount];
    delete items[lowestCount];
    lowestCount++;
    return result;
  };

  //Remove the item from the back
  this.removeBack = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the last item and return it
    count--;
    const result = items[count];
    delete items[count];
    return result;
  };

  //Peek the first element
  this.getFront = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[lowestCount];
  };

  //Peek the last element
  this.getBack = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[count - 1];
  };

  //Check if empty
  this.isEmpty = () => {
    return this.size() === 0;
  };

  //Get the size
  this.size = () => {
    return count - lowestCount;
  };

  //Clear the deque
  this.clear = () => {
    count = 0;
    lowestCount = 0;
    items = {};
  };

  //Convert to the string
  //From front to back
  this.toString = () => {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${items[lowestCount]}`;
    for (let i = lowestCount + 1; i < count; i++) {
      objString = `${objString},${items[i]}`;
    }
    return objString;
  };
}