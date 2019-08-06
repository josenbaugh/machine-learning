class Bird {
    constructor(brain) {
        this.y = height/2;
        this.x = 64;
    
        this.gravity = 0.7;
        this.lift = -12;
        this.velocity = 0;

        this.dead = false;
        this.score = 0;
        this.fitness = 0;

        // Is this a copy of another Bird or a new one?
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork([5, 8, 4, 1]);
        }
    }

    think(pipes) {
        // find the closest pipe
        let closest = null;
        let record = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            let diff = pipes[i].x - this.x;
            if (diff > 0 && diff < record) {
                record = diff;
                closest = pipes[i];
            }
        }

        //inputs are taken from the game state of the frame and normalized to a value between 0 and 1
        let inputs = [
            map(this.velocity, -5, 5, 0, 1),        //bird's y velocity
            map(this.y, 0, height, 0, 1),           //bird's y position
            map(closest.x, this.x, width, 0, 1),    //x position of the closest pipe
            map(closest.top, 0, height, 0, 1),      //top of the closest pipe opening
            map(closest.bottom, 0, height, 0, 1)    //bottom of the closest pipe opening
        ];

        //thought is a value between 0 and 1
        let thought = this.brain.query(inputs);
        if (thought > .5) {
            this.up();
        }
    }

    // Create a copy of this bird
    copy() {
        return new Bird(this.brain);
    }

    mutate(mr) {
        this.brain.mutate(mr);
    }
  
    show() {
      fill(255, 100);
      stroke(255);
      ellipse(this.x, this.y, 32, 32);
    }
  
    up() {
      this.velocity += this.lift;
    }
  
    update() {
      this.velocity += this.gravity;
      // this.velocity *= 0.9;
      this.y += this.velocity;
  
      if (this.y > height) {
        this.y = height;
        this.velocity = 0;
      }
  
      if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      }
  
    }
  
  }