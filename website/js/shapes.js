// Parent class for shapes
class Shape {
  constructor(x, y, sprite, isStatic, mouseCollide, angleScale, minAngleRange, maxAngleRange) {
    this.x = x;
    this.y = y;
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
    this.force = 0;

    // Creates a constraint when holding a joint
    if (holdingConstraint == null && this.mouseCollide == true && mouseDown == true && Bounds.contains(this.bounds, mouse.position)) {
      // let forces = //[-this.angleScale * 5 ,this.angleScale * 5];

      // mouseDown = false;

      // var forceDirection = -((mouseY - this.y) / abs(mouseY - this.y));
      // forceDirection = -(forceDirection / abs(forceDirection))
      // console.log(5);
      // this.force = this.pushScale; //* forceDirection;//random(-0.02, 0.02);
      // this.pushScale *=-1;
      holdingConstraint = Constraint.create({
         pointB: mouse.position,
         bodyA: this.body,
         stiffness: 0.002,
      });
      World.add(world, holdingConstraint);
    }

    // Moves the body parst when not moving
    if (holdingConstraint == null || (holdingConstraint != null && holdingConstraint.bodyA != this.body)) {

      // When you aernt holding a joint
      // if (this.force == 0) {
       this.force = sin(cycle) * this.angleScale;

      // When a joint is being held
      // } else {
      //   console.log(1)
      //   if (this.force < sin(cycle) * this.angleScale) {
      //    this.force -= this.angleScale;
      //   } else {
      //    this.force += this.angleScale
      //   }
      // }

      // Sets angular velocity for rotation
      Body.setAngularVelocity(this.body, this.force);
    }

    // Limits rotation
    // if (holdingConstraint != null && holdingConstraint.bodyA == this.body) {
    //
    if (this.body.angle <= this.initialAngle - this.minAngleRange) {
      this.body.angle = this.initialAngle - this.minAngleRange;

      // Stops vertices from rotating
      // if (this.tempVertices == null) {
      //   this.tempVertices = this.body.vertices;
      //   console.log(this.body.vertices)
      // }

      //
      // this.body.vertices[1].x - pos.x, this.body.vertices[1].y - pos.y,
      //      this.body.vertices[2].x - pos.x, this.body.vertices[2].y - pos.y,
      //      this.body.vertices[3].x - pos.x, this.body.vertices[3].y - pos.y,
      //      this.body.vertices[0].x - pos.x, this.body.vertices[0].y - pos.y
      // this.body.x = this.initialX;
      // this.body.y = this.initialY;
    } else if (this.body.angle > this.initialAngle + this.maxAngleRange) {
      this.body.angle = this.initialAngle + this.maxAngleRange;
      // console.log(5);
      // this.body.x = this.initialX;
      // this.body.y = this.initialY;
    }

    // }
        // World.remove(world, holdingConstraint);
        // holdingConstraint = null;
      // else if (this.body.angle > this.initialAngle + this.angleRange) {
      //   // this.body.angle = this.initialAngle + this.angleRange;
      //   // console.log(2);
      //
      // }
    // }
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
      // if (holdingConstraint!= null && holdingConstraint.bodyA == this.body) {
      //   console.log(this.body.angle);
      //
      // }
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
    image(this.sprite,0,0);
    pop();
  }
}



// Animated shapes
class AnimatedShape {
  constructor(x, y, spriteSheet, frameAmount, frameSpeed, delay, isStatic, mouseCollide, angleScale) {

    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    this.frameAmount = frameAmount;
    this.w = this.spriteSheet.width / this.frameAmount;
    this.h = this.spriteSheet.height;
    this.delay = -delay
    this.timer = this.delay;
    this.frameSpeed = frameSpeed;
    this.frameIndex = 0;
    this.static = isStatic || false;
    this.angleScale = angleScale || 0;
    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, {isStatic: isStatic});

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
      if (this.frameIndex > this.frameAmount-1) {
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
      ellipse(-50, -30, this.r, this.r*.6);
      rotate(.3);
      ellipse(40, -30, this.r, this.r*.6);
      pop();
    }

    // Draws the eyes
    push();
    fill(255)
    translate(pos.x, pos.y);
    rotate(angle -.3);
    ellipse(-50, -30, this.r, this.r*.6);
    rotate(.3);
    ellipse(40, -30, this.r, this.r*.6);
    // pop();
    // push();
    var mouseLocationX1 = map(mouseX, width/8, width - width/8, pos.x - 3, pos.x + 3);
    var mouseLocationX2 = map(mouseX, width/8, width - width/8, pos.x - 5, pos.x + 5);

    var mouseLocationY1 = map(mouseY, height/8, height - height/8, pos.y - 3, pos.y + 3);
    var mouseLocationY2 = map(mouseY, height/8, height - height/8, pos.y - 2 , pos.y + 5);

    // console.log(mouseLocationX);
    fill(color(35,31,32));
    ellipse(mouseLocationX1-267, mouseLocationY1-380, 5, 6);
    ellipse(mouseLocationX2-360, mouseLocationY2-368, 5, 6);
    pop();

  }
}
