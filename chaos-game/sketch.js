// let ax, ay;
// let bx, by;
// let cx, cy;
let xs = new Array();
let ys = new Array();
let x, y;

let pointsslider, distanceslider, button, button1;
let points, distance;
let isDrawing;
let rule = 0;

let previousPoints = new Array();
let previous = new Array();

function startstop() {
  isDrawing = !isDrawing;
}

function calcPoints()
{
  var cx = width/2;  //center x
  var cy = height/2;  //center y
  var n = points;   //number of sides
  var r = (width-20) /2;  //radius. Dist from center to a vertex
  var ang;
  var startAng;
  var centerAng = 2*Math.PI / n;

  //calculate the default start angle
  if(isOdd(n))
    startAng = Math.PI/2;  //12 oclock
  else
    startAng = Math.PI/2 - centerAng/2;

  //create a vertex array
  var vertex = new Array();
  for(var i=0 ; i<n ; i++) {
    ang = startAng + (i*centerAng);
    vx = Math.round(cx + r*Math.cos(ang));
    vy = Math.round(cy - r*Math.sin(ang));
    xs[i] = vx;
    ys[i] = vy;
  }
}

function toRadians(degs){return Math.PI*degs/180;}
function isOdd(n) {return (n%2 == 1);}

function resetRandom() {
  background(0);

  //draw outer points
  for(let i = 0; i < pointsslider.value(); i++) {
    xs[i] = random(width);
    ys[i] = random(height);
    stroke(random(255), random(255), random(255));
    strokeWeight(5);
    point(xs[i], ys[i]);
  }

  //draw first point
  x = random(width);
  y = random(height);

  stroke(255);
  strokeWeight(1);
  point(x, y);

  points = pointsslider.value();
  distance = distanceslider.value();
}

function reset() {
  background(0);
  rule=0;

  //draw outer points
  points = pointsslider.value()

  calcPoints();

  if(points == 3)
    distance = .50;
  else if(points == 4) {
    distance = .52;
    if(previousPoints[0] == 4) rule=1;
    if(previousPoints[0] & previousPoints[1]) rule=2;
  }
  else if(points == 5) {
    distance = .62;
    if(previousPoints[0] == 5) rule=1;
  }
  else if(points == 6)
    distance = .67;
  else if(points == 7)
    distance = .69;
  else if(points == 8)
    distance = .71;
  else if(points == 9)
    distance = .74;
  else if(points == 10)
    distance = .765;
  else if(points == 11)
    distance = .78;
  else if(points == 12)
    distance = .79;

  for(let i = 0; i < points; i++) {
    stroke(random(255), random(255), random(255));
    strokeWeight(5);
    point(xs[i], ys[i]);
  }

  //draw first point
  x = random(width);
  y = random(height);

  stroke(255);
  strokeWeight(1);
  point(x, y);

  previousPoints.unshift(points);
}

function normalRules() {
  for(let i = 0; i < 100; i++) {
    rand = int(random(points));

    x = lerp(x, xs[rand], distance);
    y = lerp(y, ys[rand], distance);

    stroke(255);
    strokeWeight(1);
    point(x, y);
  }
}

function rule1() {
  for(let i = 0; i < 100; i++) {
    rand = int(random(points));
    if(rand != previous[0]) {
      x = lerp(x, xs[rand], .5);
      y = lerp(y, ys[rand], .5);

      stroke(255);
      strokeWeight(1);
      point(x, y, 1);
    }
    previous.unshift(rand);
  }
}

function rule2() {
  for(let i = 0; i < 100; i++) {
    rand = int(random(points));

    anticlockwiseone = previous - 1;
    if(anticlockwiseone == -1) anticlockwiseone = points;

    if(rand != anticlockwiseone) {
      x = lerp(x, xs[rand], .5);
      y = lerp(y, ys[rand], .5);

      stroke(255);
      strokeWeight(1);
      point(x, y, 1);
    }
    previous.unshift(rand);
  }
}

function setup() {
  createCanvas(800, 800);
  background(0);

  button2 = createButton('Start/Stop');
  button2.mousePressed(startstop);

  pointsslider = createSlider(3, 12, 3);
  distanceslider = createSlider(0, 1, .5, .01);
  button = createButton('Reset');
  button.mousePressed(reset);
  button1 = createButton('Reset with Random positions');
  button1.mousePressed(resetRandom);

  points = pointsslider.value();
  distance = distanceslider.value();
}


function draw() {
  console.log(rule);
  if(isDrawing) {
    if(rule == 1) {
      rule1();
    }
    else if(rule == 2) {
      rule2();
    }
    else {
      normalRules();
    }
  }
}
