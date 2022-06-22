// Bartending Simulator
// By Jacksonn Dunnigan
// Student ID: 40212769

"use strict";

// World variables
const canvasWidth = 800;
const canvasHeight = 800;
const delta = 1000 / 60;
const subSteps = 2;
const subDelta = delta / subSteps;
const debug = false;

let world;
let canvas;
let click = false;
let mouseHolding = false;
let mouseDown = false;
let holdingConstraint = null;
let character;

// Control variables
let scrollDelta = 0;
let scrolling = false;
let cycle = 0;
let cycleRate = 0.02;
let currentHolding;

// Defines sprites
let sprAnkel1,
    sprAnkel2,
    sprBody,
    sprBoob,
    sprFoot1,
    sprFoot2,
    sprHead,
    sprFaceSpriteSheet,
    sprSmokeSpriteSheet,
    sprKnee,
    sprLeftElbow,
    sprLeftForearm,
    sprLeftShoulder,
    sprLeftUpperArm,
    sprLeftWrist,
    sprLeg,
    sprPipe,
    sprRightForearm,
    sprRightUpperArm,
    sprThigh;

// Collision categories
var objectCategory = 0x0001,
    mouseCategory = 0x0002,
    noCollideCategory = 0x0003;

// Defines colors
let cDarkGrey, cLightGrey;


// Implements Matter.js modules
let engine, render, mouse, mouseConstraint;
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bounds = Matter.Bounds,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Collision = Matter.Collision,
    Vertices = Matter.Vertices,
    Common = Matter.Common,
    Body = Matter.Body;


// Loads images, sounds and colours
function preload() {
  // Loads sprites
  sprAnkel1 = loadImage('assets/images/Ankel1.png');
  sprAnkel2 = loadImage('assets/images/Ankel2.png');
  sprBody = loadImage('assets/images/Body.png');
  sprBoob = loadImage('assets/images/Boob.png');
  sprFoot1 = loadImage('assets/images/Foot1.png');
  sprFoot2 = loadImage('assets/images/Foot2.png');
  sprHead = loadImage('assets/images/Head.png');
  sprFaceSpriteSheet = loadImage('assets/images/FaceSpriteSheet.png');
  sprSmokeSpriteSheet = loadImage('assets/images/SmokeSpriteSheet.png');

  sprKnee = loadImage('assets/images/Knee.png');
  sprLeftElbow = loadImage('assets/images/LeftElbow.png');
  sprLeftForearm = loadImage('assets/images/LeftForearm.png');
  sprLeftShoulder = loadImage('assets/images/LeftShoulder.png');
  sprLeftUpperArm = loadImage('assets/images/LeftUpperArm.png');
  sprLeftWrist = loadImage('assets/images/LeftWrist.png');
  sprLeg = loadImage('assets/images/Leg.png');
  sprPipe = loadImage('assets/images/Pipe.png');
  sprRightForearm = loadImage('assets/images/RightForearm.png');
  sprRightUpperArm = loadImage('assets/images/RightUpperArm.png');
  sprThigh = loadImage('assets/images/Thigh.png');

  // Loads Sounds


  // Defines colours
  cDarkGrey = color(58, 59, 60);
  cLightGrey = color(176, 179, 184);
}

// Sets up the canvas
function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);

  // Creates an engine
  var engineOptions = {
    positionIterations: 6,
    velocityIterations: 4,
    constraintIterations: 2,
    enableSleeping: true,
    events: [],
    plugin: {},
    gravity: {
        x: 0,
        y: 1,
        scale: 0.001
    },
    timing: {
        timestamp: 0,
        timeScale: 1,
        lastDelta: 0,
        lastElapsed: 0
    }
  };

  // Creates the engine
  engine = Engine.create(engineOptions);
  world = engine.world;
  Engine.run(engine);
  world.gravity.y = 0;

  // Creates static objects
  character = new Character();

  // Creates the mouse for interaction
  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  // mouseConstraint = MouseConstraint.create(engine, {
  //   mouse: mouse,
  //   pixelRatio: pixelDensity(),
  //   constraint: {
  //       stiffness: 0.05,
  //       length: 10,
  //       render: {
  //           visible: false
  //       }
  //   },
  //   collisionFilter: {
  //     category: mouseCategory,
  //     mask : mouseCategory | objectCategory
  //   }
  // });

  // Stores the body being held
  // Events.on(mouse, 'mousedown', function(event) {
  //   mousePressed = true;
  //   console.log(1);
  //   // if (mouseConstraint.body != null) {
  //   //   currentHolding = mouseConstraint.body;
  //   // }
  // });
  //
  // // Lets go of the body and resets the position
  // Events.on(mouse, 'enddrag', function(event) {
  //   mousePressed = false;
  //   console.log(2);

    // if (currentHolding != null) {
    //   // currentHolding.x = currentHolding.initialX;
    //   // currentHolding.y = currentHolding.initialY;
    //   // currentHolding.angle = currentHolding.initialAngle;
    //   // console.log(currentHolding.x, currentHolding.y, currentHolding.angle);
    //   console.log(currentHolding);
    //   currentHolding = null;
  //
  // });
  //
  World.add(world, mouse);
}

// Pressing the mouse down
function mousePressed() {
  mouseDown = true;
  // console.log(1)
}

// Releases the mouse
function mouseReleased() {
  mouseDown = false;
  // Removes the mouse constraint
  if (holdingConstraint != null) {
    World.remove(world, holdingConstraint, true);
    holdingConstraint = null;

  }
  // console.log(2)

}

// Mouse Scrolling
function mouseWheel(event) {
  scrolling = true;
  scrollDelta = event.delta / abs(event.delta)
}

// Plays a sound
function playSound(sound) {
  sound.rate(random(0.7, 1));
  sound.play();
}

// Runs the program
function draw() {
  background(255);
  noStroke();
  // noSmooth();
  simulation();
}

// Runs the simulation
function simulation() {
  frameRate(60);

  // Controls cycles
  cycle += cycleRate;

  character.move();
  character.display();

  // // Globally stores what the mouse is holding
  // if (mouseConstraint.body != null){
  //   mouseHolding = true;
  // } else {
  //   mouseHolding = false;
  // }
}
