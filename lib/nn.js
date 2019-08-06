class NeuralNetwork {
    constructor(shape, learningRate, activationFunction) {
        /*
        Shape is defined like [w, x, y, z] having any number of items in the array
        The first value is the number of input neurons and the last is the number of output neurons
        All values in between are the number of neurons in that hidden layer respectivley

        If a Neural Network is passed in the shape parameter then setup this nn exactly like the passed one
        This functionality is utilized in Neuroevolution to get a copy of an existing Neural Network
        */

        if(shape instanceof NeuralNetwork) {
            let nn = shape;

            //copy the shape and layers
            this.shape = nn.shape;
            this.layers = nn.layers;

            this.weights = Array(this.layers);
            this.bias = Array(this.layers);
            //copy the weight and bias matricies
            for (let i = 0; i < this.layers; i++) {
                this.weights[i] = nn.weights[i].copy();
                this.bias[i] = nn.bias[i].copy();
            }

            //copy the activation and derivative funcitons
            this.activation = nn.activation;
            this.derivative = nn.derivative;

        } else {
            this.shape = shape;
            this.layers = shape.length-1;

            //define weight and bias matricies dependant upon the shape
            //need a weight matrix for connections between each layer so number of layers-1
            this.weights = Array(this.layers);
            this.bias = Array(this.layers);
            for(let i = 0; i < this.layers; i++) {
                this.weights[i] = new Matrix(this.shape[i+1], this.shape[i]);
                this.weights[i].randomize();

                this.bias[i] = new Matrix(this.shape[i+1], 1);
                this.bias[i].randomize();
            }

            this.learningRate = typeof(learningRate) != undefined ? learningRate : .01;

            // Activation Function
            if (activationFunction == 'tanh') {
                this.activation = tanh;
                this.derivative = dtanh;
            } else {
                this.activation = sigmoid;
                this.derivative = dsigmoid;
            }
        }
    }

    //for neuro-evolution
    copy() {
        return new NeuralNetwork(this);
    }
    
    //nudge the values of the weights and bias based on the mutationRate and learningRate
    mutate(mutationRate) {
        //dig into the matrix of each weight and bias and
        //adjust the value
        for (let i in this.weights) {
            for (let j = 0; j < this.weights[i].rows; j++) {
                for (let k = 0; k < this.weights[i].cols; k++) {
                    if (random(1) < mutationRate) {
                        let offset = randomGaussian() * 0.1;
                        this.weights[i].data[j][k] += offset;
                    }
                }
            }
        }
        for (let i in this.bias) {
            for (let j = 0; j < this.bias[i].rows; j++) {
                for (let k = 0; k < this.bias[i].cols; k++) {
                    if (random(1) < mutationRate) {
                        let offset = randomGaussian() * 0.1;
                        this.bias[i].data[j][k] += offset;
                    }
                }
            }
        }
    }

    query(input_array) {
        /*
        Take in an array of input data and pass it through each layer of the neural network
        The output of one layer is the input to the next layer
        Note: this is a fully connected network
        */
        let data = Matrix.fromArray(input_array);

        for(let i = 0; i < this.layers; i++) {
            data = Matrix.dot(this.weights[i], data);
            data.add(this.bias[i]);
            data.map(this.activation);
        }

        return data.toArray();
    }

    train(input_array, answer_array) {
        /*
        This train function uses stochastic gradient descent
        Takes in an input and the answer to that input and adjusts the weights and bias'
        According to that set of input/expectedoutput pair

        TODO: implement epoch training that takes in a batch of input/expectedoutput pairs and calculate the gradient descent according to the entire set 
        */
        
        //same as query but save the output of each layer to an array
        let data = Matrix.fromArray(input_array);
        let outputs = [];

        for(let i = 0; i < this.layers; i++) {
            //inputs is the first element in outputs array
            outputs[i] = data;

            data = Matrix.dot(this.weights[i], data);
            data.add(this.bias[i]);
            data.map(this.activation);
        }
        outputs[this.layers] = data;

        //Convert arrays to matrix
        let targets = Matrix.fromArray(answer_array);

        //get the error of the output
        let errors = Matrix.subtract(targets, outputs[this.layers]);
        //starting with the last layer propagate this error backwards through the network and adjust the weights
        for (let i = this.layers-1; i >= 0; i--) {
            //calculate gradient
            let gradient = Matrix.map(outputs[i+1], this.derivative);
            gradient.multiply(errors);
            gradient.multiply(this.learningRate);

            //calculate delta and adjust weights
            let outputPreviousLayerT = Matrix.transpose(outputs[i]);
            let delta = Matrix.dot(gradient, outputPreviousLayerT);
            this.weights[i].add(delta);

            //adjust the bias' by its delta which is the gradient
            this.bias[i].add(gradient);

            //calculate error for next layer
            let t = Matrix.transpose(this.weights[i]);
            errors = Matrix.dot(t, errors);
        }
    }

    //dump all weights and bias' to the console for debugging
    dump() {
        for (let i in this.weights) {
            this.weights[i].print();
        }
        for (let i in this.bias) {
            this.bias[i].print();
        }
    }

    setLearningRate(lr) {
        this.learningRate = lr;
    }

    //save a Neural Network
    serialize() {
        return JSON.stringify(this);
    }
    
    //load a saved a Neural Network
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.shape);

        let w = [];
        let b = [];
        for (let i = 0; i < data.weights.length; i++) {
            w.push(Matrix.deserialize(data.weights[i]));
            b.push(Matrix.deserialize(data.bias[i]));
        }
        nn.weights = w;
        nn.bias = b;
        nn.learning_rate = data.learning_rate;
        return nn;
    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
function dsigmoid(y) {
    //return sigmoid(x) * (1 - sigmoid(x));
    return y * (1 - y);
}

function tanh (x) {
    return Math.tanh(x);
  }
  
function dtanh (x) {
    return 1 / (pow(Math.cosh(x), 2));
}