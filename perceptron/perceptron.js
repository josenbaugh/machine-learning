class Perceptron {

    constructor(n, lr) {
        this.weights = new Array(n);
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = random(-1, 1);
          }
        this.learningRate = lr;
    }

    setLearningRate(lr) {
        this.learningRate = lr;
    }

    guess(inputs) {
        var sum = 0;
        for (let i = 0; i < this.weights.length; i ++) 
            sum += inputs[i]*this.weights[i];

        return this.activationFunction(sum);
    }

    train(inputs, target) {
        var guess = this.guess(inputs);
        var error = target - guess;

        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * this.learningRate;
            //console.log(this.weights[i]);
        }

    }

    activationFunction(num) {
        //sign
        return num >= 0 ? 1 : -1;
    }

    guessY(x) {
        m = this.weights[0] / this.weights[1];
        b = this.weights[2] / this.weights[1];
        return -(m * x) - b;
    }
}