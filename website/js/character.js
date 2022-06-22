// Character
class Character {
  constructor() {

    // Size variables
    this.x = 70;
    this.y = 120;

    // Creates the shapes
    this.partBody = new Shape(this.x + 380, this.y + 200, sprBody, true, false, 0);
    this.partBoob = new Shape(this.x + 385, this.y + 240, sprBoob, false, true, 1/1200, 0.15, 0.15);
    this.partThigh = new Shape(this.x + 370, this.y + 350, sprThigh, true, false, 0);
    this.partLeg = new Shape(this.x + 325, this.y + 490, sprLeg, false, false, 1/2400);
    this.partAnkel = new Shape(this.x + 385, this.y + 483, sprAnkel2, false, true, 1/800);
    this.partFoot1 = new Shape(this.x + 445, this.y + 430, sprFoot1, false, true, 1/2400, 0.05, 0.05);
    this.partFoot2 = new Shape(this.x + 445, this.y + 430, sprFoot2, false, true,1/4800, 0.05, 0.05);
    this.partRightUpperArm = new Shape(this.x + 405, this.y + 372, sprRightUpperArm, true, false, 0);
    this.partRightForearm = new Shape(this.x + 575, this.y + 290, sprRightForearm, false, true, 1/2400, 0.15,0.25);
    Body.setAngle(this.partRightForearm.body, this.partRightForearm.body.angle - .15);
    this.partLeftShoulder = new Shape(this.x + 250, this.y + 160, sprLeftShoulder, true, false, 1/2400);
    this.partLeftElbow = new Shape(this.x + 190, this.y + 50, sprLeftElbow, true, false, 0);
    this.partLeftForearm = new Shape(this.x + 235, this.y + 45, sprLeftForearm, false, false, 1/2400, 0.2, 0.1);
    this.partLeftWrist = new Shape(this.x + 370, this.y + 70, sprLeftWrist, false, true, 1/1200, 0.5, 0.1);
    this.partEyes = new Eyeballs(this.x + 200, this.y + 270);
    Body.setAngle(this.partLeftWrist.body, this.partLeftWrist.body.angle - .4);
    this.partFace = new AnimatedShape(this.x + 210, this.y + 280, sprFaceSpriteSheet, 8, 10, 300, false, false, 1/2400);
    Body.setAngle(this.partFace.body, this.partFace.body.angle + .03);
    this.partSmoke = new AnimatedShape(this.x + 60, this.y + 190, sprSmokeSpriteSheet, 14, 6, 300, false, false, 1/800);
    Body.setAngle(this.partSmoke.body, this.partSmoke.body.angle - .07);

    // Creates the constraints
    var bodyToBoob = Constraint.create({
       bodyA: this.partBody.body,
       render: {
         visible: true
       },
       pointA: {
           x: 24,
           y: -32
       },
       pointB: {
           x: 20,
           y: -60
       },
       bodyB: this.partBoob.body,
       length: 0,
       stiffness: .9,
       frictionAir: 0.5,
       render: {
           visible: false
       }
     });

     var bodyToFace = Constraint.create({
        bodyA: this.partBody.body,
        render: {
          visible: true
        },
        pointA: {
            x: -85,
            y: 10
        },
        pointB: {
            x: 75,
            y: -55
        },
        bodyB: this.partFace.body,
        length: 0,
        stiffness: .9,
        frictionAir: 0.5,
        render: {
            visible: false
        }
      });

      var faceToEyes = Constraint.create({
         bodyA: this.partFace.body,
         render: {
           visible: true
         },
         pointA: {
             x: 20,
             y: -40
         },
         pointB: {
             x: 0,
             y: 0
         },
         bodyB: this.partEyes.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.5,
         render: {
             visible: false
         }
       });

      var faceToSmoke = Constraint.create({
        bodyA: this.partFace.body,
        render: {
         visible: true
        },
        pointA: {
           x: -87,
           y: 80
        },
        pointB: {
           x: 90,
           y: 165
        },
        bodyB: this.partSmoke.body,
        length: 0,
        stiffness: .9,
        frictionAir: 0.5,
        render: {
           visible: false
        }
     });

     var thighToLeg = Constraint.create({
        bodyA: this.partThigh.body,
        render: {
          visible: true
        },
        pointA: {
            x: -110,
            y: 90
        },
        pointB: {
            x: -60,
            y: -50
        },
        bodyB: this.partLeg.body,
        length: 0,
        stiffness: .9,
        frictionAir: 0.9,
        render: {
            visible: false
        }
      });

     var bodyToThigh = Constraint.create({
         bodyA: this.partBody.body,
         render: {
           visible: true
         },
         pointA: {
             x: 100,
             y: 40
         },
         pointB: {
             x: 105,
             y: -98
         },
         bodyB: this.partThigh.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.9,
         render: {
             visible: false
         }
       });

     var thighToLeg = Constraint.create({
        bodyA: this.partThigh.body,
        render: {
          visible: true
        },
        pointA: {
            x: -110,
            y: 90
        },
        pointB: {
            x: -60,
            y: -50
        },
        bodyB: this.partLeg.body,
        length: 0,
        stiffness: .9,
        frictionAir: 0.9,
        render: {
            visible: false
        }
      });

     var legToAnkel = Constraint.create({
         bodyA: this.partLeg.body,
         render: {
           visible: true
         },
         pointA: {
             x: 55,
             y: 50
         },
         pointB: {
             x: -10,
             y: 60
         },
         bodyB: this.partAnkel.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.9,
         render: {
             visible: false
         }
       });

     var ankelToFoot1 = Constraint.create({
         bodyA: this.partAnkel.body,
         render: {
           visible: true
         },
         pointA: {
             x: 20,
             y: -30
         },
         pointB: {
             x: -50,
             y: 15
         },
         bodyB: this.partFoot1.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.9,
         render: {
             visible: false
         }
       });

     var ankelToFoot2 = Constraint.create({
         bodyA: this.partAnkel.body,
         render: {
           visible: true
         },
         pointA: {
             x: 20,
             y: -30
         },
         pointB: {
             x: -50,
             y: 15
         },
         bodyB: this.partFoot2.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.9,
         render: {
             visible: false
         }
       });

     var rightUpperArmToForearm = Constraint.create({
         bodyA: this.partRightUpperArm.body,
         render: {
           visible: true
         },
         pointA: {
             x: 80,
             y: 0
         },
         pointB: {
             x: -80,
             y: 105
         },
         bodyB: this.partRightForearm.body,
         length: 0,
         stiffness: .9,
         frictionAir: 0.9,
         render: {
             visible: false
         }
       });

       var leftElbowToForearm = Constraint.create({
           bodyA: this.partLeftElbow.body,
           render: {
             visible: true
           },
           pointA: {
               x: 0,
               y: -35
           },
           pointB: {
               x: -40,
               y: -30
           },
           bodyB: this.partLeftForearm.body,
           length: 0,
           stiffness: .9,
           frictionAir: 0.9,
           render: {
               visible: false
           }
         });

       var leftForearmToWrist = Constraint.create({
           bodyA: this.partLeftForearm.body,
           render: {
             visible: true
           },
           pointA: {
               x: 30,
               y: 30
           },
           pointB: {
               x: -105,
               y: 40
           },
           bodyB: this.partLeftWrist.body,
           length: 0,
           stiffness: .9,
           frictionAir: 0.9,
           render: {
               visible: false
           }
         });


     // Constraint list
     this.constraintList =[bodyToBoob,
                           bodyToFace,
                           thighToLeg,
                           legToAnkel,
                           ankelToFoot1,
                           ankelToFoot2,
                           rightUpperArmToForearm,
                           leftElbowToForearm,
                           leftForearmToWrist,
                           faceToSmoke,
                           bodyToThigh,
                           faceToEyes];

     // Body List
     this.bodyList =[this.partLeftShoulder,
                     this.partLeftElbow,
                     this.partLeftForearm,
                     this.partRightUpperArm,
                     this.partBody,
                     this.partThigh,
                     this.partRightForearm,
                     this.partLeg,
                     this.partFoot1,
                     this.partFoot2,
                     this.partAnkel,
                     this.partBoob,
                     this.partLeftWrist,
                     this.partEyes,
                     this.partSmoke,
                     this.partFace];

     // Adds bodies to the world
     for (var i = 0; i < this.bodyList.length; i++) {
       World.add(world, this.bodyList[i].body);
     }

     // Adds constraints to the world
     for (var i = 0; i < this.constraintList.length; i++) {
       World.add(world,  this.constraintList[i]);
     }
  }

  // Updates physics for every body part
  move() {
    for (var i = 0; i < this.bodyList.length; i++) {
      this.bodyList[i].move();
    }
  }

  // Draws the character
  display() {

    // Draws individual body parts
    for (var i = 0; i < this.bodyList.length; i++) {
      this.bodyList[i].display();
    }

    // Draws constraints for debugging
    if (debug == true) {
      for (var i = 0; i < this.constraintList.length; i++) {
        push();
        stroke(0, 255, 0);
        strokeWeight(4);
        line(this.constraintList[i].bodyA.position.x + this.constraintList[i].pointA.x, this.constraintList[i].bodyA.position.y + this.constraintList[i].pointA.y,
             this.constraintList[i].bodyB.position.x + this.constraintList[i].pointB.x, this.constraintList[i].bodyB.position.y + this.constraintList[i].pointB.y);
        pop();
      }
    }
  }
}
