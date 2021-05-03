$(document).ready(()=>{
  if(mobile){
    $('#oneLine').text("A visualization of why Rousseau was critical of parties: they erase uniqueness and limit self-expression. Drag your finger across the canvas to add people. Starting off uniquely colored, they soon join a party, loosing their individuality.")
  }
}
)

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

var spacingOne = (render.canvas.height < render.canvas.width) ? render.canvas.width : render.canvas.height
let spacing = spacingOne * 0.115
var radius = 50;
if(render.canvas.width < 1000){
  radius = 40
}
if(render.canvas.width < 600){
  spacing = spacingOne * 0.15
  radius = 20
}
if(render.canvas.width < 400){
  radius = 10
}
console.log(render.canvas.width)

var partyOne = new Party("#0496FF", render.canvas.width/2 - spacing, render.canvas.height/2 - spacing, radius)
var partyTwo = new Party("#E0A423", render.canvas.width/2 + spacing, render.canvas.height/2 - spacing, radius)
var partyThree = new Party("#D81159", render.canvas.width/2 - spacing, render.canvas.height/2 + spacing, radius)
var partyFour = new Party("#6BC35D", render.canvas.width/2 + spacing, render.canvas.height/2 + spacing, radius)

// var partyOne = new Party("#0496FF", render.canvas.width / 3, render.canvas.height / 4, 50)
// var partyTwo = new Party("#E0A423", render.canvas.width / 3 * 2, render.canvas.height / 4, 50)
// var partyThree = new Party("#D81159", render.canvas.width / 3, render.canvas.height / 4 * 3, 50)
// var partyFour = new Party("#6BC35D", render.canvas.width / 3 * 2, render.canvas.height / 4 * 3, 50)


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
// Check if mobile
// var mobile = false
// if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//   mobile = true;
//  }
window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
var mobile = window.mobileAndTabletCheck()
let matterSpace = document.getElementById("matter")
let $matterSpace = $('#matter')
if(!mobile){
  console.log("hi")
var drag = false;
matterSpace.addEventListener('mousedown', () => drag = true);
matterSpace.addEventListener('mousedown', () => drag = true);
matterSpace.addEventListener('mouseup', () => drag = false);
matterSpace.addEventListener('mousemove', e => {
  if (drag) {
    makePeople()
  }
});
}else{
  $matterSpace.on('touchmove', (e) => {

      makePeople()


    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var x = touch.pageX;
      var y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
      var x = e.clientX;
      var y = e.clientY;
  }
  var body = document.body,
    html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
  mouseCircle.position.x = x
  mouseCircle.position.y = y - (height * 0.2)
  
});

}

function makePeople(){
  var person = Bodies.polygon(
    mouseCircle.position.x,
    mouseCircle.position.y,
    Common.random(1, 5),
    Common.random() > 0.9 ? (mobile ? Common.random(5, 15) : Common.random(15, 25) ): (mobile ? Common.random(3, 11) : Common.random(5, 10) ), {
      render: {
        fillStyle: '#' + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16)) + (Math.floor((Math.random() * 222) + 33).toString(16))
      }
    }
  );
  person.bind = Math.floor(Math.random() * 4 + 1)
  people.push(person)
  World.add(world, person);
}


// add mouse control
var mouse = Mouse.create(render.canvas);
// if(mobile){
//   this.mouseConstraint.mouse.element.removeEventListener('touchmove', this.mouseConstraint.mouse.mousemove);
//   this.mouseConstraint.mouse.element.removeEventListener('touchstart', this.mouseConstraint.mouse.mousedown);
//   this.mouseConstraint.mouse.element.removeEventListener('touchend', this.mouseConstraint.mouse.mouseup);
// }

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

    if (Math.abs(closestDistance) < closest.circleRadius + (mobile? 50: 100)) {
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