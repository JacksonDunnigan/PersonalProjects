

"use strict";

// Constant variables
const delta = 1000 / 60;
const subSteps = 2;
const subDelta = delta / subSteps;
const debug = false;

// Change this to the size being defined in setup and updates every time the window is resized
const maxCanvasWidth = 1800;
const minCanvasWidth = 300;
const maxCanvasHeight = 1000;
const minCanvasHeight = 400;

// Variables
let initialCanvasWidth;
let initialCanvasHeight;
let canvasScale;
let world;
let canvas;
let click = false;
let mouseHolding = false;
let mouseDown = false;
let holdingConstraint = null;
let character;
let characterX;
let characterY;
let characterXScale = -330;
let characterYScale = -270;

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

  // Defines colours
  cDarkGrey = color(58, 59, 60);
  cLightGrey = color(176, 179, 184);
}

// Sets up the canvas
function setup() {
  // Assigns new values for width and height variables
  initialCanvasWidth = max(min(window.innerWidth, maxCanvasWidth), minCanvasWidth);
  initialCanvasHeight = max(min(window.innerHeight, maxCanvasHeight), minCanvasHeight);

  // Resizes the canvas
  canvas = createCanvas(initialCanvasWidth, initialCanvasHeight);
  canvasScale = min(initialCanvasWidth / ((minCanvasWidth + maxCanvasWidth) / 2),
                    initialCanvasHeight / ((minCanvasHeight + maxCanvasHeight) / 2));

  // Updates the character position
  characterX = (canvas.width / 2) + characterXScale * canvasScale;
  characterY = (canvas.height / 2) + characterYScale * canvasScale;

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
  character = new Character(characterX, characterY);

  // Creates the mouse for interaction
  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  World.add(world, mouse);
}

// Pressing the mouse down
function mousePressed() {
  mouseDown = true;
}

// Releases the mouse
function mouseReleased() {
  mouseDown = false;
  // Removes the mouse constraint
  if (holdingConstraint != null) {
    World.remove(world, holdingConstraint, true);
    holdingConstraint = null;
  }
}

// Mouse Scrolling
function mouseWheel(event) {
  scrolling = true;
  scrollDelta = event.delta / abs(event.delta)
}

// Resizings
function windowResized() {
  // Assigns new values for width and height variables
  var newCanvasWidth = max(min(window.innerWidth, maxCanvasWidth), minCanvasWidth);
  var newCanvasHeight = max(min(window.innerHeight, maxCanvasHeight), minCanvasHeight);

  // Resizes characters
  resizeCanvas(newCanvasWidth, newCanvasHeight);
  // canvasScale = min(newCanvasWidth / ((minCanvasWidth + maxCanvasWidth) / 2),
  //                   newCanvasHeight / ((minCanvasHeight + maxCanvasHeight) / 2));
  canvasScale = min(newCanvasWidth / ((minCanvasWidth + maxCanvasWidth) / 2),
                    newCanvasHeight / ((minCanvasHeight + maxCanvasHeight) / 2));


  // Updates the character position
  characterX = (canvas.width / 2) + characterXScale * canvasScale;
  characterY = (canvas.height / 2) + characterYScale * canvasScale;

  // Updates the constraints
  character.clearBody();
  character = null;
  character = new Character(characterX, characterY);
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
  simulation();
}

// Runs the simulation
function simulation() {
  frameRate(60);
  if (debug == true) {
    push();
    stroke(0, 255, 0);
    strokeWeight(5);
    noFill();
    rect(0, 0, canvas.width, canvas.height);
    pop();
  }

  // Controls cycles
  cycle += cycleRate;
  character.move();
  character.display();
}
