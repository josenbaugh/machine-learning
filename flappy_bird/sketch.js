let population = [];
let populationSize = 500;
let allDead = false;
let pipes = [];
let counter = 0;
let generation = 1;
let genscore = 0;
let hiscore = 0;

let speedSlider;
let speedSpan;


function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvascontainer');

  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');

  for(let i = 0; i < populationSize; i++) {
    population.push(new Bird());
  }

}

function draw() {
  background(0);

  textSize(16);
  stroke(255);
  fill(255);
  text('Generation: ' + generation, 5, 20);
  text('Last Generation Score: ' + genscore, 5, 450);
  text('High Score: ' + hiscore, 5, 470);

  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);
  
  for (let n = 0; n < cycles; n++) {

    //allDead is true until proven otherwise
    allDead = true;

    // Add a new pipe every so often
    if (counter % 75 == 0 || pipes.length == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    //show all pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for(let i = 0; i < populationSize; i++) {
      //only check if bird isn't dead
      if (population[i].dead == false) {
        allDead = false; //if we make it in here there are birds that aren't dead
        
        //did it hit a pipe?
        for (let j = 0; j < pipes.length; j++) {
            if (pipes[j].hits(population[i])) {
              population[i].dead = true;
            }
        }

        //did it hit the floor?
        if(population[i].y >= height) {
          population[i].dead = true;
        }

        //if we didn't die
        if(!population[i].dead) {
          population[i].score += 1;
          population[i].think(pipes);
          population[i].update();
        }

      }
    }
  }

  //if all birds are dead start next generation
  if (allDead) {
    nextGeneration();
  }

  //drawing stuff
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }
  for(let i = 0; i < populationSize; i++) {
    if(!population[i].dead) {
      population[i].show();
    }
  }
  
}

function nextGeneration() {
  let champ = getPopulationChamps();

  populateNewGeneration(champ);

  generation++;
}

function getPopulationChamps() {
  /*
  let genePool = [];

  //initialize genePool with weighted entries based on score
  //so a member of the population with score 5 will be in the genePool 5 times
  //this allows for picking a random item from this genePool with the
  //likleyhood of picking a certain member weighted by their score
  for(let i = 0; i < population.length; i++) {
    for(let j = 0; j < population[i].score; j++) {
      genePool.push(i);
    }
  }

  parent = population[random(genePool)];

  return parent;
  */

  let champ = population[0];
  for(let i = 1; i < population.length; i++) {
    champ = population[i].score > champ.score ? population[i] : champ;
    genscore = champ.score;
    hiscore = genscore > hiscore ? genscore : hiscore;
  }
  return champ;
}

function populateNewGeneration(parent) {
  //clear out he old population
  population = [];

  //reset the parent's parameters
  parent.y = height/2;
  parent.x = 64;
  parent.dead = false;
  parent.score = 0;

  //create new population from the parent and mutate the new members
  for(let i = 0; i < populationSize-1; i++) {
    population[i] = parent.copy();
    population[i].mutate(.01);
  }

  //put the original parent into the population
  population.push(parent);

  //reset the pipes
  counter = 0
  pipes = [];
}