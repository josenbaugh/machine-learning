var perceptron;
var points = [];
var trainingIndex = 0;
var m, b, p1, p2;;
var lr = .005;

function setup() {
  createCanvas(800,800, 0);

  m = random(-1, 1);
  b = random(-1, 1);

  p1 = new Point();
  p1.setPos(-1, f(-1));
  p2 = new Point();
  p2.setPos(1, f(1));

  perceptron = new Perceptron(3, lr);
  console.log(perceptron);

  for (var i = 0; i <= 100; i++) {
    points[i] = new Point(m, b);
  }
}

function draw() {
  background(255);

  //draw known line in blue
  stroke(0,0,255);
  line(p1.pixelX(), p1.pixelY(), p2.pixelX(), p2.pixelY());

  //draw perceptron's guess line
  p3 = new Point();
  p3.setPos(-1, perceptron.guessY(-1));
  p4 = new Point();
  p4.setPos(1, perceptron.guessY(1));
  stroke(0);
  line(p3.pixelX(), p3.pixelY(), p4.pixelX(), p4.pixelY());

  allcorrect = 1;
  for (var i = 0; i < points.length; i++) {
    pt = points[i];
    pt.show();

    guess = perceptron.guess([pt.x, pt.y, pt.bias]);

    if (guess === pt.tag) {
      fill(0, 255, 0);
    }
    else {
      fill(255, 0, 0);
      allcorrect = 0;
    }

    noStroke();
    ellipse(pt.pixelX(), pt.pixelY(), 6, 6);

    //perceptron.train([pt.x, pt.y, pt.bias], pt.tag)
  }


  if (!allcorrect) {
    training = points[trainingIndex];
    perceptron.train([training.x, training.y, training.bias], training.tag);
    trainingIndex = trainingIndex == points.length-1 ? 0 : trainingIndex +1;
  }
  else {
    noLoop();
    console.log(perceptron);
  }
  
}

function f(x) {
  // y = mx + b
  return m * x + b;
}