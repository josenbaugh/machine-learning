let nn;

let training_data = [{
  inputs: [0, 0],
  outputs: [0]
},
{
  inputs: [0, 1],
  outputs: [1]
},
{
  inputs: [1, 0],
  outputs: [1]
},
{
  inputs: [1, 1],
  outputs: [0]
}
];

function setup() {
  createCanvas(400, 400);

  nn = new NeuralNetwork([2, 8, 6, 1], .01, "sigmoid");

}

function draw() {
  background(0);
  noStroke();

  for (let i = 0; i < 100; i ++) {
    let data = random(training_data);
    nn.train(data.inputs, data.outputs);
  }

  let res = 10;
  let cols = width / res;
  let rows = height / res;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      x1 = i / cols;
      x2 = j / rows;
      let inputs = [x1, x2];

      let output = nn.query(inputs);

      fill(map(output, 0, 1, 0, 255));
      rect(i*res, j*res, res, res);
    }
  }

}