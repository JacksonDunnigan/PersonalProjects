// Parent class for shapes
class Shape {
  constructor(xOffset, yOffset, sprite, isStatic, mouseCollide, angleScale, minAngleRange, maxAngleRange) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    // this.initialX = this.x;
    // this.initialY = this.y;
    // this.ratio = canvas.width / initalCanvasWidth;
    // this.width

    // console.log(this.ratio);

    this.sprite = sprite;
    this.w = this.sprite.width;
    this.h = this.sprite.height;
    this.static = isStatic || false;
    this.angleScale = angleScale || 0;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {isStatic: isStatic});
    this.mouseCollide = mouseCollide;
    this.pickupSound = null;
    this.bounds = Bounds.create(this.body.vertices);
    this.colliding;
    this.initialAngle = this.body.angle;
    this.minAngleRange = minAngleRange || .3;
    this.maxAngleRange = maxAngleRange || .3;
    this.tempVertices = null;

    this.pushScale = 0.05;
    this.force = 0;
    this.initialVertices = this.body.vertices;
    this.initialX = this.x;
    this.initialY = this.y;

    // Collion filtering
    if (this.mouseCollide == true) {
      this.body.collisionFilter = {
        category: objectCategory,
        mask: mouseCategory
      };
    } else {
      this.body.collisionFilter = {
        category: objectCategory,
        mask: objectCategory
      };
    }
  }

  // Moving logic
  move() {
    // this.x = character.x + this.xOffset;
    // this.y = character.y + this.yOffset;
    // console.log(this.x)
    // this.body.position.x = this.x;
    // this.body.position.y = this.y;
    this.force = 0;

    // Creates a constraint when holding a joint
    if (holdingConstraint == null
      && this.mouseCollide == true
      && mouseDown == true
      && Bounds.contains(this.bounds, mouse.position)) {
      holdingConstraint = Constraint.create({
         pointB: mouse.position,
         bodyA: this.body,
         stiffness: 0.001
      });
      World.add(world, holdingConstraint);
    }

    // Moves the body parts when not moving
    if (holdingConstraint == null || (holdingConstraint != null && holdingConstraint.bodyA != this.body)) {
       this.force = sin(cycle) * this.angleScale;
       Body.setAngularVelocity(this.body, this.force);
    }

    // Limits rotation
    if (this.body.angle <= this.initialAngle - this.minAngleRange) {
      this.body.angle = this.initialAngle - this.minAngleRange;
    } else if (this.body.angle > this.initialAngle + this.maxAngleRange) {
      this.body.angle = this.initialAngle + this.maxAngleRange;
    }

    // // Updates the position of the shape
    // this.ratio = canvas.width / initalCanvasWidth;
    // console.log(this.ratio);
    // this.x = this.body.position.x * this.ratio;
    // this.y = this.body.position.y;
    // this.body.position.x = this.x;
    // this.body.position.y = this.y;

  }

  // Displays body parts
  display() {
    var pos = this.body.position;
    var angle = this.body.angle;


    // Draws background shapes for debugging
    if (debug == true) {
      push();
      translate(pos.x, pos.y);
      noFill();
      strokeWeight(1);
      stroke(color(0, 255, 0));
      rectMode(CENTER);
      quad(this.body.vertices[1].x - pos.x, this.body.vertices[1].y - pos.y,
           this.body.vertices[2].x - pos.x, this.body.vertices[2].y - pos.y,
           this.body.vertices[3].x - pos.x, this.body.vertices[3].y - pos.y,
           this.body.vertices[0].x - pos.x, this.body.vertices[0].y - pos.y);
      pop();
    }

    // Draws the individual body parts
    push();

    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.sprite, 0, 0, this.sprite.width, this.sprite.height);
    pop();
  }
}

