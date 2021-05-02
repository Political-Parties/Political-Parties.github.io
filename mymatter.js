Matter.use(
  'matter-attractors'
);

var Engine = Matter.Engine,
  Events = Matter.Events,
  Runner = Matter.Runner,
  Render = Matter.Render,
  World = Matter.World,
  Body = Matter.Body,
  Mouse = Matter.Mouse,
  Common = Matter.Common,
  Bodies = Matter.Bodies;

// create engine
var engine = Engine.create();

// create renderer
var render = Render.create({
  element: document.getElementById("matter"),
  engine: engine,
  options: {
    width: Math.min(document.documentElement.clientWidth),
    height: Math.min(document.documentElement.clientHeight * 0.8),
    wireframes: false
  }
});

Math.dist = function (x1, y1, x2, y2) {
  var xs = x2 - x1,
    ys = y2 - y1;

  xs *= xs;
  ys *= ys;

  return Math.sqrt(xs + ys);
}

// create runner
var runner = Runner.create();

Runner.run(runner, engine);
Render.run(render);

// create demo scene
var world = engine.world;
world.gravity.scale = 0;

// create a body with an attractor

var parties = []

class Party {
  constructor(c, x, y, r) {
    this.color = c,
      this.x = x,
      this.y = y,
      this.radius = r
  }
}

var partyOne = new Party("#0496FF", render.canvas.width / 3, render.canvas.height / 3, 50)
var partyTwo = new Party("#E0A423", render.canvas.width / 3 * 2, render.canvas.height / 3, 50)
var partyThree = new Party("#D81159", render.canvas.width / 3, render.canvas.height / 3 * 2, 50)
var partyFour = new Party("#6BC35D", render.canvas.width / 3 * 2, render.canvas.height / 3 * 2, 50)


parties.push(partyOne, partyTwo, partyThree, partyFour)
var partyBodies = []
for (let i = 0; i < parties.length; i++) {
  let party = parties[i]
  var attractiveBody = Bodies.circle(
    party.x,
    party.y,
    party.radius * 2, {
      isStatic: true,
      render: {
        fillStyle: party.color
      },

      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            if (bodyA.bind == bodyB.bind) {
              return {
                x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                y: (bodyA.position.y - bodyB.position.y) * 1e-6,
              }
            } else {
              return {
                x: 0,
                y: 0,
              }
            }


          }
        ]
      }
    });
  attractiveBody.bind = i + 1
  console.log(attractiveBody.bind)
  partyBodies.push(attractiveBody)
  World.add(world, attractiveBody);
}
let mouseCircle = Bodies.circle(
  render.canvas.width / 2,
  render.canvas.height / 2,
  20, {
    isStatic: true,
    render: {
      fillStyle: "white"
    }
  });

World.add(world, mouseCircle);

var people = [];
let drag = false;
let matterSpace = document.getElementById("matter")
matterSpace.addEventListener('mousedown', () => drag = true);

matterSpace.addEventListener('mouseup', () => drag = false);

matterSpace.addEventListener('mousemove', e => {
  if (drag) {


    var person = Bodies.polygon(
      mouseCircle.position.x,
      mouseCircle.position.y,
      Common.random(1, 5),
      Common.random() > 0.9 ? Common.random(15, 25) : Common.random(5, 10), {
        render: {
          fillStyle: '#' + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16))
        }
      }
    );
    person.bind = Math.floor(Math.random() * 4 + 1)
    people.push(person)
    World.add(world, person);
  }
});


// add mouse control
var mouse = Mouse.create(render.canvas);

Events.on(engine, 'afterUpdate', function () {
  if (!mouse.position.x) {
    return;
  }

  // smoothly move the attractor body towards the mouse
  Body.translate(mouseCircle, {
    x: (mouse.position.x - mouseCircle.position.x) * 0.25,
    y: (mouse.position.y - mouseCircle.position.y) * 0.25
  });
});
Events.on(engine, "tick", function () {
  for (let person of people) {
    var closest = partyBodies[0];
    var closestDistance = Math.dist(person.position.x,
      person.position.y,
      closest.position.x,
      closest.position.y)
    for (let party of partyBodies) {
      if (Math.dist(person.position.x,
          person.position.y,
          party.position.x,
          party.position.y) < closestDistance) {
        closestDistance = Math.dist(person.position.x,
          person.position.y,
          party.position.x,
          party.position.y)
        closest = party
      }
    }
    if (Math.abs(closestDistance) < closest.circleRadius + 100) {
      person.render.fillStyle = closest.render.fillStyle

    }
  }

  if (drag) {
    var person = Bodies.polygon(
      mouseCircle.position.x,
      mouseCircle.position.y,
      Common.random(1, 5),
      Common.random() > 0.9 ? Common.random(15, 25) : Common.random(5, 10), {
        render: {
          fillStyle: '#' + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16))
        }
      }
    );
    person.bind = Math.floor(Math.random() * 4 + 1)
    people.push(person)
    World.add(world, person);
  }
});

window.addEventListener('resize', function (event) {
  render.canvas.width = document.documentElement.clientWidth;
  render.canvas.height = document.documentElement.clientHeight * 0.8;
});