//should use gpu.rocks or something similar

class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    copy() {
        let m = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            m.data[i][j] = this.data[i][j];
          }
        }
        return m;
    }
    
    static fromArray(arr) {
        let m = new Matrix(arr.length, 1);
        for (let i = 0; i < m.rows; i++) {
            m.data[i][0] = arr[i];
        }
        return m;
    }

    toArray() {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                array.push(this.data[i][j]);
            }
        }
        return array;
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    add(n) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    static add(a, b) {
        if (a.rows !== b.rows || a.cols !== b.cols) {
            throw 'Columns and Rows of A must match B.';
        }
        let result = new Matrix(a.rows, a.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.data[i][j] = a.data[i][j] + b.data[i][j];
            }
        }
        return result;
    }

    static subtract(a, b) {
        if (a.rows !== b.rows || a.cols !== b.cols) {
            throw 'Columns and Rows of A must match B.';
        }
        let result = new Matrix(a.rows, a.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.data[i][j] = a.data[i][j] - b.data[i][j];
            }
        }
        return result;
    }

    static transpose(m) {
        let result = new Matrix(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                result.data[j][i] += m.data[i][j];
            }
        }
        return result;
    }

    multiply(n) {
        if (n instanceof Matrix) {
            //element-wise multiplication
            //hadamard product
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n.data[i][j];
                }
            }
        } else {
            //scalar procuct
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
    }

    static dot(a, b) {
        //Matrix Product / Dot Product
        if (a.cols !== b.rows) {
            throw 'Columns of A must match rows of B.';
        }
        let result = new Matrix(a.rows, b.cols);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }

        return result;
    }

    map(fn) {
        //Apply a function to every element of a matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = fn(val);
            }
        }
    }

    static map(m, fn) {
        //Apply a function to every element of a matrix
        let result = new Matrix(m.rows, m.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let val = m.data[i][j];
                result.data[i][j] = fn(val);
            }
        }
        return result;
    }

    print() {
        console.table(this.data);
    }
    
    serialize() {
        return JSON.stringify(this);
      }
    
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let matrix = new Matrix(data.rows, data.cols);
        matrix.data = data.data;
        return matrix;
    }
}