// Face shape
class FaceShape {
  constructor(xOffset, yOffset, spriteSheet, frameAmount, frameSpeed, delay, isStatic, mouseCollide, angleScale) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    this.spriteSheet = spriteSheet;
    this.frameAmount = frameAmount;
    this.w = this.spriteSheet.width / this.frameAmount;
    this.h = this.spriteSheet.height;
    this.delay = -delay
    this.blinkLength = -15;
    this.timer = this.delay;
    this.frameSpeed = frameSpeed;
    this.leftFrameIndex = 0;
    this.rightFrameIndex = 0;
    this.mouseCollide = mouseCollide;
    this.static = isStatic || false;
    this.angleScale = angleScale || 0;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {isStatic: isStatic});
    this.bounds = Bounds.create(this.body.vertices);
    this.forceBlink = false;

    // Collion filtering
    if (this.mouseCollide == true) {
      // console.log(1);
      this.body.collisionFilter = {
        category: objectCategory,
        mask: mouseCategory
      };
    } else {
      this.body.collisionFilter = {
        category: objectCategory,
        mask: objectCategory
      };
    }
  }

  // Moving logic
  move() {
    // Updates the position of the shape
    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;
    if (holdingConstraint == null
    && this.mouseCollide == true
    && mouseDown == true
    && this.forceBlink == false) {

      this.timer = this.blinkLength;
      this.forceBlink = true

      // Left eye collision
      if (mouseX >= character.partEyes.body.position.x - 50 - character.partEyes.r / 2
      && mouseX <= character.partEyes.body.position.x - 50 + character.partEyes.r / 2
      && mouseY >= character.partEyes.body.position.y - 30 - character.partEyes.r / 2
      && mouseY <= character.partEyes.body.position.y - 30 + character.partEyes.r / 2) {
        this.leftFrameIndex = 3;
      }

      // Right eye collision
      if (mouseX >= character.partEyes.body.position.x + 40 - character.partEyes.r / 2
      && mouseX <= character.partEyes.body.position.x + 40 + character.partEyes.r / 2
      && mouseY >= character.partEyes.body.position.y - 30 - character.partEyes.r / 2
      && mouseY <= character.partEyes.body.position.y - 30 + character.partEyes.r / 2) {
        this.rightFrameIndex = 3;
      }
    }

    // Stops forced blinking
    if (mouseDown == false && this.forceBlink == true && this.timer > 0) {
      this.forceBlink = false;
      this.leftFrameIndex = 0;
      this.rightFrameIndex = 0;

      this.timer = this.delay;
    }

    // Applies force to the body
    var force = sin(cycle) * this.angleScale;
    Body.setAngularVelocity(this.body, force)
  }

  // Displays the shape
  display() {
    var pos = this.body.position;
    var angle = this.body.angle;

    // Switches the current frame
    this.timer += 1;
    if (this.timer % this.frameSpeed == 0 && this.forceBlink == false && this.timer > 0) {
      this.leftFrameIndex += 1;
      this.rightFrameIndex += 1;

      if (this.leftFrameIndex > this.frameAmount - 1) {
        this.timer += this.delay;
        this.leftFrameIndex = 0;
      }
      if (this.rightFrameIndex > this.frameAmount - 1) {
        this.timer += this.delay;
        this.rightFrameIndex = 0;

      }
    }
    // Draws background shapes for debugging
    if (debug == true) {
      push();
      translate(pos.x, pos.y);
      noFill();
      strokeWeight(1);
      stroke(color(0, 255, 0));
      rectMode(CENTER);
      quad(this.body.vertices[1].x - pos.x, this.body.vertices[1].y - pos.y,
           this.body.vertices[2].x - pos.x, this.body.vertices[2].y - pos.y,
           this.body.vertices[3].x - pos.x, this.body.vertices[3].y - pos.y,
           this.body.vertices[0].x - pos.x, this.body.vertices[0].y - pos.y);
      pop();
    }

    // Draws the current frame
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    // Left eye
    image(this.spriteSheet,
          - this.w / 4,
          0,
          this.w / 2,
          this.h,
          this.leftFrameIndex * this.w,
          0,
          this.w / 2,
          this.h);

    // Right eye
    image(this.spriteSheet,
          this.w / 4 - .75,
          0,
          this.w / 2,
          this.h,
          this.rightFrameIndex * this.w + this.w / 2,
          0,
          this.w / 2,
          this.h);

    pop();
  }
}


// Smoke shape
class SmokeShape {
  constructor(xOffset, yOffset, spriteSheet, frameAmount, frameSpeed, delay, isStatic, mouseCollide, angleScale) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    this.spriteSheet = spriteSheet;
    this.frameAmount = frameAmount;
    this.w = this.spriteSheet.width / this.frameAmount;
    this.h = this.spriteSheet.height;
    this.delay = -delay
    this.blinkLength = -15;
    this.timer = this.delay;
    this.frameSpeed = frameSpeed;
    this.frameIndex = 0;
    this.mouseCollide = mouseCollide;
    this.static = isStatic || false;
    this.angleScale = angleScale || 0;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {isStatic: isStatic});
    this.bounds = Bounds.create(this.body.vertices);

    // Collion filtering
    if (this.mouseCollide == true) {
      // console.log(1);
      this.body.collisionFilter = {
        category: objectCategory,
        mask: mouseCategory
      };
    } else {
      this.body.collisionFilter = {
        category: objectCategory,
        mask: objectCategory
      };
    }
  }

  // Moving logic
  move() {
    // Updates the position of the shape
    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    // Applies force to the body
    var force = sin(cycle) * this.angleScale;
    Body.setAngularVelocity(this.body, force)
  }

  // Displays the shape
  display() {
    var pos = this.body.position;
    var angle = this.body.angle;

    // Switches the current frame
    this.timer += 1;
    if (this.timer % this.frameSpeed == 0 && this.timer > 0) {
      this.frameIndex += 1;
      if (this.frameIndex > this.frameAmount - 1) {
        this.timer = this.delay + this.timer;
        this.frameIndex = 0;
      }
    }
    // Draws background shapes for debugging
    if (debug == true) {
      push();
      translate(pos.x, pos.y);
      noFill();
      strokeWeight(1);
      stroke(color(0, 255, 0));
      rectMode(CENTER);
      quad(this.body.vertices[1].x - pos.x, this.body.vertices[1].y - pos.y,
           this.body.vertices[2].x - pos.x, this.body.vertices[2].y - pos.y,
           this.body.vertices[3].x - pos.x, this.body.vertices[3].y - pos.y,
           this.body.vertices[0].x - pos.x, this.body.vertices[0].y - pos.y);
      pop();
    }

    // Draws the current frame
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.spriteSheet,
          0,
          0,
          this.w,
          this.h,
          this.frameIndex * this.w,
          0,
          this.w,
          this.h);
    pop();
  }
}

// Eyeballs
class Eyeballs {
  constructor(xOffset, yOffset) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;

    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    this.r = 50;
    this.angleScale = 0;
    this.body = Bodies.circle(this.x, this.y, this.r);

    // Collion filtering
    this.body.collisionFilter = {
      category: objectCategory,
      mask: objectCategory
    };
  }

  // Moving logic
  move() {
    // Updates the position of the shape
    this.x = characterX + this.xOffset;
    this.y = characterY + this.yOffset;

    // Applies force to the body
    var force = sin(cycle) * this.angleScale;
    Body.setAngularVelocity(this.body, force)
  }

  // Displays the eyes
  display() {
    var pos = this.body.position;
    var angle = this.body.angle;

    // Draws background shapes for debugging
    if (debug == true) {
      push();
      translate(pos.x, pos.y);
      noFill();
      strokeWeight(1);
      stroke(color(0, 255, 0));
      rotate(angle -.3);
      ellipse(-50, -30, this.r, this.r * .6);
      rotate(.3);
      ellipse(40, -30, this.r, this.r * .6);
      noFill();
      strokeWeight(1);
      rectMode(CORNERS);
      pop();
    }

    // Draws the eyes
    push();
    fill(255)
    translate(pos.x, pos.y);
    rotate(angle -.3);
    ellipse(-50, -30, this.r, this.r * .6);
    rotate(.3);
    ellipse(40, -30, this.r, this.r * .6);
    pop();
    push();
    var mouseLocationX1 = map(mouseX, 0, width, this.x - 4, this.x + 7);
    var mouseLocationX2 = map(mouseX, 0, width, this.x - 5, this.x + 10);

    var mouseLocationY1 = map(mouseY, 0, height, this.y - 4, this.y + 4);
    var mouseLocationY2 = map(mouseY, 0, height, this.y - 2 , this.y + 7);

    fill(color(35, 31, 32));
    ellipse(mouseLocationX1 + 84, mouseLocationY1 - 75, 5, 6);
    ellipse(mouseLocationX2 - 13, mouseLocationY2 - 63, 5, 6);
    pop();

  }
}
